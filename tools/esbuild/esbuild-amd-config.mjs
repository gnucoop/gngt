import {readFileSync} from 'fs';

const findSearchStr = `guardedConsole('error', 'pouchdb-find plugin error: ' +\n`
    + `    'Cannot find global "PouchDB" object! ' +\n`
    + `    'Did you remember to include pouchdb.js?');`;
const pouchdDbPlugin = {
  name: 'pouchdb',
  setup(build) {
    build.onLoad({filter: /pouchdb\.(find|memory)\.js/}, async (args) => {
      let contents = await new Promise((resolve, reject) => {
        const content = readFileSync(args.path, 'utf-8')
          .replace(findSearchStr, 'PouchDBPlugin = plugin;');
        resolve(`var PouchDBPlugin;\n${content}\nmodule.exports = PouchDBPlugin;`);
      });
      return {contents};
    });
  },
};

export default {
  globalName: "__exports",
  banner: {js: 'define("TMPL_MODULE_NAME", [], function() {'},
  footer: {js: 'return __exports;})'},
  plugins: [pouchdDbPlugin],
};
