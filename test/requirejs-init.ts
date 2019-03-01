declare const requirejs: any;

const bundlesBasePath = '/base/gngt/test/';
const nodeModulesBasePath = '/base/gngtdeps/node_modules/';

const paths = {
  '@ionic/angular': `${bundlesBasePath}ionic-angular.umd`,
  '@ionic/core': `${bundlesBasePath}ionic-core.umd`,
  '@ionic/core/loader': `${bundlesBasePath}ionic-core-loader.umd`,
  '@ngx-translate/core': `${nodeModulesBasePath}@ngx-translate/core/bundles/ngx-translate-core.umd`,
  'date-fns': `${bundlesBasePath}date-fns.umd`,
};

requirejs.config({paths, nodeIdCompat: true});
