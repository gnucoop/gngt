load("@npm//@bazel/rollup:index.bzl", "rollup_bundle")
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
        exports = "named",
        named_exports = {},
        main_fields = ["browser", "module", "main"],
        template = "//tools/third-party-libs:rollup.config-tmpl.js"):
    expand_template(
        name = name,
        output_name = output_name,
        configuration_env_vars = [],
        substitutions = {
            "$EXPORTS": exports,
            "$GLOBALS": str(globals),
            "$MAIN_FIELDS": str(main_fields),
            "$MODULE_NAME": module_name,
            "$NAMED_EXPORTS": str(named_exports),
        },
        template = template,
    )

def third_party_bundle(
        name,
        module_name,
        entry_point,
        globals = {},
        exports = "named",
        named_exports = {},
        main_fields = ["browser", "module", "main"],
        template = "//tools/third-party-libs:rollup.config-tmpl.js",
        deps = []):
    config_name = "%s-rollup-config" % name
    _create_rollup_config(
        config_name,
        "%s.js" % config_name,
        module_name,
        globals,
        exports,
        named_exports,
        main_fields,
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
