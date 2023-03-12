#!/bin/env bash

mkdir -p dist/sound
cp src/sound/*.ogg dist/sound/
`yarn bin`/depcruise src --include-only "^src" --output-type dot --validate \
  | dot -T svg > build/dependency-graph.svg

`dirname $0`/fixpath-postparcel.js ../dist/cli.js ../dist/audio/play.js
for file in $(find dist -type f -name "*.js");
do
  bytesBefore=`wc -c $file | cut -d' ' -f1`
  yarn terser --comments false --module --timings $file -o $file
  bytesAfter=`wc -c $file | cut -d' ' -f1`
  echo "$file file was compressed by $(echo "($bytesBefore - $bytesAfter) / $bytesBefore *100" | bc -l | xargs printf %.2f)%"
done
chmod +x dist/cli.js
