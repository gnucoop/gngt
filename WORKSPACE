workspace(
    name = "gc_gngt",
    managed_directories = {"@npm": ["node_modules"]},
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# Add NodeJS rules
http_archive(
    name = "build_bazel_rules_nodejs",
    patch_args = ["-p1"],
    patches = ["//tools/third-party-libs:npm_umd_bundle.patch"],
    sha256 = "10f534e1c80f795cffe1f2822becd4897754d18564612510c59b3c73544ae7c6",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/3.5.0/rules_nodejs-3.5.0.tar.gz"],
)

# Add sass rules
http_archive(
    name = "io_bazel_rules_sass",
    sha256 = "c310ba8fe69cce7793954a7f1778b65a86b06690215a504751e12b7df3ab51f8",
    strip_prefix = "rules_sass-1.32.13",
    urls = [
        "https://github.com/bazelbuild/rules_sass/archive/1.32.13.zip",
        "https://mirror.bazel.build/github.com/bazelbuild/rules_sass/archive/1.32.13.zip",
    ],
)

# Add skylib which contains common Bazel utilities. Note that `rules_nodejs` would also
# bring in the skylib repository but with an older version that does not support shorthands
# for declaring Bazel build setting flags.
http_archive(
    name = "bazel_skylib",
    sha256 = "ebdf850bfef28d923a2cc67ddca86355a449b5e4f38b0a70e584dc24e5984aa6",
    strip_prefix = "bazel-skylib-f80bc733d4b9f83d427ce3442be2e07427b2cc8d",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/bazel-skylib/archive/f80bc733d4b9f83d427ce3442be2e07427b2cc8d.tar.gz",
        "https://github.com/bazelbuild/bazel-skylib/archive/f80bc733d4b9f83d427ce3442be2e07427b2cc8d.tar.gz",
    ],
)

load("@bazel_skylib//:workspace.bzl", "bazel_skylib_workspace")

bazel_skylib_workspace()

load("@build_bazel_rules_nodejs//:index.bzl", "check_bazel_version", "node_repositories", "yarn_install")

check_bazel_version("4.0.0")

node_repositories(
    node_version = "14.16.1",
    package_json = ["//:package.json"],
)

yarn_install(
    name = "npm",
    # We add the postinstall patches file, and ngcc main fields update script here so
    # that Yarn will rerun whenever one of these files has been modified.
    data = [
        "//:tools/postinstall/apply-patches.js",
        "//:tools/postinstall/patch-packages.js",
        "//:tools/postinstall/update-ngcc-main-fields.js",
    ],
    package_json = "//:package.json",
    quiet = False,
    yarn_lock = "//:yarn.lock",
)

load("@npm//@bazel/protractor:package.bzl", "npm_bazel_protractor_dependencies")

npm_bazel_protractor_dependencies()

# Setup web testing. We need to setup a browser because the web testing rules for TypeScript need
# a reference to a registered browser (ideally that's a hermetic version of a browser)
load("@io_bazel_rules_webtesting//web:repositories.bzl", "web_test_repositories")

web_test_repositories()

# Fetch transitive dependencies which are needed to use the Sass rules.
load("@io_bazel_rules_sass//:package.bzl", "rules_sass_dependencies")

rules_sass_dependencies()

# Setup the Sass rule repositories.
load("@io_bazel_rules_sass//:defs.bzl", "sass_repositories")

sass_repositories()

# Load pinned rules_webtesting browser versions for tests.
#
# TODO(wagnermaciel): deduplicate browsers - this will load another version of chromium in the
# repository. We probably want to use the chromium version loaded here (from dev-infra) as that
# one has RBE improvements.
load(
    "@npm//@angular/dev-infra-private/bazel/browsers:browser_repositories.bzl",
    _dev_infra_browser_repositories = "browser_repositories",
)

_dev_infra_browser_repositories()
