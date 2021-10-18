#!/bin/bash

set -e

BAZEL_BINARY="./node_modules/.bin/bazel"

echo "Setup"
yarn install --non-interactive

echo "Test local browsers"
"${BAZEL_BINARY}" test --build_tag_filters=-e2e --test_tag_filters=-e2e --build_tests_only -- src/...

echo "Lint"
"${BAZEL_BINARY}" build //:package_externals
yarn check-package-externals $("${BAZEL_BINARY}" info bazel-bin)/package_externals.json
"${BAZEL_BINARY}" build //:entry_points_manifest
yarn check-entry-point-setup $("${BAZEL_BINARY}" info bazel-bin)/entry_points_manifest.json
yarn -s lint
yarn -s ts-circular-deps:check

echo "Integration tests - Partial Ivy"
yarn integration-tests:partial-ivy

echo "E2E tests"
yarn e2e --flaky_test_attempts=2

echo "Build release packages"
yarn build-and-check-release-output
yarn check-tooling-setup

echo "Build"
"${BAZEL_BINARY}" build --build_tag_filters=-docs-package,-release-package -- src/...

echo "API golden checks"
"${BAZEL_BINARY}" test tools/public_api_guard/...
