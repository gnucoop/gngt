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

ANGULAR_PACKAGES_CONFIG = [
    ("@angular/animations", struct(entry_points = ["browser"])),
    ("@angular/common", struct(entry_points = ["http/testing", "http", "testing"])),
    ("@angular/compiler", struct(entry_points = ["testing"])),
    ("@angular/core", struct(entry_points = ["testing"])),
    ("@angular/forms", struct(entry_points = [])),
    ("@angular/platform-browser", struct(entry_points = ["testing", "animations"])),
    ("@angular/platform-server", struct(entry_points = [], platform = "node")),
    ("@angular/platform-browser-dynamic", struct(entry_points = ["testing"])),
    ("@angular/router", struct(entry_points = [])),
    ("@angular/localize", struct(entry_points = ["init"])),
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
