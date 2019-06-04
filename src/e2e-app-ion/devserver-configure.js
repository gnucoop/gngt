// We need to configure AMD modules which are not named because otherwise "require.js" is not
// able to resolve AMD imports to such modules.
require.config({
  paths: {
    '@gic/angular': 'gic-angular.umd',
    '@ionic/angular': 'ionic-angular.umd',
    '@gic/core': 'gic-core.umd',
    '@gic/core/loader': 'gic-core-loader.umd',
    '@ionic/core': 'ionic-core.umd',
    '@ionic/core/loader': 'ionic-core-loader.umd',
    '@ngx-translate/core': '@ngx-translate/core/bundles/ngx-translate-core.umd',
    '@ngx-translate/http-loader': '@ngx-translate/http-loader/bundles/ngx-translate-http-loader.umd',
    'date-fns': 'date-fns.umd',
    'url-parse': 'url-parse/dist/url-parse.min',
    'uuid': `uuid.umd`,
  }
});

var module = {id: ''};
