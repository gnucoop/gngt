declare const requirejs: any;

const bundlesBasePath = '/base/gngt/test/';
const nodeModulesBasePath = '/base/gngtdeps/node_modules/';

const paths = {
  '@gic/angular': `${bundlesBasePath}gic-angular.umd`,
  '@gic/core': `${bundlesBasePath}gic-core.umd`,
  '@gic/core/loader': `${bundlesBasePath}gic-core-loader.umd`,
  '@ionic/angular': `${bundlesBasePath}ionic-angular.umd`,
  '@ionic/core': `${bundlesBasePath}ionic-core.umd`,
  '@ionic/core/loader': `${bundlesBasePath}ionic-core-loader.umd`,
  '@ngx-translate/core': `${nodeModulesBasePath}@ngx-translate/core/bundles/ngx-translate-core.umd`,
  'date-fns': `${bundlesBasePath}date-fns.umd`,
  'pouchdb': `${nodeModulesBasePath}pouchdb/dist/pouchdb`,
  'pouchdb-debug': `${bundlesBasePath}pouchdb-debug.umd`,
  'pouchdb-find': `${bundlesBasePath}pouchdb-find.umd`,
  'url-parse': `${nodeModulesBasePath}url-parse/dist/url-parse.min`,
  'uuid': `${bundlesBasePath}uuid.umd`,
};

requirejs.config({paths, nodeIdCompat: true});
