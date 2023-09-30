#!/usr/bin/env bats

@test "all tests should count at least 66 and run at least 20 seconds" {
  start_time=$(date +%s)

  run time yarn test:tap

  local test_number=0
  for (( i=0; i < ${#lines[@]}; i++ )); do
    local line=${lines[$i]}
    if [ ${line:0:2} = 'ok' ]; then
      test_number=$(echo $line | cut -d ' ' -f 2)
    fi
  done
  echo "Test number: " $test_number
  [[ "$test_number" -ge 66 ]]

  end_time=$(date +%s)
  elapsed=$(( end_time - start_time ))
  echo "Elapsed time in seconds: " $elapsed
  [[ "$elapsed" -ge 20 ]]
}
