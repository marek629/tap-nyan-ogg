#!/bin/env bash

yarn tsc

cd build/src
chmod +x cli.js
ln -sf ../../submodule
ln -sf ../../src/sound
cd -
