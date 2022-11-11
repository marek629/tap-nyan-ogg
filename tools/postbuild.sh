#!/bin/env bash

mkdir -p dist/sound
cp src/sound/*.ogg dist/sound/

`dirname $0`/fixpath-postparcel.js ../dist/cli.js ../dist/audio/play.js
chmod +x dist/cli.js
