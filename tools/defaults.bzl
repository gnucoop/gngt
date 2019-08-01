# Re-export of Bazel rules with repository-wide defaults

load("@npm_angular_bazel//:index.bzl", _ng_module = "ng_module", _ng_package = "ng_package", _protractor_web_test_suite = "protractor_web_test_suite")
load("@npm_bazel_jasmine//:index.bzl", _jasmine_node_test = "jasmine_node_test")
load("@npm_bazel_typescript//:defs.bzl", _ts_library = "ts_library")
load("@npm_bazel_karma//:defs.bzl", _ts_web_test_suite = "ts_web_test_suite")
load("//tools/markdown-to-html:index.bzl", _markdown_to_html = "markdown_to_html")
load("//:packages.bzl", "ANGULAR_LIBRARY_UMDS", "LIBRARIES_UMDS", "VERSION_PLACEHOLDER_REPLACEMENTS")

_DEFAULT_TSCONFIG_BUILD = "//src:bazel-tsconfig-build.json"
_DEFAULT_TSCONFIG_TEST = "//src:bazel-tsconfig-test.json"

# Whether Angular type checking should be enabled or not. Enabled by
# default but will be overwritten when running snapshots tests with Ivy
# since type-checking is not complete yet. See FW-1004.
_ENABLE_NG_TYPE_CHECKING = True

# Re-exports to simplify build file load statements
markdown_to_html = _markdown_to_html

def _getDefaultTsConfig(testonly):
    if testonly:
        return _DEFAULT_TSCONFIG_TEST
    else:
        return _DEFAULT_TSCONFIG_BUILD

def ts_library(tsconfig = None, deps = [], testonly = False, **kwargs):
    # Add tslib because we use import helpers for all public packages.
    local_deps = ["@npm//tslib"] + deps

    if not tsconfig:
        tsconfig = _getDefaultTsConfig(testonly)

    _ts_library(
        tsconfig = tsconfig,
        testonly = testonly,
        deps = local_deps,
        **kwargs
    )

def ng_module(deps = [], tsconfig = None, testonly = False, **kwargs):
    if not tsconfig:
        tsconfig = _getDefaultTsConfig(testonly)

    local_deps = [
        # Add tslib because we use import helpers for all public packages.
        "@npm//tslib",
        "@npm//@angular/platform-browser",

        # Depend on the module typings for each `ng_module`. Since all components within the project
        # need to use `module.id` when creating components, this is always a dependency.
        "//src:module-typings",
    ]

    # Append given deps only if they're not in the default set of deps
    for d in deps:
        if d not in local_deps:
            local_deps = local_deps + [d]

    _ng_module(
        type_check = _ENABLE_NG_TYPE_CHECKING,
        deps = local_deps,
        tsconfig = tsconfig,
        testonly = testonly,
        **kwargs
    )

def ng_package(name, readme_md = None, **kwargs):
    # If no readme file has been specified explicitly, use the default readme for
    # release packages from "src/README.md".
    if not readme_md:
        readme_md = "//src:README.md"

    _ng_package(
        name = name,
        readme_md = readme_md,
        replacements = VERSION_PLACEHOLDER_REPLACEMENTS,
        **kwargs
    )

def jasmine_node_test(**kwargs):
    _jasmine_node_test(**kwargs)

def ng_test_library(deps = [], tsconfig = None, **kwargs):
    local_deps = [
        # We declare "@angular/core" as default dependencies because
        # all Angular component unit tests use the `TestBed` and `Component` exports.
        "@npm//@angular/core",
        "@npm//@types/jasmine",
    ] + deps

    ts_library(
        testonly = 1,
        deps = local_deps,
        **kwargs
    )

def ng_e2e_test_library(deps = [], tsconfig = None, **kwargs):
    local_deps = [
        "@npm//@types/jasmine",
        "@npm//@types/selenium-webdriver",
        "@npm//protractor",
    ] + deps

    ts_library(
        testonly = 1,
        deps = local_deps,
        **kwargs
    )

def ts_web_test_suite(deps = [], srcs = [], **kwargs):
    _ts_web_test_suite(
        deps = ["//tools/rxjs:rxjs_umd_modules"] + deps,
        # Required for running the compiled ng modules that use TypeScript import helpers.
        # TODO(jelbourn): remove UMDs from here once we don't have to manually include them
        srcs = [
            "@npm//:node_modules/tslib/tslib.js",
        ] + ANGULAR_LIBRARY_UMDS + LIBRARIES_UMDS + srcs,
        **kwargs
    )

# Protractor web test targets are flaky by default as the browser can sometimes
# crash (e.g. due to too much concurrency). Passing the "flaky" flag ensures that
# Bazel detects flaky tests and re-runs these a second time in case of a flake.
def protractor_web_test_suite(flaky = True, **kwargs):
    _protractor_web_test_suite(
        flaky = flaky,
        **kwargs
    )

def ng_web_test_suite(deps = [], static_css = [], bootstrap = [], **kwargs):
    # Always include a prebuilt theme in the test suite because otherwise tests, which depend on CSS
    # that is needed for measuring, will unexpectedly fail. Also always adding a prebuilt theme
    # reduces the amount of setup that is needed to create a test suite Bazel target. Note that the
    # prebuilt theme will be also added to Core test suites but shouldn't affect anything.
    static_css = static_css + [
    ]

    # Workaround for https://github.com/bazelbuild/rules_typescript/issues/301
    # Since some of our tests depend on CSS files which are not part of the `ng_module` rule,
    # we need to somehow load static CSS files within Karma (e.g. overlay prebuilt). Those styles
    # are required for successful test runs. Since the `ts_web_test_suite` rule currently only
    # allows JS files to be included and served within Karma, we need to create a JS file that
    # loads the given CSS file.
    for css_label in static_css:
        css_id = "static-css-file-%s" % (css_label.replace("/", "_").replace(":", "-"))
        deps += [":%s" % css_id]

        native.genrule(
            name = css_id,
            srcs = [css_label],
            outs = ["%s.js" % css_id],
            output_to_bindir = True,
            cmd = """
        files=($(locations %s))
        css_content=$$(cat $${files[0]})
        js_template="var cssElement = document.createElement('style'); \
                    cssElement.type = 'text/css'; \
                    cssElement.innerHTML = '$$css_content'; \
                    document.head.appendChild(cssElement);"
         echo $$js_template > $@
      """ % css_label,
        )

    ts_web_test_suite(
        # Depend on our custom test initialization script. This needs to be the first dependency.
        deps = [
            "//test:requirejs_init",
            "//test:angular_test_init",
        ] + deps,
        browsers = [
            "@io_bazel_rules_webtesting//browsers:chromium-local",
            "@io_bazel_rules_webtesting//browsers:firefox-local",
        ],
        bootstrap = [
            "@npm//:node_modules/zone.js/dist/zone-testing-bundle.js",
            "@npm//:node_modules/reflect-metadata/Reflect.js",
            "@npm//:node_modules/hammerjs/hammer.js",
        ] + bootstrap,
        **kwargs
    )
