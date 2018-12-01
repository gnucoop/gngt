# List of all components / subpackages.

CORE_PACKAGES = [
  "admin",
  "auth",
  "model",
  "reducers",
  "translations",
]

CORE_TARGETS = ["//src/core"] + ["//src/core/%s" % p for p in CORE_PACKAGES]

MATERIAL_PACKAGES = [
  "admin",
  "auth",
  "model",
]

MATERIAL_TARGETS = ["//src/material"] + ["//src/material/%s" % p for p in MATERIAL_PACKAGES]

IONIC_PACKAGES = [
  "admin",
  "auth",
  "common",
]

IONIC_TARGETS = ["//src/ionic"] + ["//src/ionic/%s" % p for p in IONIC_PACKAGES]

# Each individual package uses a placeholder for the version of Angular to ensure they're
# all in-sync. This map is passed to each ng_package rule to stamp out the appropriate
# version for the placeholders.
ANGULAR_PACKAGE_VERSION = ">=7.0.0"
ANGULAR_MATERIAL_PACKAGE_VERSION = ">=7.1.0"
NGRX_PACKAGE_VERSION = ">=7.0.0-beta.0"
NGXT_PACKAGE_VERSION = ">=11.0.0"
IONIC_PACKAGE_VERSION = ">=4.0.0-beta.17"
VERSION_PLACEHOLDER_REPLACEMENTS = {
  "0.0.0-NGM": ANGULAR_MATERIAL_PACKAGE_VERSION,
  "0.0.0-NGRX": NGRX_PACKAGE_VERSION,
  "0.0.0-NGXT": NGXT_PACKAGE_VERSION,
  "0.0.0-NG": ANGULAR_PACKAGE_VERSION,
  "0.0.0-ION": IONIC_PACKAGE_VERSION
}

# Base rollup globals for everything in the repo.
ROLLUP_GLOBALS = {
  'date-fns': 'date-fns',
  'tslib': 'tslib',
  'url-parse': 'url-parse',
  '@gngt/core': 'gngt.core',
  '@gngt/ionic': 'gngt.ionic',
  '@gngt/material': 'gngt.material',
}

# Rollup globals for core subpackages in the form of, e.g., {"@gngt/core/auth": "gngt.core.auth"}
ROLLUP_GLOBALS.update({
  "@gngt/core/%s" % p: "gngt.core.%s" % p for p in CORE_PACKAGES
})

# Rollup globals for material subpackages, e.g., {"@gngt/material/auth": "gngt.material.auth"}
ROLLUP_GLOBALS.update({
  "@gngt/material/%s" % p: "gngt.material.%s" % p for p in MATERIAL_PACKAGES
})

# Rollup globals for ionic subpackages, e.g., {"@gngt/ionic/auth": "gngt.material.auth"}
ROLLUP_GLOBALS.update({
  "@gngt/ionic/%s" % p: "gngt.ionic.%s" % p for p in IONIC_PACKAGES
})
