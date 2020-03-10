load("//tools:defaults.bzl", "protractor_web_test_suite")

def e2e_test_suite(name, data = [], tags = ["e2e"], deps = []):
    protractor_web_test_suite(
        name = name,
        configuration = "//src/e2e-app-mat:protractor.conf.js",
        data = [
            "//tools/axe-protractor",
            "@npm//axe-webdriverjs",
        ] + data,
        on_prepare = "//src/e2e-app-mat:start-devserver.js",
        server = "//src/e2e-app-mat:devserver",
        tags = tags,
        deps = deps,
    )
