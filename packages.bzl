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
]

MATERIAL_TARGETS = ["//src/material"] + ["//src/material/%s" % p for p in MATERIAL_PACKAGES]

# Each individual package uses a placeholder for the version of Angular to ensure they're
# all in-sync. This map is passed to each ng_package rule to stamp out the appropriate
# version for the placeholders.
ANGULAR_PACKAGE_VERSION = ">=6.0.0-beta.0 <7.0.0"
VERSION_PLACEHOLDER_REPLACEMENTS = {
  "0.0.0-NG": ANGULAR_PACKAGE_VERSION,
}

# Base rollup globals for everything in the repo.
ROLLUP_GLOBALS = {
  'tslib': 'tslib',
  'moment': 'moment',
  '@gngt/core': 'gngt.core',
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
