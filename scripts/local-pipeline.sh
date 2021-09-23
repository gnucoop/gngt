#!/bin/bash

set -e

BAZEL_BINARY="./node_modules/.bin/bazel"

echo "Setup"
yarn install --non-interactive

echo "Unit tests - View Engine"
"${BAZEL_BINARY}" test --build_tag_filters=-docs-package,-e2e --test_tag_filters=-e2e --config=view-engine --build_tests_only -- src/...

echo "Build - View Engine"
"${BAZEL_BINARY}" build --build_tag_filters=-docs-package,-release-package --config=view-engine -- src/...

echo "Test local browsers"
"${BAZEL_BINARY}" test --build_tag_filters=-e2e --test_tag_filters=-e2e --build_tests_only -- src/...

echo "Lint"
"${BAZEL_BINARY}" build //:rollup_globals
yarn check-rollup-globals $("${BAZEL_BINARY}" info bazel-bin)/rollup_globals.json
"${BAZEL_BINARY}" build //:entry_points_manifest
yarn check-entry-point-setup $("${BAZEL_BINARY}" info bazel-bin)/entry_points_manifest.json
yarn -s lint
yarn -s ts-circular-deps:check

echo "Integration tests - View Engine"
yarn integration-tests:view-engine

echo "Integration tests - Partial Ivy"
yarn integration-tests:partial-ivy

echo "E2E tests"
yarn e2e --flaky_test_attempts=2

echo "Build release packages"
yarn build-and-check-release-output
yarn check-tooling-setup

echo "Ngcc compatibility check"
rm -Rf node_modules/@gngt
mkdir -p node_modules/@gngt
cp -R dist/releases/* node_modules/@gngt/
mv node_modules/__ngcc_entry_points__.json node_modules/__ngcc_entry_points__.json.back
yarn ngcc --error-on-failed-entry-point --no-tsconfig
mv node_modules/__ngcc_entry_points__.json.back node_modules/__ngcc_entry_points__.json
rm -Rf node_modules/@gngt

echo "Build"
"${BAZEL_BINARY}" build --build_tag_filters=-docs-package,-release-package -- src/...

echo "API golden checks"
"${BAZEL_BINARY}" test tools/public_api_guard/...
