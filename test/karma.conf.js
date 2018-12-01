const path = require('path');
const {customLaunchers, platformMap} = require('./browser-providers');

module.exports = (config) => {

  config.set({
    basePath: path.join(__dirname, '..'),
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-browserstack-launcher'),
      require('karma-sauce-launcher'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-sourcemap-loader'),
      require('karma-coverage'),
    ],
    files: [
      {pattern: 'node_modules/core-js/client/core.min.js', included: true, watched: false},
      {pattern: 'node_modules/tslib/tslib.js', included: true, watched: false},
      {pattern: 'node_modules/systemjs/dist/system.js', included: true, watched: false},
      {pattern: 'node_modules/zone.js/dist/zone.min.js', included: true, watched: false},
      {pattern: 'node_modules/zone.js/dist/proxy.min.js', included: true, watched: false},
      {pattern: 'node_modules/zone.js/dist/sync-test.js', included: true, watched: false},
      {pattern: 'node_modules/zone.js/dist/jasmine-patch.min.js', included: true, watched: false},
      {pattern: 'node_modules/zone.js/dist/async-test.js', included: true, watched: false},
      {pattern: 'node_modules/zone.js/dist/fake-async-test.js', included: true, watched: false},
      {pattern: 'node_modules/hammerjs/hammer.min.js', included: true, watched: false},
      {pattern: 'node_modules/date-fns/min/index.js', included: true, watched: false},

      // Include all Angular dependencies
      {pattern: 'node_modules/@angular/**/*', included: false, watched: false},
      {pattern: 'node_modules/@ngx-translate/**/*', included: false, watched: false},
      {pattern: 'node_modules/rxjs/**/*', included: false, watched: false},

      {pattern: 'node_modules/crypto-js/crypto-js.js', included: true, watched: false},
      {pattern: 'node_modules/crypto-js/index.js', included: true, watched: false},
      {pattern: 'node_modules/crypto-js/*.js', included: false, watched: false},

      {pattern: 'test/karma-system-config.js', included: true, watched: false},
      {pattern: 'test/karma-test-shim.js', included: true, watched: false},

      // Includes all package tests and source files into karma. Those files will be watched.
      // This pattern also matches all sourcemap files and TypeScript files for debugging.
      {pattern: 'dist/packages/**/*', included: false, watched: true},
    ],

    customLaunchers: customLaunchers,

    preprocessors: {
      'dist/packages/**/*.js': ['sourcemap']
    },

    reporters: ['dots'],
    autoWatch: false,

    coverageReporter: {
      type : 'json-summary',
      dir : 'dist/coverage/',
      subdir: '.'
    },

    sauceLabs: {
      testName: 'Gngt Unit Tests',
      startConnect: false,
      recordVideo: false,
      recordScreenshots: false,
      idleTimeout: 600,
      commandTimeout: 600,
      maxDuration: 5400,
    },

    browserStack: {
      project: 'Gngt Unit Tests',
      startTunnel: false,
      retryLimit: 3,
      timeout: 1800,
      video: false,
    },

    browserDisconnectTimeout: 180000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 300000,
    captureTimeout: 180000,

    browsers: ['Chrome'],
    singleRun: false,

    // Try Websocket for a faster transmission first. Fallback to polling if necessary.
    transports: ['websocket', 'polling'],

    browserConsoleLogOptions: {
      terminal: true,
      level: 'log'
    },

    client: {
      jasmine: {
        // TODO(jelbourn): re-enable random test order once we can de-flake existing issues.
        random: false
      }
    },
  });

  if (process.env['CIRCLECI']) {
    const containerInstanceIndex = Number(process.env['CIRCLE_NODE_INDEX']);
    const maxParallelContainerInstances = Number(process.env['CIRCLE_NODE_TOTAL']);
    const tunnelIdentifier =
        `angular-material-${process.env['CIRCLE_BUILD_NUM']}-${containerInstanceIndex}`;
    const buildIdentifier = `circleci-${tunnelIdentifier}`;
    const testPlatform = process.env['TEST_PLATFORM'];

    // This defines how often a given browser should be launched in the same CircleCI
    // container. This is helpful if we want to shard tests across the same browser.
    const parallelBrowserInstances = Number(process.env['KARMA_PARALLEL_BROWSERS']) || 1;

    // In case there should be multiple instances of the browsers, we need to set up the
    // the karma-parallel plugin.
    if (parallelBrowserInstances > 1) {
      config.frameworks.unshift('parallel');
      config.plugins.push(require('karma-parallel'));
      config.parallelOptions = {
        executors: parallelBrowserInstances,
        shardStrategy: 'round-robin',
      }
    }

    if (testPlatform === 'browserstack') {
      config.browserStack.build = buildIdentifier;
      config.browserStack.tunnelIdentifier = tunnelIdentifier;
    } else if (testPlatform === 'saucelabs') {
      config.sauceLabs.build = buildIdentifier;
      config.sauceLabs.tunnelIdentifier = tunnelIdentifier;
    }

    const platformBrowsers = platformMap[testPlatform];
    const browserInstanceChunks = splitBrowsersIntoInstances(
        platformBrowsers, maxParallelContainerInstances);

    // Configure Karma to launch the browsers that belong to the given test platform and
    // container instance.
    config.browsers = browserInstanceChunks[containerInstanceIndex];
  }

  if (process.env['TRAVIS']) {
    const buildId = `TRAVIS #${process.env.TRAVIS_BUILD_NUMBER} (${process.env.TRAVIS_BUILD_ID})`;

    if (process.env['TRAVIS_PULL_REQUEST'] === 'false' &&
        process.env['MODE'] === "travis_required") {

      config.preprocessors['dist/packages/**/!(*+(.|-)spec).js'] = ['coverage'];
      config.reporters.push('coverage');
    }

    // The MODE variable is the indicator of what row in the test matrix we're running.
    // It will look like <platform>_<target>, where platform is one of 'saucelabs', 'browserstack'
    // or 'travis'. The target is a reference to different collections of browsers that can run
    // in the previously specified platform.
    // TODO(devversion): when moving Saucelabs and Browserstack to Circle, remove the target part.
    const [platform] = process.env.MODE.split('_');

    if (platform === 'saucelabs') {
      config.sauceLabs.build = buildId;
      config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_ID;
    } else if (platform === 'browserstack') {
      config.browserStack.build = buildId;
      config.browserStack.tunnelIdentifier = process.env.TRAVIS_JOB_ID;
    } else if (platform !== 'travis') {
      throw new Error(`Platform "${platform}" unknown, but Travis specified. Exiting.`);
    }

    if (platform !== 'travis') {
      // To guarantee a better stability for tests running on external browsers, we disable
      // concurrency. Stability is compared to speed more important.
      config.concurrency = 1;
    }

    config.browsers = platformMap[platform];
  }
};

/**
 * Splits the specified browsers into a maximum amount of chunks. The chunk of browsers
 * are being created deterministically and therefore we get reproducible tests when executing
 * the same CircleCI instance multiple times.
 */
function splitBrowsersIntoInstances(browsers, maxInstances) {
  let chunks = [];
  let assignedBrowsers = 0;

  for (let i = 0; i < maxInstances; i++) {
    const chunkSize = Math.floor((browsers.length - assignedBrowsers) / (maxInstances - i));
    chunks[i] = browsers.slice(assignedBrowsers, assignedBrowsers + chunkSize);
    assignedBrowsers += chunkSize;
  }

  return chunks;
}
