load("//src/core:config.bzl", "CORE_ENTRYPOINTS")
load("//src/ionic:config.bzl", "IONIC_ENTRYPOINTS", "IONIC_TESTING_ENTRYPOINTS")
load("//src/material:config.bzl", "MATERIAL_ENTRYPOINTS", "MATERIAL_TESTING_ENTRYPOINTS")

"""Converts the given string to an identifier."""

def convert_to_identifier(name):
    return name.replace("/", "_").replace("-", "_")

"""Creates imports and exports for the given entry-point and package."""

def create_import_export(entry_point, pkg_name):
    identifier = "%s_%s" % (convert_to_identifier(pkg_name), convert_to_identifier(entry_point))
    return """
    import * as {0} from "@gngt/{1}/{2}";
    export {{ {0} }};
  """.format(identifier, pkg_name, entry_point)

"""
  Creates a file that imports all entry-points as namespace. The namespaces will be
  re-exported. This ensures that all entry-points can successfully compile.
"""

def generate_import_all_entry_points_file():
    output = """
    import * as core from "@gngt/core";
    // Note: The primary entry-points for Gngt Ionic and Material does not have
    // any exports, so it cannot be imported as module.
    export { core };
  """
    for ep in CORE_ENTRYPOINTS:
        output += create_import_export(ep, "core")
    for ep in IONIC_ENTRYPOINTS + IONIC_TESTING_ENTRYPOINTS:
        output += create_import_export(ep, "ionic")
    for ep in MATERIAL_ENTRYPOINTS + MATERIAL_TESTING_ENTRYPOINTS:
        output += create_import_export(ep, "material")
    return output
