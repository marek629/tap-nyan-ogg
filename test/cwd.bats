#!/usr/bin/env bats


CONTEXT=${TEST_BATS_CONTEXT:-dist}

@test "execute from root project directory" {
  run $CONTEXT/cli.js -p 'yarn ava test/skipping.test.js --tap' -t
  result="$(echo $output | grep ERR_MODULE_NOT_FOUND | wc -l)"
  [ "$result" -eq 0 ]
}

@test "execute from $CONTEXT directory in silence mode" {
  cd $CONTEXT
  run ./cli.js -p 'yarn ava ../test/skipping.test.js --tap' -t -s
  result="$(echo $output | grep ERR_MODULE_NOT_FOUND | wc -l)"
  [ "$result" -eq 0 ]
}

@test "execute from $CONTEXT directory" {
  cd $CONTEXT
  run ./cli.js -p 'yarn ava ../test/skipping.test.js --tap' -t
  result="$(echo $output | grep ERR_MODULE_NOT_FOUND | wc -l)"
  [ "$result" -eq 0 ]
}

@test "execute from test directory" {
  if [ $CONTEXT != "dist" ]; then
    skip "for 'dist' context only"
  fi
  cd test
  run ../$CONTEXT/cli.js -p 'yarn ava ../test/skipping.test.js --tap' -t
  result="$(echo $output | grep ERR_MODULE_NOT_FOUND | wc -l)"
  [ "$result" -eq 0 ]
}
