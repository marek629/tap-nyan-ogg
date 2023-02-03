#!/bin/env bash

rm -rf coverage

TEST_SCRIPT='test'
case $1 in
  '--unit' | '-u') TEST_SCRIPT=$TEST_SCRIPT':unit' ;;
  '--integration' | '-i') TEST_SCRIPT=$TEST_SCRIPT':integration' ;;
  '--all' | '-a') ;;
  *) echo 'Invalid parameter '$1; exit 1 ;;
esac

export TEST_BATS_CONTEXT=build/src
yarn c8 --check-coverage \
    --lines 0 --statements 0 --functions 0 \
    --branches 95 \
  yarn $TEST_SCRIPT
