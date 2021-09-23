#!/usr/bin/env node

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const packages = [
  'core',
  'ionic',
  'material',
];
const cwd = process.cwd();
const mainPackage = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
const baseVersion = mainPackage.version;
const sha = childProcess.execSync('git rev-parse --short HEAD').toString('utf-8').trim();
const version = `${baseVersion}-${sha}`;

for (const package of packages) {
  const packageDir = path.join(cwd, 'dist/releases', package);
  const packageJsonPath = path.join(packageDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.version = version;
  for (const dep in packageJson.dependencies) {
    if (dep.startsWith('@gngt') && packageJson.dependencies[dep] === baseVersion) {
      packageJson.dependencies[dep] = version;
    }
  }
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  childProcess.execSync(`cd ${packageDir} ; yarn pack`);
}
