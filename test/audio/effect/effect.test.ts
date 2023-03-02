import test, { ExecutionContext } from 'ava'

import { EchoEffect } from '../../../src/audio/effect/echo.js'
import { TapObserverState } from '../../../src/tap/TapObserver.js'

import { titleFn } from '../../utils.js'


class TestEffect extends EchoEffect {
  public previousSample = 0
  public enabled: boolean = false
  public observer: TapObserverState = { isValid: false }

  public sampleMapper(sample: number): number {
    const previous = this.previousSample
    this.previousSample = sample
    return this.mix(previous, sample)
  }

  public get isDisabled(): boolean {
    return super.isDisabled
  }
}

const mixMacro = test.macro({
  exec: (t: ExecutionContext, input: number[], expected: number[]) => {
    const effect = new TestEffect
    const output = input.map(value => effect.sampleMapper(value))
    t.deepEqual(output, expected)
  },
  title: titleFn('mix', ''),
})
for (const [title, ...data] of [
  [
    'should add 1 sample',
    [2],
    [2],
  ],
  [
    'should add 2 samples',
    [2, 5],
    [2, -3],
  ],
  [
    'should add 5 samples',
    [2, 5, 2, 4, 3],
    [2, -3, -3, -2, -5],
  ],
]) test(title as string, mixMacro, ...data)

const isDisabledMacro = test.macro({
  exec: (t: ExecutionContext, enabled: boolean, observerIsValid: boolean, expected: boolean) => {
    const effect = new TestEffect
    effect.enabled = enabled
    effect.observer.isValid = observerIsValid
    t.is(effect.isDisabled, expected)
  },
  title: titleFn('isDisabled', ''),
})
for (const [title, ...data] of [
  [
    'should be true when it\'s enabled and observer state is valid',
    true, true,
    true
  ],
  [
    'should be false when it\'s enabled and observer state is invalid',
    true, false,
    false,
  ],
  [
    'should be true when it\'s not enabled and observer state is valid',
    false, true,
    true
  ],
  [
    'should be true when it\'s not enabled and observer state is invalid',
    false, false,
    true
  ],
]) test(title as string, isDisabledMacro, ...data)
