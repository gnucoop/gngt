const path = require('path');
const {customLaunchers, platformMap} = require('./browser-providers');

module.exports = (config) => {

  config.set({
    basePath: path.join(__dirname, '..'),
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-browserstack-launcher'),
      require('karma-sauce-launcher'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-sourcemap-loader'),
    ],
    files: [
      {pattern: 'node_modules/core-js/client/core.min.js', included: true, watched: false},
      {pattern: 'node_modules/tslib/tslib.js', included: true, watched: false},
      {pattern: 'node_modules/systemjs/dist/system.js', included: true, watched: false},
      {pattern: 'node_modules/zone.js/dist/zone.min.js', included: true, watched: false},
      {pattern: 'node_modules/zone.js/dist/proxy.min.js', included: true, watched: false},
      {pattern: 'node_modules/zone.js/dist/sync-test.js', included: true, watched: false},
      {pattern: 'node_modules/zone.js/dist/jasmine-patch.min.js', included: true, watched: false},
      {pattern: 'node_modules/zone.js/dist/async-test.js', included: true, watched: false},
      {pattern: 'node_modules/zone.js/dist/fake-async-test.js', included: true, watched: false},
      {pattern: 'node_modules/hammerjs/hammer.min.js', included: true, watched: false},

      // Include all Gngt dependencies
      {pattern: 'node_modules/@angular/**/*', included: false, watched: false},
      {pattern: 'node_modules/@ngx-translate/**/*', included: false, watched: false},
      {pattern: 'node_modules/@ngrx/**/*', included: false, watched: false},
      {pattern: 'node_modules/rxjs/**/*', included: false, watched: false},
      {pattern: 'node_modules/date-fns/**/*.js', included: false, watched: false},
      {pattern: 'node_modules/systemjs-plugin-babel/**/*.js', included: false, watched: false},
      {pattern: 'node_modules/url-parse/dist/*.js', included: false, watched: false},

      {pattern: 'node_modules/crypto-js/crypto-js.js', included: true, watched: false},
      {pattern: 'node_modules/crypto-js/index.js', included: true, watched: false},
      {pattern: 'node_modules/crypto-js/*.js', included: false, watched: false},

      {pattern: 'node_modules/pouchdb/dist/*.js', included: false, watched: false},
      {pattern: 'node_modules/pouchdb-abstract-mapreduce/lib/*.js', included: false, watched: false},
      {pattern: 'node_modules/pouchdb-binary-utils/lib/*.js', included: false, watched: false},
      {pattern: 'node_modules/pouchdb-collate/lib/*.js', included: false, watched: false},
      {pattern: 'node_modules/pouchdb-collections/lib/*.js', included: false, watched: false},
      {pattern: 'node_modules/pouchdb-debug/lib/*.js', included: false, watched: false},
      {pattern: 'node_modules/pouchdb-errors/lib/*.js', included: false, watched: false},
      {pattern: 'node_modules/pouchdb-fetch/lib/*.js', included: false, watched: false},
      {pattern: 'node_modules/pouchdb-find/lib/*.js', included: false, watched: false},
      {pattern: 'node_modules/pouchdb-mapreduce-utils/lib/*.js', included: false, watched: false},
      {pattern: 'node_modules/pouchdb-md5/lib/*.js', included: false, watched: false},
      {pattern: 'node_modules/pouchdb-selector-core/lib/*.js', included: false, watched: false},
      {pattern: 'node_modules/pouchdb-utils/lib/*.js', included: false, watched: false},
      {pattern: 'node_modules/argsarray/*.js', included: false, watched: false},
      {pattern: 'node_modules/debug/src/*.js', included: false, watched: false},
      {pattern: 'node_modules/events/*.js', included: false, watched: false},
      {pattern: 'node_modules/immediate/dist/*.js', included: false, watched: false},
      {pattern: 'node_modules/inherits/*.js', included: false, watched: false},
      {pattern: 'node_modules/ms/*.js', included: false, watched: false},
      {pattern: 'node_modules/spark-md5/*.js', included: false, watched: false},
      {pattern: 'node_modules/uuid/lib/*.js', included: false, watched: false},
      {pattern: 'bundles/*.js', included: false, watched: false},

      {pattern: 'test/karma-system-config.js', included: true, watched: false},
      {pattern: 'test/karma-test-shim.js', included: true, watched: false},

      // Includes all package tests and source files into karma. Those files will be watched.
      // This pattern also matches all sourcemap files and TypeScript files for debugging.
      {pattern: 'dist/packages/**/*', included: false, watched: true},
    ],

    customLaunchers: customLaunchers,

    preprocessors: {
      'dist/packages/**/*.js': ['sourcemap']
    },

    reporters: ['dots'],
    autoWatch: false,

    sauceLabs: {
      testName: 'Gngt Unit Tests',
      startConnect: false,
      recordVideo: false,
      recordScreenshots: false,
      idleTimeout: 600,
      commandTimeout: 600,
      maxDuration: 5400,
    },

    browserStack: {
      project: 'Gngt Unit Tests',
      startTunnel: false,
      retryLimit: 3,
      timeout: 1800,
      video: false,
    },

    browserDisconnectTimeout: 180000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 300000,
    captureTimeout: 180000,

    browsers: ['ChromeHeadless'],
    singleRun: false,

    // Try Websocket for a faster transmission first. Fallback to polling if necessary.
    transports: ['websocket', 'polling'],

    browserConsoleLogOptions: {
      terminal: true,
      level: 'log'
    },

    client: {
      jasmine: {
        // TODO(jelbourn): re-enable random test order once we can de-flake existing issues.
        random: false
      }
    },
  });

  if (process.env['CIRCLECI']) {
    const containerInstanceIndex = Number(process.env['CIRCLE_NODE_INDEX']);
    const maxParallelContainerInstances = Number(process.env['CIRCLE_NODE_TOTAL']);
    const tunnelIdentifier =
        `gngt-${process.env['CIRCLE_BUILD_NUM']}-${containerInstanceIndex}`;
    const buildIdentifier = `circleci-${tunnelIdentifier}`;
    const testPlatform = process.env['TEST_PLATFORM'];

    // This defines how often a given browser should be launched in the same CircleCI
    // container. This is helpful if we want to shard tests across the same browser.
    const parallelBrowserInstances = Number(process.env['KARMA_PARALLEL_BROWSERS']) || 1;

    // In case there should be multiple instances of the browsers, we need to set up the
    // the karma-parallel plugin.
    if (parallelBrowserInstances > 1) {
      config.frameworks.unshift('parallel');
      config.plugins.push(require('karma-parallel'));
      config.parallelOptions = {
        executors: parallelBrowserInstances,
        shardStrategy: 'round-robin',
      }
    }

    if (testPlatform === 'browserstack') {
      config.browserStack.build = buildIdentifier;
      config.browserStack.tunnelIdentifier = tunnelIdentifier;
    } else if (testPlatform === 'saucelabs') {
      config.sauceLabs.build = buildIdentifier;
      config.sauceLabs.tunnelIdentifier = tunnelIdentifier;
    }

    const platformBrowsers = platformMap[testPlatform];
    const browserInstanceChunks = splitBrowsersIntoInstances(
        platformBrowsers, maxParallelContainerInstances);

    // Configure Karma to launch the browsers that belong to the given test platform and
    // container instance.
    config.browsers = browserInstanceChunks[containerInstanceIndex];
  }
};

/**
 * Splits the specified browsers into a maximum amount of chunks. The chunk of browsers
 * are being created deterministically and therefore we get reproducible tests when executing
 * the same CircleCI instance multiple times.
 */
function splitBrowsersIntoInstances(browsers, maxInstances) {
  let chunks = [];
  let assignedBrowsers = 0;

  for (let i = 0; i < maxInstances; i++) {
    const chunkSize = Math.floor((browsers.length - assignedBrowsers) / (maxInstances - i));
    chunks[i] = browsers.slice(assignedBrowsers, assignedBrowsers + chunkSize);
    assignedBrowsers += chunkSize;
  }

  return chunks;
}
