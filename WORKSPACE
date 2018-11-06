workspace(name = "gngt")

# Add NodeJS rules (explicitly used for sass bundle rules)
http_archive(
  name = "build_bazel_rules_nodejs",
  url = "https://github.com/bazelbuild/rules_nodejs/archive/0.15.3.zip",
  strip_prefix = "rules_nodejs-0.15.3",
)

# Add TypeScript rules
http_archive(
  name = "build_bazel_rules_typescript",
  url = "https://github.com/bazelbuild/rules_typescript/archive/8ea1a55cf5cf8be84ddfeefc0940769b80da792f.zip",
  strip_prefix = "rules_typescript-8ea1a55cf5cf8be84ddfeefc0940769b80da792f",
)

# Add Angular source and Bazel rules.
http_archive(
  name = "angular",
  url = "https://github.com/angular/angular/archive/7.0.2.zip",
  strip_prefix = "angular-7.0.2",
)

http_archive(
  name = "angular_material",
  url = "https://github.com/angular/material2/archive/7.0.2.zip",
  strip_prefix = "material2-7.0.2",
)

# Add Ngrx source.
http_archive(
  name = "ngrx",
  url = "https://github.com/ngrx/platform/archive/7.0.0-beta.0.zip",
  strip_prefix = "platform-7.0.0-beta.0",
)

# Add RxJS as repository because those are needed in order to build Angular from source.
# Also we cannot refer to the RxJS version from the node modules because self-managed
# node modules are not guaranteed to be installed.
http_archive(
  name = "rxjs",
  url = "https://registry.yarnpkg.com/rxjs/-/rxjs-6.3.3.tgz",
  strip_prefix = "package/src",
  sha256 = "72b0b4e517f43358f554c125e40e39f67688cd2738a8998b4a266981ed32f403",
)

# Add sass rules
http_archive(
  name = "io_bazel_rules_sass",
  url = "https://github.com/bazelbuild/rules_sass/archive/1.14.1.zip",
  strip_prefix = "rules_sass-1.14.1",
)

# Since we are explitly fetching @build_bazel_rules_typescript, we should explicly
# ask for its transitive deps from the version we fetched since
# rules_angular_dependencies() will load transitive deps for the version
# it would fetch transitively
load("@build_bazel_rules_typescript//:package.bzl", "rules_typescript_dependencies")
rules_typescript_dependencies()

# Since we are explitly fetching @build_bazel_rules_nodejs, we should explicly
# ask for its transitive deps from the version we fetched since
# rules_angular_dependencies() will load transitive deps for the version
# it would fetch transitively
load("@build_bazel_rules_nodejs//:package.bzl", "rules_nodejs_dependencies")
rules_nodejs_dependencies()

# Fetch @angular repo transitive deps that are not already fetched above
load("@angular//packages/bazel:package.bzl", "rules_angular_dependencies")
rules_angular_dependencies()

load("@io_bazel_rules_sass//sass:sass_repositories.bzl", "sass_repositories")
sass_repositories()

# NOTE: this rule installs nodejs, npm, and yarn, but does NOT install
# your npm dependencies. You must still run the package manager.
load("@build_bazel_rules_nodejs//:defs.bzl", "check_bazel_version", "node_repositories", "yarn_install")

# The minimum bazel version to use with this repo is 0.18.0
check_bazel_version("0.18.0")
node_repositories(
  # For deterministic builds, specify explicit NodeJS and Yarn versions. Keep the Yarn version
  # in sync with the version of Travis.
  node_version = "10.10.0",
  yarn_version = "1.9.4",
)

# Use Bazel managed node modules. See more below: 
# https://github.com/bazelbuild/rules_nodejs#bazel-managed-vs-self-managed-dependencies
yarn_install(
  name = "npm",
  package_json = "//:package.json",
  yarn_lock = "//:yarn.lock",
)

# Setup TypeScript Bazel workspace
load("@build_bazel_rules_typescript//:defs.bzl", "ts_setup_workspace")
ts_setup_workspace()

# Setup Angular workspace for building (Bazel managed node modules)
load("@angular//:index.bzl", "ng_setup_workspace")
ng_setup_workspace()

# Setup Go toolchain (required for Bazel web testing rules)
load("@io_bazel_rules_go//go:def.bzl", "go_rules_dependencies", "go_register_toolchains")
go_rules_dependencies()
go_register_toolchains()

# Setup web testing. We need to setup a browser because the web testing rules for TypeScript need
# a reference to a registered browser (ideally that's a hermetic version of a browser)
load("@io_bazel_rules_webtesting//web:repositories.bzl", "browser_repositories", "web_test_repositories")

web_test_repositories()
browser_repositories(
  chromium = True,
)
