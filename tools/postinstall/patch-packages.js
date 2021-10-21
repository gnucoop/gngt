const fs = require('fs');
const path = require('path');

const packages = ['@gic', '@ionic'];

packages.forEach(package => {
  const packageJsonPath = path.posix.join(
    'node_modules',
    package,
    'core',
    'loader',
    'package.json',
  );
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.name = `${package}/core/loader`;
  packageJson.browser = './index.cjs.js';
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson));
});

pouchdbPath = path.posix.join('node_modules', 'pouchdb');
packageJsonPath = path.posix.join(pouchdbPath, 'package.json');
packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
packageJson.browser = './dist/pouchdb.js';
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson));

pouchdbAdapterMemoryPath = path.posix.join('node_modules', 'pouchdb-adapter-memory');
const src = path.posix.join(pouchdbPath, 'dist', 'pouchdb.memory.js');
const dst = path.posix.join(pouchdbAdapterMemoryPath, 'pouchdb.memory.js');
let content = fs.readFileSync(src, 'utf8');
content = content.replace(
  `guardedConsole('error', 'memory adapter plugin error: ' +\n` +
    `    'Cannot find global "PouchDB" object! ' +\n` +
    `    'Did you remember to include pouchdb.js?');`,
  'PouchDBPlugin = MemoryPouchPlugin;',
);
fs.writeFileSync(dst, `var PouchDBPlugin;\n${content}\nmodule.exports = PouchDBPlugin;`);
packageJsonPath = path.posix.join(pouchdbAdapterMemoryPath, 'package.json');
packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
packageJson.browser = './pouchdb.memory.js';
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson));
