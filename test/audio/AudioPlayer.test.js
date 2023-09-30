import test from 'ava'
import { createSandbox } from 'sinon'

import { AudioPlayer } from '../../src/audio/AudioPlayer.js'
import { titleFn } from '../utils.js'

class Player extends AudioPlayer {
  constructor({ errorSpy }) {
    super()
    this.errorSpy = errorSpy
  }

  onError(err) {
    const original = {
      error: console.error,
    }
    console.error = this.errorSpy
    super.onError(err)
    console.error = original.error
  }
}

const sandbox = createSandbox()
test.beforeEach(t => {
  t.context = {
    errorSpy: sandbox.spy(),
  }
  sandbox.stub(process, 'exit')
})
test.afterEach(() => {
  sandbox.restore()
})

const onErrorMacro = test.macro({
  exec: (t, errorCode, printed, exitCode) => {
    const player = new Player(t.context)
    player.onError({ code: errorCode })
    if (printed) {
      t.true(
        t.context.errorSpy.called,
        'should be logged using console.error() method',
      )
    }
    if (Number.isInteger(exitCode)) {
      t.true(
        process.exit.calledOnceWith(exitCode),
        `process should be exited with ${exitCode} code`,
      )
    }
    t.pass('It is OK if no assertions was performed until here')
  },
  title: titleFn('error from child process', 'should be supported:'),
})
for (const data of [
  ['ABORT_ERR', false],
  ['UNKNOWN_ERROR', true],
  ['ENOENT', true, 8],
])
  test.serial(data[0], onErrorMacro, ...data)
