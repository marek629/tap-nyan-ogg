#!/bin/env bash

export TEST_BATS_CONTEXT=build/src
yarn c8 --check-coverage --per-file \
    --lines 0 --statements 0 --functions 0 \
    --branches 100 \
  yarn test
