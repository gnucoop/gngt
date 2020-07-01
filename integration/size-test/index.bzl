load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary", "nodejs_test")
load("@npm_bazel_rollup//:index.bzl", "rollup_bundle")
load("@npm_bazel_terser//:index.bzl", "terser_minified")
load("//tools:defaults.bzl", "ng_module")

"""
  Performs size measurements for the specified file. The file will be built as part
  of a `ng_module` and then will be optimized with build-optimizer, rollup and Terser.

  The resulting size will be validated against a golden file to ensure that we don't
  regress in payload size, or that we can improvements to payload size.
"""

def size_test(name, file, deps):
    # Generates an unique id for the given size test. e.g. if the macro is called
    # within the `integration/size-test/material` package with `name = list`, then
    # the unique id will be set to `material/list`.
    test_id = "%s/%s" % (native.package_name()[len("integration/size-test/"):], name)

    ng_module(
        name = "%s_lib" % name,
        srcs = ["%s.ts" % name],
        testonly = True,
        deps = [
            "@npm//@angular/core",
            "@npm//@angular/platform-browser-dynamic",
        ] + deps,
    )

    rollup_bundle(
        name = "%s_bundle" % name,
        config_file = "//integration/size-test:rollup.config.js",
        testonly = True,
        entry_points = {
            (file): "%s_bundled" % name,
        },
        deps = [
            ":%s_lib" % name,
            "@npm//rollup-plugin-node-resolve",
            "@npm//@angular-devkit/build-optimizer",
        ],
        sourcemap = "false",
    )

    terser_minified(
        testonly = True,
        name = "%s_bundle_min" % name,
        src = ":%s_bundle" % name,
        config_file = "//integration/size-test:terser-config.json",
        sourcemap = False,
    )

    nodejs_test(
        name = name,
        data = [
            "//goldens:size-test.yaml",
            "//integration/size-test:check-size",
            ":%s_bundle_min" % name,
        ],
        entry_point = "//integration/size-test:check-size.ts",
        args = [test_id, "$(rootpath :%s_bundle_min)" % name],
    )

    nodejs_binary(
        name = "%s.approve" % name,
        testonly = True,
        data = [
            "//goldens:size-test.yaml",
            "//integration/size-test:check-size",
            ":%s_bundle_min" % name,
        ],
        entry_point = "//integration/size-test:check-size.ts",
        args = [test_id, "$(rootpath :%s_bundle_min)" % name, "true"],
    )
