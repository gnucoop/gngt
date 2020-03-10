load("//src/core:config.bzl", "CORE_ENTRYPOINTS")
load("//src/ionic:config.bzl", "IONIC_ENTRYPOINTS", "IONIC_TESTING_ENTRYPOINTS")
load("//src/material:config.bzl", "MATERIAL_ENTRYPOINTS", "MATERIAL_TESTING_ENTRYPOINTS")

# Base rollup globals for everything in the repo. Note that we want to disable
# sorting of the globals as we manually group dict entries.
# buildifier: disable=unsorted-dict-items
ROLLUP_GLOBALS = {
    # Framework packages.
    "@angular/animations": "ng.animations",
    "@angular/common": "ng.common",
    "@angular/common/http": "ng.common.http",
    "@angular/common/http/testing": "ng.common.http.testing",
    "@angular/common/testing": "ng.common.testing",
    "@angular/core": "ng.core",
    "@angular/core/testing": "ng.core.testing",
    "@angular/forms": "ng.forms",
    "@angular/platform-browser": "ng.platformBrowser",
    "@angular/platform-browser-dynamic": "ng.platformBrowserDynamic",
    "@angular/platform-browser-dynamic/testing": "ng.platformBrowserDynamic.testing",
    "@angular/platform-browser/animations": "ng.platformBrowser.animations",
    "@angular/platform-server": "ng.platformServer",
    "@angular/router": "ng.router",

    # Angular Components packages
    "@angular/cdk/coercion": "ng.cdk.coercion",
    "@angular/cdk/collections": "ng.cdk.collections",
    "@angular/material/autocomplete": "ng.material.autocomplete",
    "@angular/material/button": "ng.material.button",
    "@angular/material/card": "ng.material.card",
    "@angular/material/checkbox": "ng.material.checkbox",
    "@angular/material/dialog": "ng.material.dialog",
    "@angular/material/form-field": "ng.material.formField",
    "@angular/material/icon": "ng.material.icon",
    "@angular/material/input": "ng.material.input",
    "@angular/material/paginator": "ng.material.paginator",
    "@angular/material/progress-bar": "ng.material.progressBar",
    "@angular/material/radio": "ng.material.radio",
    "@angular/material/select": "ng.material.select",
    "@angular/material/snack-bar": "ng.material.snackBar",
    "@angular/material/sort": "ng.material.sort",
    "@angular/material/table": "ng.material.table",
    "@angular/material/toolbar": "ng.material.toolbar",

    # Primary entry-points in the project.
    "@gngt/core": "gngt.core",
    "@gngt/ionic": "gngt.ionic",
    "@gngt/material": "gngt.material",

    # Third-party libraries.
    "@gic/angular": "gic.angular",
    "@ionic/angular": "ionic.angular",
    "@ionic/core": "ionic.core",
    "@ngrx/effects": "ngrx.effects",
    "@ngrx/store": "ngrx.store",
    "@ngx-translate/core": "ngx.translate.core",
    "date-fns": "dateFns",
    "pouchdb": "pouchdb",
    "pouchdb-debug": "pouchdb.debug",
    "pouchdb-find": "pouchdb.find",
    "rxjs": "rxjs",
    "rxjs/operators": "rxjs.operators",
    "url-parse": "urlParse",
    "uuid": "uuid",
}

# Converts a string from dash-case to lower camel case.
def to_camel_case(input):
    segments = input.split("-")
    return segments[0] + "".join([x.title() for x in segments[1:]])

# Converts an entry-point name to a UMD module name.
# e.g. "snack-bar/testing" will become "snackBar.testing".
def to_umd_name(name):
    segments = name.split("/")
    return ".".join([to_camel_case(x) for x in segments])

# Creates globals for a given package and its entry-points.
def create_globals(packageName, entryPoints):
    ROLLUP_GLOBALS.update({
        "@gngt/%s/%s" % (packageName, ep): "ng.%s.%s" % (to_umd_name(packageName), to_umd_name(ep))
        for ep in entryPoints
    })

create_globals("core", CORE_ENTRYPOINTS)
create_globals("ionic", IONIC_ENTRYPOINTS + IONIC_TESTING_ENTRYPOINTS)
create_globals("material", MATERIAL_ENTRYPOINTS + MATERIAL_TESTING_ENTRYPOINTS)

# Rollup globals the examples package. Since individual examples are
# grouped by package and component, the primary entry-point imports
# from entry-points which should be treated as external imports.
# create_globals("ionic-examples", IONIC_ENTRYPOINTS)
# create_globals("material-examples", MATERIAL_ENTRYPOINTS)
