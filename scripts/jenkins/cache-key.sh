#!/bin/bash

CACHE_KEY_FILES=".bazelversion tools/postinstall/apply-patches.js WORKSPACE yarn.lock"

TOTAL_SUM=""
for CACHE_KEY_FILE in "${CACHE_KEY_FILES[@]}"; do
  SUM=`sha256sum -b ${CACHE_KEY_FILE} | awk '{print $1}'`
  TOTAL_SUM="${TOTAL_SUM}${SUM}"
done

echo `echo ${TOTAL_SUM} | sha256sum -b - | awk '{print $1}'`
