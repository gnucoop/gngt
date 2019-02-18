var path = require('path');

var bazelEnv;

const entry = TMPL_entry;
const library = TMPL_library;
const libraryTarget = TMPL_library_target;
const outputPath = TMPL_output_path;
const outputFilename = TMPL_output_filename;
const externals = TMPL_externals;
const nodeModulesRoot = TMPL_node_modules_root;

function initBazelEnv() {
  // The current directory is the bazel execRoot. After we get it, we
  // need to set the current working directory to the config dir.
  var bazelExecRoot = process.cwd();

  process.chdir(path.normalize(path.join(bazelExecRoot, nodeModulesRoot, '..')));

  return bazelExecRoot;
}

var outputRoot = initBazelEnv(outputPath);

module.exports = {
  mode: 'development',
  entry: path.join(outputRoot, entry),
  output: {
    path: path.join(outputRoot, outputPath),
    filename: outputFilename,
    library: library,
    libraryTarget: libraryTarget,
  },
  externals: externals,
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: require.resolve('babel-loader'),
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            'dynamic-import-webpack',
            'remove-webpack',
          ],
        }
      },
      {
        test: /\.svg$/,
        loader: 'url-loader'
      },
    ]
  }
}
