#!/usr/bin/env bats

@test "execute from root project directory" {
  run dist/cli.js -p 'yarn ava test/skipping.test.js --tap' -t
  result="$(echo $output | grep ERR_MODULE_NOT_FOUND | wc -l)"
  [ "$result" -eq 0 ]
}

@test "execute from dist directory in silence mode" {
  cd dist
  run ./cli.js -p 'yarn ava test/skipping.test.js --tap' -t -s
  result="$(echo $output | grep ERR_MODULE_NOT_FOUND | wc -l)"
  [ "$result" -eq 0 ]
}

@test "execute from dist directory" {
  cd dist
  run ./cli.js -p 'yarn ava test/skipping.test.js --tap' -t
  result="$(echo $output | grep ERR_MODULE_NOT_FOUND | wc -l)"
  [ "$result" -eq 0 ]
}

@test "execute from test directory" {
  cd test
  run ../dist/cli.js -p 'yarn ava test/skipping.test.js --tap' -t
  result="$(echo $output | grep ERR_MODULE_NOT_FOUND | wc -l)"
  [ "$result" -eq 0 ]
}
