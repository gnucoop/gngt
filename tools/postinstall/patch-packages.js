const fs = require('fs');
const path = require('path');

const packages = ['@gic', '@ionic'];

packages.forEach(package => {
  const packageJsonPath = path.posix.join('node_modules', package, 'core', 'loader', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.name = `${package}/core/loader`;
  packageJson.browser = './index.cjs.js';
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson));
});

packageJsonPath = path.posix.join('node_modules', 'pouchdb', 'package.json');
packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
packageJson.browser = './dist/pouchdb.js';
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson));

const ioniconsFile = 'node_modules/ionicons/dist/types/components.d.ts';
let ionicons = fs.readFileSync(ioniconsFile, 'utf8');
ionicons = ionicons.replace(/"aria(Hidden|Label)"\?:/gm, '"aria$1":');
fs.writeFileSync(ioniconsFile, ionicons);
