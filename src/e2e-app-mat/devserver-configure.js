// We need to configure AMD modules which are not named because otherwise "require.js" is not
// able to resolve AMD imports to such modules.

const nodeModulesBasePath = '/base/npm/node_modules/';

require.config({
  paths: {
    'date-fns': `${nodeModulesBasePath}date-fns/date-fns.umd`,
    'debug': `${nodeModulesBasePath}debug/debug.umd`,
    'pouchdb': `${nodeModulesBasePath}pouchdb/pouchdb.umd`,
    'pouchdb-debug': `${nodeModulesBasePath}pouchdb-debug/pouchdb-debug.umd`,
    'pouchdb-find': `${nodeModulesBasePath}pouchdb-find/pouchdb-find.umd`,
    'url-parse': `${nodeModulesBasePath}url-parse/url-parse.umd`,
    'uuid': `${nodeModulesBasePath}uuid/uuid.umd`,
  }
});

var module = {id: ''};
