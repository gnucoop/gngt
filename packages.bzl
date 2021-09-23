# Each individual package uses a placeholder for the version of Angular to ensure they're
# all in-sync. This map is passed to each ng_package rule to stamp out the appropriate
# version for the placeholders.
ANGULAR_PACKAGE_VERSION = "^13.0.0-0 || ^14.0.0-0"
ANGULAR_MATERIAL_PACKAGE_VERSION = "^13.0.0-0 || ^14.0.0-0"
DATEFNS_PACKAGE_VERSION = "^2.15.0"
GIC_PACKAGE_VERSION = "^5.3.0"
IONIC_PACKAGE_VERSION = "^5.3.0"
NGRX_PACKAGE_VERSION = "^12.0.0"
NGXT_PACKAGE_VERSION = "^13.0.0"
POUCHDB_PACKAGE_VERSION = "~7.0.0"
RXJS_PACKAGE_VERSION = "^6.5.3 || ^7.0.0"
TSLIB_PACKAGE_VERSION = "^2.2.0"
URL_PARSE_PACKAGE_VERSION = "^1.4.7"
UUID_PACKAGE_VERSION = "^8.3.0"

# Each placer holder is used to stamp versions during the build process, replacing the key with it's
# value pair. These replacements occur during building of `npm_package` and `ng_package` stamping in
# the peer dependencies and versions, primarily in `package.json`s.
VERSION_PLACEHOLDER_REPLACEMENTS = {
    "0.0.0-ANGM": ANGULAR_MATERIAL_PACKAGE_VERSION,
    "0.0.0-ANGRX": NGRX_PACKAGE_VERSION,
    "0.0.0-ANGXT": NGXT_PACKAGE_VERSION,
    "0.0.0-DATEFNS": DATEFNS_PACKAGE_VERSION,
    "0.0.0-GIC": GIC_PACKAGE_VERSION,
    "0.0.0-ION": IONIC_PACKAGE_VERSION,
    "0.0.0-NG": ANGULAR_PACKAGE_VERSION,
    "0.0.0-POUCHDB": POUCHDB_PACKAGE_VERSION,
    "0.0.0-TSLIB": TSLIB_PACKAGE_VERSION,
    "0.0.0-URLPARSE": URL_PARSE_PACKAGE_VERSION,
    "0.0.0-UUID": UUID_PACKAGE_VERSION,
    # Version of the local package being built, generated via the `--workspace_status_command` flag.
    "0.0.0-PLACEHOLDER": "{BUILD_SCM_VERSION}",
    # Version of `rxjs`
    "0.0.0-RXJS": RXJS_PACKAGE_VERSION,
}

# List of default Angular library UMD bundles which are not processed by ngcc.
ANGULAR_NO_NGCC_BUNDLES = [
    ("@angular/compiler", ["compiler.umd.js"]),
]

# List of Angular library UMD bundles which will be processed by ngcc.
ANGULAR_NGCC_BUNDLES = [
    ("@angular/animations", ["animations-browser.umd.js", "animations.umd.js"]),
    ("@angular/cdk", ["cdk-accordion.umd.js", "cdk-a11y.umd.js", "cdk-bidi.umd.js", "cdk-collections.umd.js", "cdk-drag-drop.umd.js", "cdk-keycodes.umd.js", "cdk-layout.umd.js", "cdk-observers.umd.js", "cdk-overlay.umd.js", "cdk-platform.umd.js", "cdk-portal.umd.js", "cdk-scrolling.umd.js", "cdk-table.umd.js", "cdk-text-field.umd.js"]),
    ("@angular/common", ["common-http-testing.umd.js", "common-http.umd.js", "common-testing.umd.js", "common.umd.js"]),
    ("@angular/compiler", ["compiler-testing.umd.js"]),
    ("@angular/core", ["core-testing.umd.js", "core.umd.js"]),
    ("@angular/forms", ["forms.umd.js"]),
    ("@angular/material", ["material-autocomplete.umd.js", "material-button.umd.js", "material-button-toggle.umd.js", "material-card.umd.js", "material-checkbox.umd.js", "material-chips.umd.js", "material-core.umd.js", "material-dialog.umd.js", "material-divider.umd.js", "material-expansion.umd.js", "material-form-field.umd.js", "material-grid-list.umd.js", "material-icon.umd.js", "material-input.umd.js", "material-list.umd.js", "material-menu.umd.js", "material-paginator.umd.js", "material-progress-bar.umd.js", "material-radio.umd.js", "material-select.umd.js", "material-sidenav.umd.js", "material-slide-toggle.umd.js", "material-slider.umd.js", "material-snack-bar.umd.js", "material-sort.umd.js", "material-table.umd.js", "material-tabs.umd.js", "material-toolbar.umd.js", "material-tooltip.umd.js"]),
    ("@angular/platform-browser-dynamic", ["platform-browser-dynamic-testing.umd.js", "platform-browser-dynamic.umd.js"]),
    ("@angular/platform-browser", ["platform-browser.umd.js", "platform-browser-testing.umd.js", "platform-browser-animations.umd.js"]),
    ("@angular/router", ["router.umd.js"]),
]

THIRD_PARTY_NGCC_BUNDLES = [
    ("@gic/angular", "gic-angular.umd.js"),
    ("@ionic/angular", "ionic-angular.umd.js"),
    ("@ngrx/effects", "ngrx-effects.umd.js"),
    ("@ngrx/store", "ngrx-store.umd.js"),
    ("@ngx-translate/core", "ngx-translate-core.umd.js"),
]

THIRD_PARTY_NO_NGCC_BUNDLES = [
    ("@gic/core", []),
    ("@gic/core/loader", []),
    ("@ionic/core", []),
    ("@ionic/core/loader", []),
    ("date-fns", []),
    ("pouchdb", []),
    ("pouchdb-find", []),
    ("uuid", []),
    ("url-parse", []),
]

"""
  Gets a dictionary of all packages and their bundle names.
"""

def getFrameworkPackageBundles():
    res = {}
    for pkgName, bundleNames in ANGULAR_NGCC_BUNDLES + ANGULAR_NO_NGCC_BUNDLES:
        res[pkgName] = res.get(pkgName, []) + bundleNames
    return res

"""
  Gets a dictionary of all third party packages and their bundle names.
"""

def getThirdPartyPackageBundles():
    res = {}
    for pkgName, bundleName in THIRD_PARTY_NGCC_BUNDLES:
        res[pkgName] = bundleName
    return res

def getThirdPartyNoNgccPackageBundles():
    res = {}
    for pkgName, bundleName in THIRD_PARTY_NO_NGCC_BUNDLES:
        res[pkgName] = bundleName
    return res

"""
  Gets a list of labels which resolve to the UMD bundles of the given packages.
"""

def getUmdFilePaths(packages, ngcc_artifacts):
    tmpl = "@npm//:node_modules/%s" + ("/__ivy_ngcc__" if ngcc_artifacts else "") + "/bundles/%s"
    return [
        tmpl % (pkgName, bundleName)
        for pkgName, bundleNames in packages
        for bundleName in bundleNames
    ]

def getThirdPartyUmdFilePaths(packages, ngcc_artifacts):
    tmpl = "@npm//:node_modules/%s" + ("/__ivy_ngcc__" if ngcc_artifacts else "") + "/bundles/%s"
    return [
        tmpl % (pkgName, bundleName)
        for pkgName, bundleName in packages
    ]

def getThirdPartyNoNgccUmdFilePaths(packages):
    bundles = []
    no_shim_tmpl = "@npm//%s:%s__umd"
    shim_tmpl = "//tools/third-party-libs:%s_umd_module"
    for package, shims in packages:
        has_shims = len(shims) > 0
        if has_shims:
            bundles.append(shim_tmpl % package)
        else:
            bundles.append(no_shim_tmpl % (package, package.split("/")[-1]))
    return bundles

ANGULAR_PACKAGE_BUNDLES = getFrameworkPackageBundles()

THIRD_PARTY_PACKAGE_BUNDLES = getThirdPartyPackageBundles()
THIRD_PARTY_NO_NGCC_PACKAGE_BUNDLES = getThirdPartyNoNgccPackageBundles()

ANGULAR_LIBRARY_VIEW_ENGINE_UMDS = getUmdFilePaths(ANGULAR_NO_NGCC_BUNDLES, False) + \
                                   getUmdFilePaths(ANGULAR_NGCC_BUNDLES, False) + \
                                   getThirdPartyUmdFilePaths(THIRD_PARTY_NGCC_BUNDLES, False) + \
                                   getThirdPartyNoNgccUmdFilePaths(THIRD_PARTY_NO_NGCC_BUNDLES)

ANGULAR_LIBRARY_IVY_UMDS = getUmdFilePaths(ANGULAR_NO_NGCC_BUNDLES, False) + \
                           getUmdFilePaths(ANGULAR_NGCC_BUNDLES, True) + \
                           getThirdPartyUmdFilePaths(THIRD_PARTY_NGCC_BUNDLES, True) + \
                           getThirdPartyNoNgccUmdFilePaths(THIRD_PARTY_NO_NGCC_BUNDLES)

"""
  Gets the list of targets for the Angular library UMD bundles. Conditionally
  switches between View Engine or Ivy UMD bundles based on the
  "--config={ivy,view-engine}" flag.
"""

def getAngularUmdTargets():
    return select({
        "//tools:view_engine_mode": ANGULAR_LIBRARY_VIEW_ENGINE_UMDS,
        "//conditions:default": ANGULAR_LIBRARY_IVY_UMDS,
    })


"""
  Gets the list of targets for the third party librariers UMD bundles.
"""

def getThirdPartyUmdTargets():
    return getThirdPartyNoNgccUmdFilePaths(THIRD_PARTY_NO_NGCC_BUNDLES)
