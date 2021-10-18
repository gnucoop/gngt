import fs from 'fs';
import path from 'path';

const resolvePath = (args, modulePath) => {
  return {path: path.join(process.cwd(), 'node_modules', modulePath)};
};

export const customResolvePlugin = {
  name: 'custom-resolve-plugin',
  setup(build) {
    build.onResolve({filter: /^@gic\/core\/loader$/}, (args) => {
      return resolvePath(args, '@gic/core/loader/cdn.js');
    });
    build.onResolve({filter: /^@ionic\/core\/loader$/}, (args) => {
      return resolvePath(args, '@ionic/core/loader/cdn.js');
    });
    build.onResolve({filter: /^pouchdb$/}, (args) => {
      return resolvePath(args, 'pouchdb/dist/pouchdb.js');
    });
    build.onResolve({filter: /^pouchdb-adapter-memory$/}, (args) => {
      return resolvePath(args, 'pouchdb/dist/pouchdb.memory.js');
    });
    build.onResolve({filter: /^pouchdb-find$/}, (args) => {
      return resolvePath(args, 'pouchdb/dist/pouchdb.find.js');
    });
    build.onLoad({filter: /pouchdb\.find\.js/}, (args) => {
      const rep = 'if (typeof PouchDB === \'undefined\') {\n' +
        '  guardedConsole(\'error\', \'pouchdb-find plugin error: \' +\n' +
        '    \'Cannot find global "PouchDB" object! \' +\n' +
        '    \'Did you remember to include pouchdb.js?\');\n' +
        '} else {\n' +
        '  PouchDB.plugin(plugin);\n' +
        '}\n';
      const contents = `var modExports;\n`
        + `${fs.readFileSync(args.path, 'utf-8').replace(rep, 'modExports = plugin;\n')}\n`
        + `module.exports = modExports;\n`;
      return {contents};
    });
    build.onLoad({filter: /pouchdb\.memory\.js/}, (args) => {
      const rep = 'if (typeof PouchDB === \'undefined\') {\n' +
        '  guardedConsole(\'error\', \'memory adapter plugin error: \' +\n' +
        '    \'Cannot find global "PouchDB" object! \' +\n' +
        '    \'Did you remember to include pouchdb.js?\');\n' +
        '} else {\n' +
        '  PouchDB.plugin(MemoryPouchPlugin);\n' +
        '}\n';
      const contents = `var modExports;\n`
        + `${fs.readFileSync(args.path, 'utf-8').replace(rep, 'modExports = MemoryPouchPlugin;\n')}\n`
        + `module.exports = modExports;\n`;
      return {contents};
    });
  },
};
