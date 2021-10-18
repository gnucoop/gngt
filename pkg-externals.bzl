load("//src/core:config.bzl", "CORE_ENTRYPOINTS")
load("//src/ionic:config.bzl", "IONIC_ENTRYPOINTS", "IONIC_TESTING_ENTRYPOINTS")
load("//src/material:config.bzl", "MATERIAL_ENTRYPOINTS", "MATERIAL_TESTING_ENTRYPOINTS")

# Creates externals for a given package and its entry-points.
def setup_entry_point_externals(packageName, entryPoints):
    PKG_EXTERNALS.extend(["@gngt/%s/%s" % (packageName, ep) for ep in entryPoints])

setup_entry_point_externals("core", CORE_ENTRYPOINTS)
setup_entry_point_externals("ionic", IONIC_ENTRYPOINTS + IONIC_TESTING_ENTRYPOINTS)
setup_entry_point_externals("material", MATERIAL_ENTRYPOINTS + MATERIAL_TESTING_ENTRYPOINTS)

# External module names in the examples package. Individual examples are grouped
# by package and component, so we add configure such entry-points as external.
setup_entry_point_externals("gngt-examples/ionic", "calendar")
setup_entry_point_externals("gngt-examples/material", "calendar")
