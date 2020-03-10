load("//tools:expand_template.bzl", "expand_template")

def create_rollup_config(
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
