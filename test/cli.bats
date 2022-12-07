#!/usr/bin/env bats

CONTEXT=${TEST_BATS_CONTEXT:-dist}

@test "--producer: no producer given" {
  run $CONTEXT/cli.js
  result="$(echo $output | grep 'Missing required argument: producer' | wc -l)"
  [ "$result" -eq 1 ]
  result="$(echo $output | rev | cut -d ' ' -f 1 | rev )"
  [ "$result" != "Pass!" ]
}
@test "--producer: 1 producer given" {
  run $CONTEXT/cli.js -p 'yarn ava test/passing.test.js --tap'
  result="$(echo $output | grep 'Missing required argument: producer' | wc -l)"
  [ "$result" -eq 0 ]
  result="$(echo $output | rev | cut -d ' ' -f 1 | rev )"
  [ "$result" == "Pass!" ]
}
@test "--producer: 2 producers given" {
  run $CONTEXT/cli.js -p 'yarn ava test/skipping.test.js --tap' -p 'yarn ava test/passing.test.js --tap'
  result="$(echo $output | grep 'Missing required argument: producer' | wc -l)"
  [ "$result" -eq 0 ]
  result="$(echo $output | rev | cut -d ' ' -f 1 | rev )"
  [ "$result" == "Pass!" ]
}

@test "--audio: default file" {
  if [ $CONTEXT != "dist" ]; then
    skip "for 'dist' context only"
  fi
  run $CONTEXT/cli.js -p 'yarn ava test/skipping.test.js --tap'
  result="$(echo $output | grep 'ENOENT: no such file or directory' | wc -l)"
  [ "$result" -eq 0 ]
}
@test "--audio: file given by full version" {
  run $CONTEXT/cli.js -p 'yarn ava test/skipping.test.js --tap' --audio src/sound/nyan.ogg
  result="$(echo $output | grep 'ENOENT: no such file or directory' | wc -l)"
  [ "$result" -eq 0 ]
}
@test "--audio: file given by short version" {
  run $CONTEXT/cli.js -p 'yarn ava test/skipping.test.js --tap' -a src/sound/nyan.ogg
  result="$(echo $output | grep 'ENOENT: no such file or directory' | wc -l)"
  [ "$result" -eq 0 ]
}
@test "--audio: wrong file given by short version" {
  run $CONTEXT/cli.js -p 'yarn ava test/skipping.test.js --tap' -a wrong/file.ogg
  result="$(echo $output | grep 'ENOENT: no such file or directory' | wc -l)"
  [ "$result" -eq 1 ]
}

@test "--volume: 100% given by full version" {
  run $CONTEXT/cli.js -p 'yarn ava test/skipping.test.js --tap' -a src/sound/nyan.ogg --volume 100
  result="$(echo $output | rev | cut -d ' ' -f 1 | rev )"
  [ "$result" == "Pass!" ]
}
@test "--volume: 50% given by long version" {
  run $CONTEXT/cli.js -p 'yarn ava test/skipping.test.js --tap' -a src/sound/nyan.ogg --volume 50
  result="$(echo $output | rev | cut -d ' ' -f 1 | rev )"
  [ "$result" == "Pass!" ]
}
@test "--volume: 50% given by short version" {
  run $CONTEXT/cli.js -p 'yarn ava test/skipping.test.js --tap' -a src/sound/nyan.ogg -v 50
  result="$(echo $output | rev | cut -d ' ' -f 1 | rev )"
  [ "$result" == "Pass!" ]
}
@test "--volume: 20% given by short version" {
  run $CONTEXT/cli.js -p 'yarn ava test/skipping.test.js --tap' -a src/sound/nyan.ogg -v 20
  result="$(echo $output | rev | cut -d ' ' -f 1 | rev )"
  [ "$result" == "Pass!" ]
}
@test "--volume: -1% given by short version" {
  run $CONTEXT/cli.js -p 'yarn ava test/skipping.test.js --tap' -v -1
  result="$(echo $output | grep '0-100' | wc -l)"
  [ "$result" -eq 1 ]
}

@test "--tap switch disabled by default" {
  run $CONTEXT/cli.js -p 'yarn ava test/skipping.test.js --tap'
  result="$(echo $output | rev | cut -d ' ' -f 1 | rev )"
  [ "$result" == "Pass!" ]
}
@test "--tap switch enabled by full version" {
  run $CONTEXT/cli.js -p 'yarn ava test/skipping.test.js --tap' --tap
  result="$(echo $output | rev | cut -d ' ' -f 1 | rev )"
  [ "$result" == "1..200" ]
}
@test "--tap switch enabled by short version" {
  run $CONTEXT/cli.js -p 'yarn ava test/skipping.test.js --tap' -t
  result="$(echo $output | rev | cut -d ' ' -f 1 | rev )"
  [ "$result" == "1..200" ]
}
