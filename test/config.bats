#!/usr/bin/env bats


CONTEXT=${TEST_BATS_CONTEXT:-dist}
NAME="config.yml"
CUSTOM_NAME="effects.yml"
CONTENTS="
effect:
  echo:
    enabled: true
    gain: 0.9
    size: 1000
  tremolo:
    enabled: false
    lfo:
      frequency: 3
"

@test "no $NAME file in CWD" {
  cd $CONTEXT
  rm -f $NAME
  run ./cli.js -p 'yarn ava ../test/skipping.test.js --tap' -t
  result="$(echo $output | grep Error | wc -l)"
  [ "$result" -eq 0 ]
}

@test "$NAME file in CWD at start" {
  cd $CONTEXT
  echo "$CONTENTS" > $NAME
  run ./cli.js -p 'yarn ava ../test/skipping.test.js --tap' -t
  result="$(echo $output | grep Error | wc -l)"
  [ "$result" -eq 0 ]
}

@test "$NAME file in CWD created while running" {
  cd $CONTEXT
  rm -f $NAME
  (sleep 0.2; touch $NAME) &
  run ./cli.js -p 'yarn ava ../test/skipping.test.js --tap' -t
  wait
  result="$(echo $output | grep Error | wc -l)"
  [ "$result" -eq 0 ] && [ -f $NAME ]
}

@test "$NAME file in CWD modified while running" {
  cd $CONTEXT
  echo "" > $NAME
  (sleep 1; echo "$CONTENTS" > $NAME) &
  run ./cli.js -p 'yarn ava ../test/skipping.test.js --tap' -t
  wait
  result="$(echo $output | grep Error | wc -l)"
  [ "$result" -eq 0 ] && [ `cat $NAME | wc -l` -gt 0 ]
}

@test "$NAME file in CWD created and modified while running" {
  cd $CONTEXT
  rm -f $NAME
  (sleep 0.2; touch $NAME; sleep 0.5; echo "$CONTENTS" > $NAME) &
  run ./cli.js -p 'yarn ava ../test/skipping.test.js --tap' -t
  wait
  result="$(echo $output | grep Error | wc -l)"
  [ "$result" -eq 0 ] && [ `cat $NAME | wc -l` -gt 0 ]
}

@test "$NAME file in CWD removed while running" {
  cd $CONTEXT
  echo "$CONTENTS" > $NAME
  (sleep 0.6; rm $NAME) &
  run ./cli.js -p 'yarn ava ../test/skipping.test.js --tap' -t
  wait
  result="$(echo $output | grep Error | wc -l)"
  [ "$result" -eq 0 ] && [ ! -f $NAME ]
}

@test "$CUSTOM_NAME file given by --config CLI parameter created while running" {
  cd $CONTEXT
  rm -f $CUSTOM_NAME
  (sleep 1; touch $CUSTOM_NAME) &
  run ./cli.js --config $CUSTOM_NAME -p 'yarn ava ../test/skipping.test.js --tap' -t
  wait
  result="$(echo $output | grep Error | wc -l)"
  [ "$result" -eq 0 ] && [ -f $CUSTOM_NAME ]
}

@test "$CUSTOM_NAME file given by -c CLI parameter modified while running" {
  cd $CONTEXT
  echo "" > $CUSTOM_NAME
  (sleep 0.3; echo "$CONTENTS" > $CUSTOM_NAME) &
  run ./cli.js -c $CUSTOM_NAME -p 'yarn ava ../test/skipping.test.js --tap' -t
  wait
  result="$(echo $output | grep Error | wc -l)"
  [ "$result" -eq 0 ] && [ `cat $CUSTOM_NAME | wc -l` -gt 0 ]
}
