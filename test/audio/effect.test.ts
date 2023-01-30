import test, { ExecutionContext } from 'ava'

import { EchoEffect } from '../../src/audio/echo.js'

import { titleFn } from '../utils.js'


class TestEffect extends EchoEffect {
  public previousSample = 0

  public sampleMapper(sample: number): number {
    const previous = this.previousSample
    this.previousSample = sample
    return this.mix(previous, sample)
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
