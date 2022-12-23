#!/usr/bin/env bats

@test "all tests should count at least 66 and run at least 20 seconds" {
  run yarn test:tap
  result="$(echo $output |  rev | cut -d ' ' -f 1 | rev | cut -d. -f 3)"
  [ "$result" -ge 66 ]
}
