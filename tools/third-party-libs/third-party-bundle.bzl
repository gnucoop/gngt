load("@npm_bazel_rollup//:index.bzl", "rollup_bundle")
load("//tools:expand_template.bzl", "expand_template")

_BASE_ROLLUP_DEPS = [
    "@npm//@rollup/plugin-commonjs",
    "@npm//@rollup/plugin-node-resolve",
    "@npm//rollup-plugin-sourcemaps",
]

def _create_rollup_config(
        name,
        output_name,
        module_name,
        globals = {},
        template = "//tools/third-party-libs:rollup.config-tmpl.js"):
    expand_template(
        name = name,
        output_name = output_name,
        configuration_env_vars = [],
        substitutions = {
            "$GLOBALS": str(globals),
            "$MODULE_NAME": module_name,
        },
        template = template,
    )

def third_party_bundle(
        name,
        module_name,
        entry_point,
        globals = {},
        template = "//tools/third-party-libs:rollup.config-tmpl.js",
        deps = []):
    config_name = "%s-rollup-config" % name
    _create_rollup_config(
        config_name,
        "%s.js" % config_name,
        module_name,
        globals,
        template,
    )

    bundle_name = "%s-bundle" % name
    rollup_bundle(
        name = bundle_name,
        config_file = ":%s" % config_name,
        entry_point = entry_point,
        format = "umd",
        deps = _BASE_ROLLUP_DEPS + deps,
    )
