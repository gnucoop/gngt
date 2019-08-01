# List of all components / subpackages.

CORE_PACKAGES = [
    "admin",
    "auth",
    "calendar",
    "model",
    "reducers",
    "sync",
    "translations",
]

CORE_TARGETS = ["//src/core"] + ["//src/core/%s" % p for p in CORE_PACKAGES]

MATERIAL_PACKAGES = [
    "admin",
    "auth",
    "calendar",
    "model",
]

MATERIAL_TARGETS = ["//src/material"] + ["//src/material/%s" % p for p in MATERIAL_PACKAGES]

IONIC_PACKAGES = [
    "admin",
    "auth",
    "calendar",
    "common",
]

IONIC_TARGETS = ["//src/ionic"] + ["//src/ionic/%s" % p for p in IONIC_PACKAGES]

# Each individual package uses a placeholder for the version of Angular to ensure they're
# all in-sync. This map is passed to each ng_package rule to stamp out the appropriate
# version for the placeholders.
ANGULAR_PACKAGE_VERSION = ">=8.0.0 <9.0.0"
ANGULAR_MATERIAL_PACKAGE_VERSION = ">=8.0.0 <9.0.0"
GIC_PACKAGE_VERSION = ">=4.7.1 <4.8.0"
IONIC_PACKAGE_VERSION = ">=4.7.0 <4.8.0"
NGRX_PACKAGE_VERSION = ">=8.0.0 <9.0.0"
NGXT_PACKAGE_VERSION = ">=11.0.0 <12.0.0"
VERSION_PLACEHOLDER_REPLACEMENTS = {
    "0.0.0-NGM": ANGULAR_MATERIAL_PACKAGE_VERSION,
    "0.0.0-NGRX": NGRX_PACKAGE_VERSION,
    "0.0.0-NGXT": NGXT_PACKAGE_VERSION,
    "0.0.0-NG": ANGULAR_PACKAGE_VERSION,
    "0.0.0-GIC": GIC_PACKAGE_VERSION,
    "0.0.0-ION": IONIC_PACKAGE_VERSION,
}

# Base rollup globals for everything in the repo.
ROLLUP_GLOBALS = {
    "date-fns": "date-fns",
    "tslib": "tslib",
    "url-parse": "url-parse",
    "@gngt/core": "gngt.core",
    "@gngt/ionic": "gngt.ionic",
    "@gngt/material": "gngt.material",
}

# Rollup globals for core subpackages in the form of, e.g., {"@gngt/core/auth": "gngt.core.auth"}
ROLLUP_GLOBALS.update({
    "@gngt/core/%s" % p: "gngt.core.%s" % p
    for p in CORE_PACKAGES
})

# Rollup globals for material subpackages, e.g., {"@gngt/material/auth": "gngt.material.auth"}
ROLLUP_GLOBALS.update({
    "@gngt/material/%s" % p: "gngt.material.%s" % p
    for p in MATERIAL_PACKAGES
})

# Rollup globals for ionic subpackages, e.g., {"@gngt/ionic/auth": "gngt.material.auth"}
ROLLUP_GLOBALS.update({
    "@gngt/ionic/%s" % p: "gngt.ionic.%s" % p
    for p in IONIC_PACKAGES
})

# UMD bundles for Angular packages and subpackges we depend on for development and testing.
ANGULAR_LIBRARY_UMDS = [
    "@npm//:node_modules/@angular/animations/bundles/animations-browser.umd.js",
    "@npm//:node_modules/@angular/animations/bundles/animations.umd.js",
    "@npm//:node_modules/@angular/common/bundles/common-http-testing.umd.js",
    "@npm//:node_modules/@angular/common/bundles/common-http.umd.js",
    "@npm//:node_modules/@angular/common/bundles/common-testing.umd.js",
    "@npm//:node_modules/@angular/common/bundles/common.umd.js",
    "@npm//:node_modules/@angular/compiler/bundles/compiler-testing.umd.js",
    "@npm//:node_modules/@angular/compiler/bundles/compiler.umd.js",
    "@npm//:node_modules/@angular/core/bundles/core-testing.umd.js",
    "@npm//:node_modules/@angular/core/bundles/core.umd.js",
    "@npm//:node_modules/@angular/elements/bundles/elements.umd.js",
    "@npm//:node_modules/@angular/forms/bundles/forms.umd.js",
    "@npm//:node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js",
    "@npm//:node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js",
    "@npm//:node_modules/@angular/platform-browser/bundles/platform-browser-animations.umd.js",
    "@npm//:node_modules/@angular/platform-browser/bundles/platform-browser-testing.umd.js",
    "@npm//:node_modules/@angular/platform-browser/bundles/platform-browser.umd.js",
    "@npm//:node_modules/@angular/router/bundles/router.umd.js",
]

LIBRARIES_UMDS = [
    "@npm//:node_modules/@gic/angular/angular.umd.js",
    "@npm//:node_modules/@gic/core/core.umd.js",
    "@npm//:node_modules/@gic/core/core-loader.umd.js",
    "@npm//:node_modules/@ionic/angular/angular.umd.js",
    "@npm//:node_modules/@ionic/core/core.umd.js",
    "@npm//:node_modules/@ionic/core/core-loader.umd.js",
    "@npm//:node_modules/date-fns/date-fns.umd.js",
    "@npm//:node_modules/debug/debug.umd.js",
    "@npm//:node_modules/pouchdb/pouchdb.umd.js",
    "@npm//:node_modules/pouchdb-debug/pouchdb-debug.umd.js",
    "@npm//:node_modules/pouchdb-find/pouchdb-find.umd.js",
    "@npm//:node_modules/url-parse/url-parse.umd.js",
    "@npm//:node_modules/uuid/uuid.umd.js",
]
