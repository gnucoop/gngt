#!/bin/bash

CACHE_KEY_FILES=".bazelversion tools/postinstall/apply-patches.js WORKSPACE yarn.lock"

echo `tar cf - ${CACHE_KEY_FILES} | sha256sum | awk '{print $1}'`
