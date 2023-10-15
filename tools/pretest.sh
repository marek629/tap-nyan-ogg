#!/bin/env bash

yarn tsc

cd build
ln -sf ../package.json
cd -

cd build/src
chmod +x cli.js
ln -sf ../../submodule
ln -sf ../../src/sound
cd -

yarn prettier --check src/ test/
