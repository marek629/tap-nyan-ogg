import test, { ExecutionContext } from 'ava'
import { fake } from 'sinon'

import { EchoEffect, external } from '../../../src/audio/effect/echo.js'

import { titleFn } from '../../utils.js'


class TestEffect extends EchoEffect {
  public sampleMapper(sample: number): number {
    return super.sampleMapper(sample)
  }
}
external.deliver = fake.resolves({
  enabled: false,
  size: 8_000,
  gain: 0.85,
} as any)

const sampleMapperMacro = test.macro({
  exec: async (t: ExecutionContext, input: number[], skip: number, expected: number[]) => {
    const effect = new TestEffect
    await effect.setup()
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
    8_000 - 2,
    [5*multiplier, 6*multiplier, 0*multiplier],
  ],
  [
    'should modify given input',
    [6, 2, 0.2],
    8_000 - 3,
    [6*multiplier, 2*multiplier, 0.2*multiplier],
  ],
]) test(title as string, sampleMapperMacro, ...data)
