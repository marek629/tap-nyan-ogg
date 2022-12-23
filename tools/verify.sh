#!/bin/env bash

bats tools/verify.bats --timing
yarn audit
