#!/usr/bin/env bats

@test "--producer: no producer given" {
  run src/cli.js
  result="$(echo $output | grep 'Missing required argument: producer' | wc -l)"
  [ "$result" -eq 1 ]
  result="$(echo $output | rev | cut -d ' ' -f 1 | rev )"
  [ "$result" != "Pass!" ]
}
@test "--producer: 1 producer given" {
  run src/cli.js -p 'yarn ava test/massive.test.js --tap'
  result="$(echo $output | grep 'Missing required argument: producer' | wc -l)"
  [ "$result" -eq 0 ]
  result="$(echo $output | rev | cut -d ' ' -f 1 | rev )"
  [ "$result" == "Pass!" ]
}
@test "--producer: 2 producers given" {
  run src/cli.js -p 'yarn ava test/skipping.test.js --tap' -p 'yarn ava test/massive.test.js --tap'
  result="$(echo $output | grep 'Missing required argument: producer' | wc -l)"
  [ "$result" -eq 0 ]
  result="$(echo $output | rev | cut -d ' ' -f 1 | rev )"
  [ "$result" == "Pass!" ]
}

@test "--audio: default file" {
  run src/cli.js -p 'yarn ava test/skipping.test.js --tap'
  result="$(echo $output | grep 'ENOENT: no such file or directory' | wc -l)"
  [ "$result" -eq 0 ]
}
@test "--audio: file given by full version" {
  run src/cli.js -p 'yarn ava test/skipping.test.js --tap' --audio src/sound/nyan.ogg 
  result="$(echo $output | grep 'ENOENT: no such file or directory' | wc -l)"
  [ "$result" -eq 0 ]
}
@test "--audio: file given by short version" {
  run src/cli.js -p 'yarn ava test/skipping.test.js --tap' -a src/sound/nyan.ogg
  result="$(echo $output | grep 'ENOENT: no such file or directory' | wc -l)"
  [ "$result" -eq 0 ]
}
@test "--audio: wrong file given by short version" {
  run src/cli.js -p 'yarn ava test/skipping.test.js --tap' -a wrong/file.ogg
  result="$(echo $output | grep 'ENOENT: no such file or directory' | wc -l)"
  [ "$result" -eq 1 ]
}

@test "--tap switch disabled by default" {
  run src/cli.js -p 'yarn ava test/skipping.test.js --tap'
  result="$(echo $output | rev | cut -d ' ' -f 1 | rev )"
  [ "$result" == "Pass!" ]
}
@test "--tap switch enabled by full version" {
  run src/cli.js -p 'yarn ava test/skipping.test.js --tap' --tap
  result="$(echo $output | rev | cut -d ' ' -f 1 | rev )"
  [ "$result" == "1..200" ]
}
@test "--tap switch enabled by short version" {
  run src/cli.js -p 'yarn ava test/skipping.test.js --tap' -t
  result="$(echo $output | rev | cut -d ' ' -f 1 | rev )"
  [ "$result" == "1..200" ]
}
