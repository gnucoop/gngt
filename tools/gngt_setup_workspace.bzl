"""Install Gngt source dependencies"""

load("@build_bazel_rules_nodejs//:defs.bzl", "yarn_install")

def gngt_setup_workspace():
  """
    This repository rule should be called from your WORKSPACE file.
    It creates some additional Bazel external repositories that are used internally
    to build Gngt
  """
  # Use Bazel managed node modules. See more below:
  # https://github.com/bazelbuild/rules_nodejs#bazel-managed-vs-self-managed-dependencies
  # Note: The repository_rule name is `@gngtdeps` so it does not conflict with the `@npm` repository
  # name downstream when building Gngt from source. In the future when Angular + Bazel
  # users can build using the @gngt npm bundles (depends on Ivy) this can be changed
  # to `@npm`.
  yarn_install(
    name = "gngtdeps",
    package_json = "@gngt//:package.json",
    # Ensure that the script is available when running `postinstall` in the Bazel sandbox.
    data = ["@gngt//:tools/npm/check-npm.js"],
    yarn_lock = "@gngt//:yarn.lock",
  )
