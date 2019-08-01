declare const requirejs: any;

const nodeModulesBasePath = '/base/npm/node_modules/';

const paths = {
  '@gic/angular': `${nodeModulesBasePath}@gic/angular/angular.umd`,
  '@gic/core': `${nodeModulesBasePath}@gic/core/core.umd`,
  '@gic/core/loader': `${nodeModulesBasePath}@gic/core/core-loader.umd`,
  '@ionic/angular': `${nodeModulesBasePath}@ionic/angular/angular.umd`,
  '@ionic/core': `${nodeModulesBasePath}@ionic/core/core.umd`,
  '@ionic/core/loader': `${nodeModulesBasePath}@ionic/core/core-loader.umd`,
  'date-fns': `${nodeModulesBasePath}date-fns/date-fns.umd`,
  'debug': `${nodeModulesBasePath}debug/debug.umd`,
  'pouchdb': `${nodeModulesBasePath}pouchdb/pouchdb.umd`,
  'pouchdb-debug': `${nodeModulesBasePath}pouchdb-debug/pouchdb-debug.umd`,
  'pouchdb-find': `${nodeModulesBasePath}pouchdb-find/pouchdb-find.umd`,
  'url-parse': `${nodeModulesBasePath}url-parse/url-parse.umd`,
  'uuid': `${nodeModulesBasePath}uuid/uuid.umd`,
};

requirejs.config({paths, nodeIdCompat: true});
