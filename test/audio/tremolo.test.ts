import { EventEmitter } from 'events'
import { Readable, TransformCallback, Writable } from 'stream'
// @ts-ignore
import { scheduler } from 'timers/promises'

import test, { ExecutionContext } from 'ava'

import { EffectConfig, MessageShape } from '../../src/audio/effect.js'
import { tremolo, TremoloEffect } from '../../src/audio/tremolo.js'

import { titleFn } from '../utils.js'


class FakeProcess extends EventEmitter {
  send(message: any): void {
    this.emit('message', message)
  }
}
type EffectConfigurationFactory = (isValid: boolean, process?: NodeJS.Process | FakeProcess) => EffectConfiguration
const configuration: EffectConfigurationFactory = (isValid, process = new FakeProcess) => ({
  observer: { isValid },
  process: process as NodeJS.Process,
})

type CallbackParameters = Parameters<TransformCallback>
type EffectParameters = Parameters<typeof tremolo>[0]
type EffectConfiguration = EffectConfig
const tremoloMacro = test.macro({
  exec: async (
    t: ExecutionContext,
    input: Readable,
    parameters: Partial<EffectParameters>,
    config: EffectConfiguration, 
    expected: CallbackParameters,
  ) => {
    t.plan(1)
    const buffer = [];
    const tremolo = new TremoloEffect(config)

    const stream =  input
      .pipe(tremolo.effect(parameters as EffectParameters))
      .pipe(new Writable({
        write: (chunk, encoding, callback) => {
          buffer.push(...new Uint8Array(chunk.buffer));
          callback(null)
        },
      }))
    stream.once('finish', () => {
      t.deepEqual([null, buffer], expected)
    })

    await scheduler.wait(1)
  },
  title: titleFn('effect', ''),
})
const input = (array: number[]) => Readable.from([Uint8Array.from(dataset.normal)])
const dataset = Object.freeze({
  normal: [12, 20, 100, 50, 50, 10, 111, 1, 50, 103],
  nulledOdd: [1, 20, 1, 50, 1, 10, 1, 1, 1, 103],
})
const nullOdd = (i: number) => i % 2 === 0 ? 1 : 0
for (const [title, ...data] of [
  [
    'should not mutate audio stream when observer is valid',
    input(dataset.normal),
    {},
    configuration(true),
    [null, dataset.normal],
  ],
  [
    'should mutate audio stream when observer is not valid',
    input(dataset.normal),
    {
      ChunkBuffer: Uint8Array,
      lfo: { at: nullOdd },
    },
    configuration(false),
    [null, dataset.nulledOdd],
  ],
]) test(title as any, tremoloMacro, ...data)

const messageMacro = test.macro({
  exec: async (
    t: ExecutionContext,
    message: MessageShape,
    expected: EffectConfiguration,
  ) => {
    const prc = new FakeProcess
    const cfg = configuration(false, prc)
    const effect = new TremoloEffect(cfg)
    prc.send(message)

    await scheduler.wait(1)

    t.deepEqual(effect.observerState, expected.observer)
  },
  title: titleFn('effect', ''),
})
const message = (kind, value) => ({ kind: `${kind}`, value: JSON.stringify(value) }) as MessageShape
for (const [title, ...data] of [
  [
    'should mutate observer state on tap-stream-observer-state message',
    message('tap-stream-observer-state', { isValid: true }),
    configuration(true),
  ],
  [
    'should not mutate observer state on other message',
    message('any', {}),
    configuration(false),
  ],
]) test(title as any, messageMacro, ...data)
