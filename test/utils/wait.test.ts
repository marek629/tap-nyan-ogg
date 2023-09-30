import EventEmitter from 'events'
import { setTimeout } from 'timers'

import test, { ExecutionContext } from 'ava'

import { eventTimeout } from '../../src/utils/wait.js'

import { titleFn } from '../utils.js'

interface DelayedEvent {
  name: string
  ms: number
}
const eventTimeoutMacro = test.macro({
  exec: async (
    t: ExecutionContext,
    waitEvent: DelayedEvent,
    emitEvent: DelayedEvent,
    expected: boolean,
  ) => {
    const emitter = new EventEmitter()
    const promise = eventTimeout(emitter, waitEvent.name, waitEvent.ms)
    setTimeout(() => {
      emitter.emit(emitEvent.name)
    }, emitEvent.ms)
    if (expected) {
      await t.notThrowsAsync(promise)
    } else {
      await t.throwsAsync(promise, {
        message: `Timed out waiting for "${waitEvent.name}" event.`,
      })
    }
  },
  title: titleFn('event timeout'),
})
for (const [title, ...data] of [
  [
    'the one fired before timeout',
    { name: 'end', ms: 50 },
    { name: 'end', ms: 2 },
    true,
  ],
  [
    'the one fired after timeout',
    { name: 'end', ms: 50 },
    { name: 'end', ms: 60 },
    false,
  ],
  [
    'the another fired before timeout',
    { name: 'end', ms: 50 },
    { name: 'change', ms: 2 },
    false,
  ],
  [
    'the another fired after timeout',
    { name: 'end', ms: 50 },
    { name: 'change', ms: 60 },
    false,
  ],
  ['timeout = 0', { name: 'end', ms: 0 }, { name: 'end', ms: 0 }, false],
  ['timeout < 0', { name: 'end', ms: -2 }, { name: 'end', ms: 0 }, false],
])
  test(title as string, eventTimeoutMacro, ...data)
