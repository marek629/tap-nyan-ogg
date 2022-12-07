#!/bin/env bash

rm -rf coverage

export TEST_BATS_CONTEXT=build/src
yarn c8 --check-coverage \
    --lines 0 --statements 0 --functions 0 \
    --branches 95 \
  yarn test
