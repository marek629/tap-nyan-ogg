import test, { ExecutionContext } from 'ava'

import { EchoEffect } from '../../src/audio/echo.js'

import { titleFn } from '../utils.js'


class TestEffect extends EchoEffect {
  public sampleMapper(sample: number): number {
    return super.sampleMapper(sample)
  }
}

const sampleMapperMacro = test.macro({
  exec: (t: ExecutionContext, input: number[], skip: number, expected: number[]) => {
    const effect = new TestEffect
    input.forEach(sample => effect.sampleMapper(sample))
    for (let i=0; i<skip; i++) effect.sampleMapper(0)

    const output = input.map(() => effect.sampleMapper(0))
    t.deepEqual(output, expected)
  },
  title: titleFn('sampleMapper', ''),
})
const multiplier = 0.85
for (const [title, ...data] of [
  [
    'should have initial queue',
    [2, 5, 6],
    0,
    [1*multiplier, 1*multiplier, 1*multiplier],
  ],
  [
    'should have queued 8000 samples initialy',
    [2, 5, 6],
    8000 - 2,
    [5*multiplier, 6*multiplier, 0*multiplier],
  ],
  [
    'should modify given input',
    [6, 2, 0.2],
    8000 - 3,
    [6*multiplier, 2*multiplier, 0.2*multiplier],
  ],
]) test(title as string, sampleMapperMacro, ...data)
