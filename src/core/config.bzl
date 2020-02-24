# List of all entry-points of the Gngt core package.
CORE_ENTRYPOINTS = [
    "admin",
    "auth",
    "calendar",
    "common",
    "model",
    "reducers",
    "sync",
    "translations",
]

# List of all entry-point targets of the Gngt core package.
CORE_TARGETS = ["//src/core"] + ["//src/core/%s" % ep for ep in CORE_ENTRYPOINTS]

CORE_SCSS_LIBS = [
    "//src/core/%s:%s_scss_lib" % (p, p.replace("-", "_"))
    for p in CORE_ENTRYPOINTS
]
