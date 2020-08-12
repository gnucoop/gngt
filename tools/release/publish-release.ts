import chalk from 'chalk';
import {readFileSync, unlinkSync} from 'fs';
import {homedir} from 'os';
import {join} from 'path';
import {BaseReleaseTask} from './base-release-task';
import {checkReleaseOutput} from './check-release-output';
import {extractReleaseNotes} from './extract-release-notes';
import {GitClient} from './git/git-client';
import {getGithubNewReleaseUrl} from './git/github-urls';
import {npmPublish} from './npm/npm-client';
import {promptForNpmDistTag} from './prompt/npm-dist-tag-prompt';
import {promptForUpstreamRemote} from './prompt/upstream-remote-prompt';
import {releasePackages} from './release-output/release-packages';
import {CHANGELOG_FILE_NAME} from './stage-release';
import {parseVersionName, Version} from './version-name/parse-version';

// The package builder script is not written in TypeScript and needs to
// be imported through a CommonJS import.
const {performNpmReleaseBuild} = require('../../scripts/build-packages-dist');

/**
 * Class that can be instantiated in order to create a new release. The tasks requires user
 * interaction/input through command line prompts.
 */
class PublishReleaseTask extends BaseReleaseTask {

  /** Path to the project package JSON. */
  packageJsonPath: string;

  /** Serialized package.json of the specified project. */
  packageJson: any;

  /** Parsed current version of the project. */
  currentVersion: Version;

  /** Path to the release output of the project. */
  releaseOutputPath: string;

  /** Instance of a wrapper that can execute Git commands. */
  git: GitClient;

  constructor(public projectDir: string,
              public repositoryOwner: string,
              public repositoryName: string) {
    super(new GitClient(projectDir,
      `https://github.com/${repositoryOwner}/${repositoryName}.git`));

    this.packageJsonPath = join(projectDir, 'package.json');
    this.releaseOutputPath = join(projectDir, 'dist/releases');

    this.packageJson = JSON.parse(readFileSync(this.packageJsonPath, 'utf-8'));

    const parsedVersion = parseVersionName(this.packageJson.version);
    if (!parsedVersion) {
      console.error(chalk.red(
        `Cannot parse current version in ${chalk.italic('package.json')}. Please ` +
        `make sure "${this.packageJson.version}" is a valid Semver version.`));
      process.exit(1);
      return;
    }
    this.currentVersion = parsedVersion;
  }

  async run() {
    console.log();
    console.log(chalk.green('----------------------------------------'));
    console.log(chalk.green(chalk.bold('           Gngt release script           ')));
    console.log(chalk.green('----------------------------------------'));
    console.log();

    const newVersion = this.currentVersion;
    const newVersionName = this.currentVersion.format();

    // Ensure there are no uncommitted changes. Checking this before switching to a
    // publish branch is sufficient as unstaged changes are not specific to Git branches.
    this.verifyNoUncommittedChanges();

    // Branch that will be used to build the output for the release of the current version.
    const publishBranch = await this.assertValidPublishBranch(newVersion);

    this._verifyLastCommitFromStagingScript();
    this.verifyLocalCommitsMatchUpstream(publishBranch);

    const upstreamRemote = await this._getProjectUpstreamRemote();
    const npmDistTag = await promptForNpmDistTag(newVersion);

    // In case the user wants to publish a stable version to the "next" npm tag, we want
    // to double-check because usually only pre-release's are pushed to that tag.
    if (npmDistTag === 'next' && !newVersion.prereleaseLabel) {
      await this._promptStableVersionForNextTag();
    }

    performNpmReleaseBuild();
    console.info(chalk.green(`  ✓   Built the release output.`));

    // Checks all release packages against release output validations before releasing.
    checkReleaseOutput(this.releaseOutputPath, this.currentVersion.format());

    // Extract the release notes for the new version from the changelog file.
    const extractedReleaseNotes = extractReleaseNotes(
      join(this.projectDir, CHANGELOG_FILE_NAME), newVersionName);

    if (!extractedReleaseNotes) {
      console.error(chalk.red(`  ✘   Could not find release notes in the changelog.`));
      process.exit(1);
      return;
    }

    const {releaseNotes, releaseTitle} = extractedReleaseNotes;

    // Create and push the release tag before publishing to NPM.
    this._createReleaseTag(newVersionName, releaseNotes);
    this._pushReleaseTag(newVersionName, upstreamRemote);

    // Just in order to double-check that the user is sure to publish to NPM, we want
    // the user to interactively confirm that the script should continue.
    await this._promptConfirmReleasePublish();

    for (let packageName of releasePackages) {
      this._publishPackageToNpm(packageName, npmDistTag);
    }

    const newReleaseUrl = getGithubNewReleaseUrl({
      owner: this.repositoryOwner,
      repository: this.repositoryName,
      tagName: newVersionName,
      releaseTitle: releaseTitle,
      // TODO: we cannot insert the real changelog here since the URL would become
      // way too large and Github would consider this as a malformed page request.
      body: 'Copy-paste changelog in here!'
    });

    console.log();
    console.info(chalk.green(chalk.bold(`  ✓   Published all packages successfully`)));
    console.info(chalk.yellow(`  ⚠   Please draft a new release of the version on Github.`));
    console.info(chalk.yellow(`      ${newReleaseUrl}`));

    // Remove file at ~/.npmrc after release is complete.
    unlinkSync(`${homedir()}/.npmrc`);
  }

  /**
   * Verifies that the latest commit on the current branch has been created
   * through the release staging script.
   */
  private _verifyLastCommitFromStagingScript() {
    if (!/chore: (bump version|update changelog for)/.test(this.git.getCommitTitle('HEAD'))) {
      console.error(chalk.red(`  ✘   The latest commit of the current branch does not seem to be ` +
        ` created by the release staging script.`));
      console.error(chalk.red(`      Please stage the release using the staging script.`));
      process.exit(1);
    }
  }

  /**
   * Prompts the user whether they are sure that the current stable version should be
   * released to the "next" NPM dist-tag.
   */
  private async _promptStableVersionForNextTag() {
    if (!await this.promptConfirm(
        'Are you sure that you want to release a stable version to the "next" tag?')) {
      console.log();
      console.log(chalk.yellow('Aborting publish...'));
      process.exit(0);
    }
  }

  /**
   * Prompts the user whether he is sure that the script should continue publishing
   * the release to NPM.
   */
  private async _promptConfirmReleasePublish() {
    if (!await this.promptConfirm('Are you sure that you want to release now?')) {
      console.log();
      console.log(chalk.yellow('Aborting publish...'));
      process.exit(0);
    }
  }

  /** Publishes the specified package within the given NPM dist tag. */
  private _publishPackageToNpm(packageName: string, npmDistTag: string) {
    console.info(chalk.green(`  ⭮   Publishing "${packageName}"..`));

    const errorOutput = npmPublish(join(this.releaseOutputPath, packageName), npmDistTag);

    if (errorOutput) {
      console.error(chalk.red(`  ✘   An error occurred while publishing "${packageName}".`));
      console.error(chalk.red(`      Please check the terminal output and reach out to the team.`));
      console.error(chalk.red(`\n${errorOutput}`));
      process.exit(1);
    }

    console.info(chalk.green(`  ✓   Successfully published "${packageName}"`));
  }

  /** Creates the specified release tag locally. */
  private _createReleaseTag(tagName: string, releaseNotes: string) {
    if (this.git.hasLocalTag(tagName)) {
      const expectedSha = this.git.getLocalCommitSha('HEAD');

      if (this.git.getShaOfLocalTag(tagName) !== expectedSha) {
        console.error(chalk.red(
          `  ✘   Tag "${tagName}" already exists locally, but does not refer ` +
          `to the version bump commit. Please delete the tag if you want to proceed.`));
        process.exit(1);
      }

      console.info(chalk.green(`  ✓   Release tag already exists: "${chalk.italic(tagName)}"`));
    } else if (this.git.createTag('HEAD', tagName, releaseNotes)) {
      console.info(chalk.green(`  ✓   Created release tag: "${chalk.italic(tagName)}"`));
    } else {
      console.error(chalk.red(`  ✘   Could not create the "${tagName}" tag.`));
      console.error(chalk.red(
        `      Please make sure there is no existing tag with the same name.`));
      process.exit(1);
    }

  }

  /** Pushes the release tag to the remote repository. */
  private _pushReleaseTag(tagName: string, upstreamRemote: string) {
    const remoteTagSha = this.git.getShaOfRemoteTag(tagName);
    const expectedSha = this.git.getLocalCommitSha('HEAD');

    // The remote tag SHA is empty if the tag does not exist in the remote repository.
    if (remoteTagSha) {
      if (remoteTagSha !== expectedSha) {
        console.error(chalk.red(
          `  ✘   Tag "${tagName}" already exists on the remote, but does not ` +
          `refer to the version bump commit.`));
        console.error(chalk.red(
          `      Please delete the tag on the remote if you want to proceed.`));
        process.exit(1);
      }

      console.info(chalk.green(
        `  ✓   Release tag already exists remotely: "${chalk.italic(tagName)}"`));
      return;
    }

    if (!this.git.pushTagToRemote(tagName, upstreamRemote)) {
      console.error(chalk.red(`  ✘   Could not push the "${tagName}" tag upstream.`));
      console.error(chalk.red(`      Please make sure you have permission to push to the ` +
        `"${this.git.remoteGitUrl}" remote.`));
      process.exit(1);
    }

    console.info(chalk.green(`  ✓   Pushed release tag upstream.`));
  }

  /**
   * Determines the name of the Git remote that is used for pushing changes
   * upstream to github.
   */
  private async _getProjectUpstreamRemote() {
    const remoteName = this.git.hasRemote('upstream') ?
        'upstream' : await promptForUpstreamRemote(this.git.getAvailableRemotes());

    console.info(chalk.green(
      `  ✓   Using the "${remoteName}" remote for pushing changes upstream.`));
    return remoteName;
  }
}

/** Entry-point for the create release script. */
if (require.main === module) {
  new PublishReleaseTask(join(__dirname, '../../'), 'gnucoop', 'gngt').run();
}

