# List of all entry-points of the Gngt core package.
entryPoints = [
    "admin",
    "auth",
    "calendar",
    "model",
]

# List of all non-testing entry-points of the Gngt material package.
MATERIAL_ENTRYPOINTS = [
    ep
    for ep in entryPoints
    if not "/testing" in ep
]

# List of all testing entry-points of the Gngt material package.
MATERIAL_TESTING_ENTRYPOINTS = [
    ep
    for ep in entryPoints
    if not ep in MATERIAL_ENTRYPOINTS
]

# List of all entry-point targets of the Gngt material package.
MATERIAL_TARGETS = ["//src/material"] + ["//src/material/%s" % ep for ep in MATERIAL_ENTRYPOINTS]

# List of all testing entry-point targets of the Gngt material package.
MATERIAL_TESTING_TARGETS = ["//src/material/%s" % ep for ep in MATERIAL_TESTING_ENTRYPOINTS]

MATERIAL_SCSS_LIBS = [
    "//src/material/%s:%s_scss_lib" % (p, p.replace("-", "_"))
    for p in MATERIAL_ENTRYPOINTS
]
