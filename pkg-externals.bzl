load("//src/core:config.bzl", "CORE_ENTRYPOINTS")
load("//src/ionic:config.bzl", "IONIC_ENTRYPOINTS", "IONIC_TESTING_ENTRYPOINTS")
load("//src/material:config.bzl", "MATERIAL_ENTRYPOINTS", "MATERIAL_TESTING_ENTRYPOINTS")

# Base list of externals which should not be bundled into the APF package output.
# Note that we want to disable sorting of the externals as we manually group entries.
# buildifier: disable=unsorted-list-items
PKG_EXTERNALS = [
    # Framework packages.
    "@angular/cdk/coercion",
    "@angular/cdk/collections",
    "@angular/common",
    "@angular/common/http",
    "@angular/core",
    "@angular/forms",
    "@angular/material/autocomplete",
    "@angular/material/button",
    "@angular/material/card",
    "@angular/material/checkbox",
    "@angular/material/dialog",
    "@angular/material/form-field",
    "@angular/material/icon",
    "@angular/material/input",
    "@angular/material/paginator",
    "@angular/material/progress-bar",
    "@angular/material/radio",
    "@angular/material/select",
    "@angular/material/sort",
    "@angular/material/snack-bar",
    "@angular/material/table",
    "@angular/material/toolbar",
    "@angular/router",

    # Primary entry-points in the project.
    "@gngt/core",
    "@gngt/ionic",
    "@gngt/material",

    # Third-party libraries.
    "@gic/angular",
    "@ionic/angular",
    "@ionic/core",
    "@ngneat/transloco",
    "@ngrx/effects",
    "@ngrx/store",
    "date-fns",
    "pouchdb",
    "pouchdb-find",
    "rxjs",
    "rxjs/operators",
    "url-parse",
    "uuid",
]

# Creates externals for a given package and its entry-points.
def setup_entry_point_externals(packageName, entryPoints):
    PKG_EXTERNALS.extend(["@gngt/%s/%s" % (packageName, ep) for ep in entryPoints])

setup_entry_point_externals("core", CORE_ENTRYPOINTS)
setup_entry_point_externals("ionic", IONIC_ENTRYPOINTS + IONIC_TESTING_ENTRYPOINTS)
setup_entry_point_externals("material", MATERIAL_ENTRYPOINTS + MATERIAL_TESTING_ENTRYPOINTS)

# External module names in the examples package. Individual examples are grouped
# by package and component, so we add configure such entry-points as external.
setup_entry_point_externals("gngt-examples/ionic", ["calendar"])
setup_entry_point_externals("gngt-examples/material", ["calendar"])
