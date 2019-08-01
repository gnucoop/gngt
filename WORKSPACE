workspace(name = "gngt")

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# Add NodeJS rules (explicitly used for sass bundle rules)
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "6d4edbf28ff6720aedf5f97f9b9a7679401bf7fca9d14a0fff80f644a99992b4",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/0.32.2/rules_nodejs-0.32.2.tar.gz"],
)

# Add sass rules
http_archive(
    name = "io_bazel_rules_sass",
    sha256 = "4f05239080175a3f4efa8982d2b7775892d656bb47e8cf56914d5f9441fb5ea6",
    strip_prefix = "rules_sass-86ca977cf2a8ed481859f83a286e164d07335116",
    url = "https://github.com/bazelbuild/rules_sass/archive/86ca977cf2a8ed481859f83a286e164d07335116.zip",
)

load("@build_bazel_rules_nodejs//:defs.bzl", "check_bazel_version", "node_repositories", "yarn_install")

# The minimum bazel version to use with this repo is 0.27.0
check_bazel_version("0.27.0")

node_repositories(
    # For deterministic builds, specify explicit NodeJS and Yarn versions.
    node_version = "10.13.0",
    yarn_repositories = {
        "1.16.0": ("yarn-v1.16.0.tar.gz", "yarn-v1.16.0", "df202627d9a70cf09ef2fb11cb298cb619db1b958590959d6f6e571b50656029"),
    },
    yarn_version = "1.16.0",
)

yarn_install(
    name = "npm",
    # Ensure that the script is available when running `postinstall` in the Bazel sandbox.
    data = [
        "//:angular-tsconfig.json",
        "//:tools/npm/check-npm.js",
        "//:tools/npm/date-fns-bundle.js",
        "//:tools/npm/debug-bundle.js",
        "//:tools/npm/gic-angular-bundle.js",
        "//:tools/npm/gic-core-bundle.js",
        "//:tools/npm/gic-core-loader-bundle.js",
        "//:tools/npm/ionic-angular-bundle.js",
        "//:tools/npm/ionic-core-bundle.js",
        "//:tools/npm/ionic-core-loader-bundle.js",
        "//:tools/npm/pouchdb-bundle.js",
        "//:tools/npm/pouchdb-debug-bundle.js",
        "//:tools/npm/pouchdb-find-bundle.js",
        "//:tools/npm/url-parse-bundle.js",
        "//:tools/npm/uuid-bundle.js",
    ],
    package_json = "//:package.json",
    # Temporarily disable node_modules symlinking until the fix for
    # https://github.com/bazelbuild/bazel/issues/8487 makes it into a
    # future Bazel release
    symlink_node_modules = False,
    yarn_lock = "//:yarn.lock",
)

# Install all bazel dependencies of the @ngdeps npm packages
load("@npm//:install_bazel_dependencies.bzl", "install_bazel_dependencies")

install_bazel_dependencies()

# Setup TypeScript Bazel workspace
load("@npm_bazel_typescript//:defs.bzl", "ts_setup_workspace")

ts_setup_workspace()

# Fetch transitive dependencies which are needed to use the karma rules.
load("@npm_bazel_karma//:package.bzl", "rules_karma_dependencies")

rules_karma_dependencies()

# Setup web testing. We need to setup a browser because the web testing rules for TypeScript need
# a reference to a registered browser (ideally that's a hermetic version of a browser)
load("@io_bazel_rules_webtesting//web:repositories.bzl", "web_test_repositories")

web_test_repositories()

load("@npm_bazel_karma//:browser_repositories.bzl", "browser_repositories")

browser_repositories()

# Fetch transitive dependencies which are needed to use the Sass rules.
load("@io_bazel_rules_sass//:package.bzl", "rules_sass_dependencies")

rules_sass_dependencies()

# Setup the Sass rule repositories.
load("@io_bazel_rules_sass//:defs.bzl", "sass_repositories")

sass_repositories()
