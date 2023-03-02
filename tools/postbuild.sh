#!/bin/env bash

mkdir -p dist/sound
cp src/sound/*.ogg dist/sound/
`yarn bin`/depcruise src --include-only "^src" --config --output-type dot \
  | dot -T svg > build/dependency-graph.svg

`dirname $0`/fixpath-postparcel.js ../dist/cli.js ../dist/audio/play.js
# TODO: minify
# TODO: add linter?
chmod +x dist/cli.js
