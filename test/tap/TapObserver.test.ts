// @ts-ignore
import { scheduler } from 'timers/promises'
import { Readable } from 'stream'

import test from 'ava'

import { TapObserver } from '../../src/tap/index.js'
import { titleFn } from '../utils.js'


// @ts-ignore
const isValidMacro = test.macro({
  exec: async (t, source: Readable, expected: boolean) => {
    const observer = new TapObserver
    source.pipe(observer)

    t.plan(1)
    source.on('end', () => {
      t.is(observer.isValid, expected)
    })
    await scheduler.wait(1)
  },
  title: titleFn('valid state flag for given input', 'from'),
})
for (const [title, ...data] of [
  // testing default state
  [
    'empty stream',
    Readable.from([]),
    true,
  ],
  [
    'empty string',
    Readable.from(['']),
    true,
  ],
  // testing close to real use cases
  [
    'one chunk passing stream',
    Readable.from([`TAP version 13
      ok 1 - testing 0
      ok 2 - testing 1
      ok 3 - testing 2

      1..3
      # tests 3
      # pass 3
      # fail 0`]),
    true,
  ],
  [
    'three chunks passing stream',
    Readable.from([
      `TAP version 13`,
      `ok 1 - testing 0
      ok 2 - testing 1
      ok 3 - testing 2`,
      `
      1..3
      # tests 3
      # pass 3
      # fail 0`,
    ]),
    true,
  ],
  [
    'two chunks skipping stream',
    Readable.from([
      `TAP version 13
      ok 1 - massive skipping 0 # SKIP
      ok 2 - massive skipping 1 # SKIP

      1..2
      # tests 2`,
      `# pass 0
      # skip 2
      # fail 0`,
    ]),
    true,
  ],
  [
    'three chunks skipping stream',
    Readable.from([
      `TAP version 13`,
      `ok 1 - massive skipping 0 # SKIP`,
      `ok 2 - massive skipping 1 # SKIP

      1..2
      # tests 2
      # pass 0
      # skip 2
      # fail 0`,
    ]),
    true,
  ],
  [
    'two chunks failing stream',
    Readable.from([
      `TAP version 13
      not ok 1 - failing 0
        ---
          name: AssertionError
          message: Test failed via \`t.fail()\`
          assertion: fail
          at: 'fail (file://test/massive.test.js:5:21)'
        ...
      not ok 2 - failing 1
        ---
          name: AssertionError`,
      `    message: Test failed via \`t.fail()\`
          assertion: fail
          at: 'fail (file://test/massive.test.js:5:21)'
        ...
      not ok 3 - failing 2
        ---
          name: AssertionError
          message: Test failed via \`t.fail()\`
          assertion: fail
          at: 'fail (file://test/massive.test.js:5:21)'
        ...
    
      1..3
      # tests 3
      # pass 0
      # fail 3`,
    ]),
    false,
  ],
  [
    'three chunks failing stream',
    Readable.from([
      `TAP version 13
      not ok 1 - failing 0
        ---
          name: AssertionError
          message: Test failed via \`t.fail()\`
          assertion: fail
          at: 'fail (file://test/massive.test.js:5:21)'
        ...
      not ok 2 - failing 1
        ---
          name: AssertionError
          message: Test failed via \`t.fail()\`
          assertion: fail
          at: 'fail (file://test/massive.test.js:5:21)'
        ...
      not ok 3 - `,
      `failing 2
        ---
          name: AssertionError
          message: Test failed via \`t.fail()\`
          assertion: fail
          at: 'fail (file://test/massive.test.js:5:21)'
        ...
    
      1..3
      # tests 3
      # pass 0`,
      `# fail 3`,
    ]),
    false,
  ],
  [
    'six chunks failing stream',
    Readable.from([
      `TAP version 13
      not ok 1 - failing 0
        ---
          name: AssertionError
          message:`,
      ` Test failed via \`t.fail()\`
          assertion: fail
          at: 'fa`,
      `il (file://test/massive.test.js:5:21)'
        ...
      not ok 2 - failing 1
        ---
          name: AssertionError
          message: Test failed via \`t.fail()\`
          assertion: fail
          at: 'fail (file://test/massive.test.js:5:21)'
        ...
      not ok 3 - failing 2
        ---`,
      `    name: AssertionError
          message: Test failed via \`t.fail()\`
          assertion: fail
          at: 'fail (file://test/massive.test.js:5:21)'
        ...
    
      1..3
      # t`,
      `ests 3`,
      `# pass 0
      # fail 3`,
    ]),
    false,
  ],
  // testing the regular expression
  [
    'one chunk one-liner passing stream',
    Readable.from([
      'ok 1 - passing 0',
    ]),
    true,
  ],
  [
    'one chunk one-liner passing stream with "not ok" in test name',
    Readable.from([
      'ok 1 - not ok 30',
    ]),
    true,
  ],
  [
    'two chunks one-liner passing stream',
    Readable.from([
      'ok 1',
      ' - passing 0',
    ]),
    true,
  ],
  [
    'one chunk one-liner skipping stream',
    Readable.from([
      'ok 1 - passing 0 # SKIP',
    ]),
    true,
  ],
  [
    'one chunk one-liner skipping stream with "not ok" in test name',
    Readable.from([
      'ok 1 - not ok 30 # SKIP',
    ]),
    true,
  ],
  [
    'one chunk one-liner failing stream',
    Readable.from([
      'not ok 2 - failing 1',
    ]),
    false,
  ],
  [
    'two chunks one-liner failing stream',
    Readable.from([
      'not ok',
      ' 2 - failing 1',
    ]),
    false,
  ],
]) test(title as string, isValidMacro, ...data)
