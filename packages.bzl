# Each individual package uses a placeholder for the version of Angular to ensure they're
# all in-sync. This map is passed to each ng_package rule to stamp out the appropriate
# version for the placeholders.
ANGULAR_PACKAGE_VERSION = "^13.0.0-0 || ^14.0.0-0"
ANGULAR_MATERIAL_PACKAGE_VERSION = "^13.0.0-0 || ^14.0.0-0"
DATEFNS_PACKAGE_VERSION = "^2.15.0"
GIC_PACKAGE_VERSION = "^5.3.0"
IONIC_PACKAGE_VERSION = "^5.3.0"
NGRX_PACKAGE_VERSION = "^12.0.0"
POUCHDB_PACKAGE_VERSION = "~7.0.0"
RXJS_PACKAGE_VERSION = "^6.5.3 || ^7.0.0"
TRANSLOCO_PACKAGE_VERSION = "^3.0.0"
TSLIB_PACKAGE_VERSION = "^2.2.0"
URL_PARSE_PACKAGE_VERSION = "^1.4.7"
UUID_PACKAGE_VERSION = "^8.3.0"

# Each placer holder is used to stamp versions during the build process, replacing the key with it's
# value pair. These replacements occur during building of `npm_package` and `ng_package` stamping in
# the peer dependencies and versions, primarily in `package.json`s.
VERSION_PLACEHOLDER_REPLACEMENTS = {
    "0.0.0-ANGM": ANGULAR_MATERIAL_PACKAGE_VERSION,
    "0.0.0-ANGRX": NGRX_PACKAGE_VERSION,
    "0.0.0-DATEFNS": DATEFNS_PACKAGE_VERSION,
    "0.0.0-GIC": GIC_PACKAGE_VERSION,
    "0.0.0-ION": IONIC_PACKAGE_VERSION,
    "0.0.0-NG": ANGULAR_PACKAGE_VERSION,
    "0.0.0-POUCHDB": POUCHDB_PACKAGE_VERSION,
    "0.0.0-TRANSLOCO": TRANSLOCO_PACKAGE_VERSION,
    "0.0.0-TSLIB": TSLIB_PACKAGE_VERSION,
    "0.0.0-URLPARSE": URL_PARSE_PACKAGE_VERSION,
    "0.0.0-UUID": UUID_PACKAGE_VERSION,
    # Version of the local package being built, generated via the `--workspace_status_command` flag.
    "0.0.0-PLACEHOLDER": "{BUILD_SCM_VERSION}",
    # Version of `rxjs`
    "0.0.0-RXJS": RXJS_PACKAGE_VERSION,
}

ANGULAR_PACKAGES_CONFIG = [
    ("@angular/animations", struct(entry_points = ["browser"])),
    ("@angular/cdk", struct(entry_points = ["a11y", "accordion", "bidi", "coercion", "collections", "layout", "observers", "overlay", "platform", "portal", "scrolling", "table", "text-field"])),
    ("@angular/common", struct(entry_points = ["http/testing", "http", "testing"])),
    ("@angular/compiler", struct(entry_points = ["testing"])),
    ("@angular/core", struct(entry_points = ["testing"])),
    ("@angular/forms", struct(entry_points = [])),
    ("@angular/material", struct(entry_points = ["autocomplete", "button", "card", "checkbox", "core", "dialog", "divider", "expansion", "form-field", "icon", "input", "list", "paginator", "progress-bar", "radio", "select", "sidenav", "sort", "snack-bar", "table", "toolbar", "tooltip"])),
    ("@angular/platform-browser", struct(entry_points = ["testing", "animations"])),
    ("@angular/platform-server", struct(entry_points = [], platform = "node")),
    ("@angular/platform-browser-dynamic", struct(entry_points = ["testing"])),
    ("@angular/router", struct(entry_points = [])),
    ("@angular/localize", struct(entry_points = ["init"])),
]

THIRD_PARTY_PACKAGES_CONFIG = [
    ("@gic/angular", "gic-angular", struct(entry_points = [], ngcc=False)),
    ("@ionic/angular", "ionic-angular", struct(entry_points = [], ngcc=False)),
    ("@ngneat/transloco", "ngneat-transloco", struct(entry_points = [], ngcc=False)),
    ("@ngrx/effects", "ngrx-effects", struct(entry_points = [], ngcc=True)),
    ("@ngrx/store", "ngrx-store", struct(entry_points = [], ngcc=True)),
]

ANGULAR_PACKAGES = [
    struct(
        name = name[len("@angular/"):],
        entry_points = config.entry_points,
        platform = config.platform if hasattr(config, "platform") else "browser",
        module_name = name,
    )
    for name, config in ANGULAR_PACKAGES_CONFIG
]

THIRD_PARTY_PACKAGES = [
    struct(
        name = name,
        main_entry_point = ep,
        entry_points = config.entry_points,
        platform = "browser",
        module_name = name,
        ngcc = config.ngcc,
    )
    for name, ep, config in THIRD_PARTY_PACKAGES_CONFIG
]
