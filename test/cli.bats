#!/usr/bin/env bats

CONTEXT=${TEST_BATS_CONTEXT:-dist}

@test "--defaults: long version" {
  run $CONTEXT/cli.js --defaults
  [ "$status" -eq 0 ]
  [ "${#lines[@]}" -gt 8 ]
}
@test "--defaults: short version" {
  run $CONTEXT/cli.js -d
  [ "$status" -eq 0 ]
  [ "${#lines[@]}" -gt 8 ]
}

@test "--producer is not supported anymore" {
  run $CONTEXT/cli.js -p 'yarn ava test/skipping.test.js --tap' -p 'yarn ava test/skipping.test.js --tap'
  [ "$status" -eq 5 ]
  [ "${#lines[@]}" -gt 0 ]
  result="$(echo $output | grep 'Empty input stream!' | wc -l)"
  [ "$result" -eq 1 ]
}

@test "--audio: default file" {
  run bash -c "yarn ava test/skipping.test.js --tap | $CONTEXT/cli.js"
  result="$(echo $output | grep 'ENOENT: no such file or directory' | wc -l)"
  [ "$result" -eq 0 ]
}
@test "--audio: file given by full version" {
  run bash -c "yarn ava test/skipping.test.js --tap | $CONTEXT/cli.js --audio src/sound/nyan.ogg"
  result="$(echo $output | grep 'ENOENT: no such file or directory' | wc -l)"
  [ "$result" -eq 0 ]
}
@test "--audio: file given by short version" {
  run bash -c "yarn ava test/skipping.test.js --tap | $CONTEXT/cli.js -a src/sound/nyan.ogg"
  result="$(echo $output | grep 'ENOENT: no such file or directory' | wc -l)"
  [ "$result" -eq 0 ]
}
@test "--audio: wrong file given by short version" {
  run bash -c "yarn ava test/skipping.test.js --tap | $CONTEXT/cli.js -a wrong/file.ogg"
  result="$(echo $output | grep 'ENOENT: no such file or directory' | wc -l)"
  [ "$result" -eq 1 ]
}

@test "--volume: 100% given by full version" {
  run bash -c "yarn ava test/skipping.test.js --tap | $CONTEXT/cli.js -a src/sound/nyan.ogg --volume 100"
  fails="$(echo $output | grep 'not ok' | wc -l)"
  [ "$fails" -eq 0 ]
  success="$(echo $output | grep 'ok' | wc -l)"
  [ "$success" -gt 0 ]
}
@test "--volume: 50% given by long version" {
  run bash -c "yarn ava test/skipping.test.js --tap | $CONTEXT/cli.js -a src/sound/nyan.ogg --volume 50"
  fails="$(echo $output | grep 'not ok' | wc -l)"
  [ "$fails" -eq 0 ]
  success="$(echo $output | grep 'ok' | wc -l)"
  [ "$success" -gt 0 ]
}
@test "--volume: 50% given by short version" {
  run bash -c "yarn ava test/skipping.test.js --tap | $CONTEXT/cli.js -a src/sound/nyan.ogg -v 50"
  fails="$(echo $output | grep 'not ok' | wc -l)"
  [ "$fails" -eq 0 ]
  success="$(echo $output | grep 'ok' | wc -l)"
  [ "$success" -gt 0 ]
}
@test "--volume: 20% given by short version" {
  run bash -c "yarn ava test/skipping.test.js --tap | $CONTEXT/cli.js -a src/sound/nyan.ogg -v 20"
  fails="$(echo $output | grep 'not ok' | wc -l)"
  [ "$fails" -eq 0 ]
  success="$(echo $output | grep 'ok' | wc -l)"
  [ "$success" -gt 0 ]
}
@test "--volume: -1% given by short version" {
  run bash -c "yarn ava test/skipping.test.js --tap | $CONTEXT/cli.js -v -1"
  [ "$status" -ne 0 ]
  error="$(echo $output | grep 'Error: write EPIPE' | wc -l)"
  [ "$error" -gt 0 ]
}

@test "--tap switch deprecated as tap-ogg produces TAP stream on STDOUT" {
  run bash -c "yarn ava test/skipping.test.js --tap | $CONTEXT/cli.js"
  success="$(echo $output | grep 'ok' | wc -l)"
  [ "$success" -gt 0 ]
}
