DATA_DEPS = [
    "//tools/third-party-libs:amd_pouchdb",
    "//tools/third-party-libs:amd_pouchdb_find",
    "//tools/third-party-libs:amd_uuid",
]

IONIC_DEPS = [
    "//tools/third-party-libs:amd_gic_core",
    "//tools/third-party-libs:amd_gic_core_loader",
    "//tools/third-party-libs:amd_ionic_core",
    "//tools/third-party-libs:amd_ionic_core_loader",
]

OTHER_DEPS = [
    "//tools/third-party-libs:amd_date_fns",
    "//tools/third-party-libs:amd_url_parse",
]

def get_amd_bundles():
    res = []
    deps = DATA_DEPS + IONIC_DEPS + OTHER_DEPS
    for d in deps:
        res.append("%s_bundle.js" % d)
    return res
