# Re-export of Bazel rules with repository-wide defaults

load("@io_bazel_rules_sass//:defs.bzl", _sass_binary = "sass_binary", _sass_library = "sass_library")
load("@npm//@angular/bazel:index.bzl", _ng_module = "ng_module", _ng_package = "ng_package")
load("@npm//@bazel/jasmine:index.bzl", _jasmine_node_test = "jasmine_node_test")
load("@npm//@bazel/concatjs:index.bzl", _karma_web_test = "karma_web_test", _karma_web_test_suite = "karma_web_test_suite")
load("@npm//@bazel/protractor:index.bzl", _protractor_web_test_suite = "protractor_web_test_suite")
load("@npm//@bazel/typescript:index.bzl", _ts_library = "ts_library")
load("//:packages.bzl", "VERSION_PLACEHOLDER_REPLACEMENTS", "getAngularUmdTargets")
load("//:rollup-globals.bzl", "ROLLUP_GLOBALS")
load("//tools/markdown-to-html:index.bzl", _markdown_to_html = "markdown_to_html")
load("//tools/linker-process:index.bzl", "linker_process")

_DEFAULT_TSCONFIG_BUILD = "//src:bazel-tsconfig-build.json"
_DEFAULT_TSCONFIG_TEST = "//src:tsconfig-test"

# Re-exports to simplify build file load statements
markdown_to_html = _markdown_to_html

def _getDefaultTsConfig(testonly):
    if testonly:
        return _DEFAULT_TSCONFIG_TEST
    else:
        return _DEFAULT_TSCONFIG_BUILD

def sass_binary(sourcemap = False, **kwargs):
    _sass_binary(
        sourcemap = sourcemap,
        **kwargs
    )

def sass_library(**kwargs):
    _sass_library(**kwargs)

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

def ng_module(
        deps = [],
        srcs = [],
        tsconfig = None,
        module_name = None,
        flat_module_out_file = None,
        testonly = False,
        **kwargs):
    if not tsconfig:
        tsconfig = _getDefaultTsConfig(testonly)

    # We only generate a flat module if there is a "public-api.ts" file that
    # will be picked up by NGC or ngtsc.
    needs_flat_module = "public-api.ts" in srcs

    # Targets which have a module name and are not used for tests, should
    # have a default flat module out file named "index". This is necessary
    # as imports to that target should go through the flat module bundle.
    if needs_flat_module and module_name and not flat_module_out_file and not testonly:
        flat_module_out_file = "index"

    # Workaround to avoid a lot of changes to the Bazel build rules. Since
    # for most targets the flat module out file is "index.js", we cannot
    # include "index.ts" (if present) as source-file. This would resolve
    # in a conflict in the metadata bundler. Once we switch to Ivy and
    # no longer need metadata bundles, we can remove this logic.
    if flat_module_out_file == "index":
        if "index.ts" in srcs:
            srcs.remove("index.ts")

    local_deps = [
        # Add tslib because we use import helpers for all public packages.
        "@npm//tslib",
        "@npm//@angular/platform-browser",
    ]

    # Append given deps only if they're not in the default set of deps
    for d in deps:
        if d not in local_deps:
            local_deps = local_deps + [d]

    _ng_module(
        srcs = srcs,
        module_name = module_name,
        flat_module_out_file = flat_module_out_file,
        compilation_mode = select({
            "//tools:partial_compilation_enabled": "partial",
            "//conditions:default": "",
        }),
        deps = local_deps,
        tsconfig = tsconfig,
        testonly = testonly,
        **kwargs
    )

def ng_package(name, data = [], deps = [], globals = ROLLUP_GLOBALS, readme_md = None, **kwargs):
    # If no readme file has been specified explicitly, use the default readme for
    # release packages from "src/README.md".
    if not readme_md:
        readme_md = "//src:README.md"

    # We need a genrule that copies the license into the current package. This
    # allows us to include the license in the "ng_package".
    native.genrule(
        name = "license_copied",
        srcs = ["//:LICENSE"],
        outs = ["LICENSE"],
        cmd = "cp $< $@",
    )

    _ng_package(
        name = name,
        globals = globals,
        data = data + [":license_copied"],
        # Tslib needs to be explicitly specified as dependency here, so that the `ng_package`
        # rollup bundling action can include tslib. Tslib is usually a transitive dependency of
        # entry-points passed to `ng_package`, but the rule does not collect transitive deps.
        deps = deps + ["@npm//tslib"],
        readme_md = readme_md,
        substitutions = VERSION_PLACEHOLDER_REPLACEMENTS,
        **kwargs
    )

def jasmine_node_test(**kwargs):
    kwargs["templated_args"] = ["--bazel_patch_module_resolver"] + kwargs.get("templated_args", [])
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

def karma_web_test_suite(name, **kwargs):
    web_test_args = {}
    test_deps = ["//tools/rxjs:rxjs_umd_modules"] + kwargs.get("deps", [])

    kwargs["srcs"] = ["@npm//:node_modules/tslib/tslib.js"] + getAngularUmdTargets() + kwargs.get("srcs", [])
    kwargs["tags"] = ["partial-compilation-integration"] + kwargs.get("tags", [])
    kwargs["deps"] = select({
        # Based on whether partial compilation is enabled, use the linker processed dependencies.
        "//tools:partial_compilation_enabled": ["%s_linker_processed_deps" % name],
        "//conditions:default": test_deps,
    })

    linker_process(
        name = "%s_linker_processed_deps" % name,
        srcs = test_deps,
        testonly = True,
        tags = ["manual"],
    )

    # Set up default browsers if no explicit `browsers` have been specified.
    if not hasattr(kwargs, "browsers"):
        kwargs["tags"] = ["native"] + kwargs.get("tags", [])
        kwargs["browsers"] = [
            # Note: when changing the browser names here, also update the "yarn test"
            # script to reflect the new browser names.
            "@npm//@angular/dev-infra-private/bazel/browsers/chromium:chromium",
            "@npm//@angular/dev-infra-private/bazel/browsers/firefox:firefox",
        ]

    for opt_name in kwargs.keys():
        # Filter out options which are specific to "karma_web_test" targets. We cannot
        # pass options like "browsers" to the local web test target.
        if not opt_name in ["wrapped_test_tags", "browsers", "wrapped_test_tags", "tags"]:
            web_test_args[opt_name] = kwargs[opt_name]

    # Custom standalone web test that can be run to test against any browser
    # that is manually connected to.
    _karma_web_test(
        name = "%s_local_bin" % name,
        config_file = "//test:bazel-karma-local-config.js",
        tags = ["manual"],
        **web_test_args
    )

    # Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1429
    native.sh_test(
        name = "%s_local" % name,
        srcs = ["%s_local_bin" % name],
        tags = ["manual", "local", "ibazel_notify_changes"],
        testonly = True,
    )

    # Default test suite with all configured browsers.
    _karma_web_test_suite(
        name = name,
        **kwargs
    )

def protractor_web_test_suite(**kwargs):
    _protractor_web_test_suite(
        browsers = ["@npm//@angular/dev-infra-private/bazel/browsers/chromium:chromium"],
        **kwargs
    )

def ng_web_test_suite(deps = [], static_css = [], bootstrap = [], **kwargs):
    # Always include a prebuilt theme in the test suite because otherwise tests, which depend on CSS
    # that is needed for measuring, will unexpectedly fail. Also always adding a prebuilt theme
    # reduces the amount of setup that is needed to create a test suite Bazel target. Note that the
    # prebuilt theme will be also added to CDK test suites but shouldn't affect anything.
    static_css = static_css + [
    ]

    # Workaround for https://github.com/bazelbuild/rules_typescript/issues/301
    # Since some of our tests depend on CSS files which are not part of the `ng_module` rule,
    # we need to somehow load static CSS files within Karma (e.g. overlay prebuilt). Those styles
    # are required for successful test runs. Since the `karma_web_test_suite` rule currently only
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
        files=($(execpaths %s))
        # Escape all double-quotes so that the content can be safely inlined into the
        # JS template. Note that it needs to be escaped a second time because the string
        # will be evaluated first in Bash and will then be stored in the JS output.
        css_content=$$(cat $${files[0]} | sed 's/"/\\\\"/g')
        js_template='var cssElement = document.createElement("style"); \
                    cssElement.type = "text/css"; \
                    cssElement.innerHTML = "'"$$css_content"'"; \
                    document.head.appendChild(cssElement);'
         echo $$js_template > $@
      """ % css_label,
        )

    karma_web_test_suite(
        # Depend on our custom test initialization script. This needs to be the first dependency.
        deps = [
            "//test:angular_test_init",
        ] + deps,
        bootstrap = [
            # This matches the ZoneJS bundles used in default CLI projects. See:
            # https://github.com/angular/angular-cli/blob/master/packages/schematics/angular/application/files/src/polyfills.ts.template#L58
            # https://github.com/angular/angular-cli/blob/master/packages/schematics/angular/application/files/src/test.ts.template#L3
            # Note `zone.js/dist/zone.js` is aliased in the CLI to point to the evergreen
            # output that does not include legacy patches. See: https://github.com/angular/angular/issues/35157.
            # TODO: Consider adding the legacy patches when testing Saucelabs/Browserstack with Bazel.
            # CLI loads the legacy patches conditionally for ES5 legacy browsers. See:
            # https://github.com/angular/angular-cli/blob/277bad3895cbce6de80aa10a05c349b10d9e09df/packages/angular_devkit/build_angular/src/angular-cli-files/models/webpack-configs/common.ts#L141
            "@npm//:node_modules/zone.js/dist/zone-evergreen.js",
            "@npm//:node_modules/zone.js/dist/zone-testing.js",
            "@npm//:node_modules/reflect-metadata/Reflect.js",
        ] + bootstrap,
        **kwargs
    )
