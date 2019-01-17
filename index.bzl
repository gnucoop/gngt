"""Public API surface is re-exported here.
This API is exported for users building Gngt from source in
downstream projects.
"""

load("//tools:gngt_setup_workspace.bzl",
    _gngt_setup_workspace = "gngt_setup_workspace")

gngt_setup_workspace = _gngt_setup_workspace
