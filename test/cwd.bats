#!/usr/bin/env bats

@test "execute from root project directory" {
  run src/cli.js -p 'yarn ava test/skipping.test.js --tap' -t
  result="$(echo $output | grep ERR_MODULE_NOT_FOUND | wc -l)"
  [ "$result" -eq 0 ]
}

@test "execute from src directory in silence mode" {
  cd src
  run ./cli.js -p 'yarn ava test/skipping.test.js --tap' -t -s
  result="$(echo $output | grep ERR_MODULE_NOT_FOUND | wc -l)"
  [ "$result" -eq 0 ]
}

@test "execute from src directory" {
  cd src
  run ./cli.js -p 'yarn ava test/skipping.test.js --tap' -t
  result="$(echo $output | grep ERR_MODULE_NOT_FOUND | wc -l)"
  [ "$result" -eq 0 ]
}

@test "execute from test directory" {
  cd test
  run ../src/cli.js -p 'yarn ava test/skipping.test.js --tap' -t
  result="$(echo $output | grep ERR_MODULE_NOT_FOUND | wc -l)"
  [ "$result" -eq 0 ]
}
