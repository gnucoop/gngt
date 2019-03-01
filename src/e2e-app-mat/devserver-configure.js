// We need to configure AMD modules which are not named because otherwise "require.js" is not
// able to resolve AMD imports to such modules.
require.config({
  paths: {
    '@ngx-translate/core': '@ngx-translate/core/bundles/ngx-translate-core.umd',
    '@ngx-translate/http-loader': '@ngx-translate/http-loader/bundles/ngx-translate-http-loader.umd',
    'date-fns': 'date-fns.umd',
  }
});

var module = {id: ''};
