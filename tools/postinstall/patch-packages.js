const fs = require('fs');

const ngDevFile = 'node_modules/@angular/dev-infra-private/ng-dev/cli-bundle.js';
let ngDev = fs.readFileSync(ngDevFile, 'utf8');
ngDev = ngDev.replace(
`    function getReleaseTagForVersion(version) {
      return version.format();
    }`,
`    function getReleaseTagForVersion(version) {
      return 'v' + version.format();
    }`);
fs.writeFileSync(ngDevFile, ngDev);

const ioniconsFile = 'node_modules/ionicons/dist/types/components.d.ts';
let ionicons = fs.readFileSync(ioniconsFile, 'utf8');
ionicons = ionicons.replace(/"aria(Hidden|Label)"\?:/gm, '"aria$1":');
fs.writeFileSync(ioniconsFile, ionicons);
