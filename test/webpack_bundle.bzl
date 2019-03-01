load("@build_bazel_rules_nodejs//internal/common:collect_es6_sources.bzl", "collect_es6_sources")
load("@build_bazel_rules_nodejs//internal/common:node_module_info.bzl", "NodeModuleInfo")
load("@angular//packages/bazel/src:external.bzl", "collect_node_modules_aspect", "DEPS_ASPECTS")

def _filter_js_inputs(all_inputs):
  return [
    f
    for f in all_inputs
    if f.path.endswith(".js") or f.path.endswith(".json") or f.path.endswith(".svg")
  ]

def _write_webpack_config(ctx, node_modules_root, filename = "_%s.webpack.conf.js"):
  config = ctx.actions.declare_file(filename % ctx.label.name)

  build_file_dirname = "/".join(ctx.build_file_path.split("/")[:-1])
  
  output_path = "/".join(ctx.outputs.output_name.path.split("/")[:-1])
  output_filename = ctx.outputs.output_name.path.split("/")[-1]

  externals = ["\"%s\"" % e for e in ctx.attr.externals]

  ctx.actions.expand_template(
    output = config,
    template = ctx.file._webpack_config_tmpl,
    substitutions = {
      "TMPL_library_target": "\"%s\"" % ctx.attr.library_target,
      "TMPL_library": "\"%s\"" % ctx.attr.library,
      "TMPL_output_path": "\"%s\"" % output_path,
      "TMPL_output_filename": "\"%s\"" % output_filename,
      "TMPL_externals": "[%s]" % ", ".join(externals),
      "TMPL_entry": "\"%s\"" % ctx.file.entry_point.path,
      "TMPL_node_modules_root": "\"%s\"" % node_modules_root
    }
  )

  return config

def _webpack_bundle(ctx):
  args = ctx.actions.args()

  node_modules_root = None
  for d in ctx.attr.deps:
    if NodeModuleInfo in d:
      possible_root = "/".join(["external", d[NodeModuleInfo].workspace, "node_modules"])
      if not node_modules_root:
        node_modules_root = possible_root
      elif node_modules_root != possible_root:
        fail("All npm dependencies need to come from a single workspace. Found '%s' and '%s'." % (node_modules_root, possible_root))
  
  config = _write_webpack_config(ctx, node_modules_root)

  args.add_all(["--config", config.path])

  sources = collect_es6_sources(ctx)

  direct_inputs = [config]

  for d in ctx.attr.deps:
    if NodeModuleInfo in d:
      direct_inputs += _filter_js_inputs(d.files.to_list())

  ctx.actions.run(
    executable = ctx.executable._webpack,
    inputs = depset(direct_inputs, transitive = [sources]),
    outputs = [ctx.outputs.output_name],
    arguments = [args]
  )

local_deps_aspects = [collect_node_modules_aspect]
[local_deps_aspects.append(a) for a in DEPS_ASPECTS]

WEBPACK_ATTRS = {
  "library": attr.string(
    doc = "The module name",
    mandatory = True,
  ),
  "library_target": attr.string(
    doc = "The module type",
    mandatory = True,
  ),
  "externals": attr.string_list(
    doc = "The external modules",
  ),
  "entry_point": attr.label(mandatory = True, allow_single_file = True),
  "output_name": attr.output(),
  "deps": attr.label_list(
    doc = "Targets that are imported by this target",
    aspects = local_deps_aspects,
  ),
  "_webpack": attr.label(
    executable = True,
    cfg = "host",
    default = Label("//tools:webpack"),
  ),
  "_webpack_config_tmpl": attr.label(
    default = Label("//tools:webpack.bundle.config.js"),
    allow_single_file = True,
  ),
}

webpack_bundle_macro = rule(
  implementation = _webpack_bundle,
  attrs = WEBPACK_ATTRS
)

def webpack_bundle(deps = [], **kwargs):
  local_deps = [
    "@gngtdeps//@babel/preset-env",
    "@gngtdeps//babel-plugin-dynamic-import-webpack",
    "@gngtdeps//babel-plugin-remove-webpack",
    "@gngtdeps//url-loader",
  ] + deps

  webpack_bundle_macro(
    deps = local_deps,
    **kwargs
  )
