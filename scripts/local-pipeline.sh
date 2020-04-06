#!/bin/bash

set -e

echo "Setup"
yarn install --non-interactive

echo "Lint"
yarn -s bazel build //:rollup_globals
yarn check-rollup-globals $(yarn -s bazel info bazel-bin)/rollup_globals.json
yarn -s bazel build //:entry_points_manifest
yarn check-entry-point-setup $(yarn -s bazel info bazel-bin)/entry_points_manifest.json
yarn -s lint

echo "API guard tests"
yarn -s bazel test tools/public_api_guard/...

echo "Build"
yarn -s bazel build src/... --build_tag_filters=-docs-package,-release-package

echo "Unit tests"
yarn -s bazel test src/... --build_tag_filters=-docs-package,-e2e --test_tag_filters=-e2e --config=view-engine --build_tests_only
yarn -s bazel test src/... --build_tag_filters=-e2e --test_tag_filters=-e2e --build_tests_only

echo "Integration tests"
yarn -s bazel test src/... --build_tag_filters=e2e --test_tag_filters=e2e

echo "Release output"
yarn build
yarn check-release-output
mkdir -p node_modules/@gngt
cp -R dist/releases/* node_modules/@gngt/
yarn ngcc
rm -Rf node_modules/@gngt
