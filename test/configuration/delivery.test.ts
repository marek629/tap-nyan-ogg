import test from 'ava'
import { stub, SinonStub } from 'sinon'

import {
  clearCache,
  deliver,
  external,
} from '../../src/configuration/delivery.js'
import { titleFn } from '../utils.js'

external.deliverConfiguration = () => ({} as any)
test.beforeEach(() => {
  clearCache()
})

const lfo = {
  base: { sampling: 44_100, frequency: 12 },
  modified: { sampling: 44_100, frequency: 20 },
}
const selector = {
  lfo: {
    base: () => lfo.base,
    modified: () => lfo.modified,
  },
  yes: () => true,
  no: () => false,
}
const factory = stub().returnsArg(0)

type DeliverParameters = Parameters<typeof deliver>
type DeliverBahaviour = {
  result: any
  created: boolean
}
// @ts-ignore
const deliverMacro = test.macro({
  // @ts-ignore
  exec: async (
    t,
    parameters: DeliverParameters[],
    expected: DeliverBahaviour[],
  ) => {
    t.is(
      parameters.length,
      expected.length,
      'Number of inputs should be equal to the number of expected interactions!',
    )
    for (let index = 0; index < parameters.length; index++) {
      const input = parameters[index]
      const factory = input[2] as SinonStub
      factory.resetHistory()
      const { result, created } = expected[index]
      t.deepEqual(await deliver(...input), result)
      t.is(factory.called, created)
    }
  },
  title: titleFn('deliver', ''),
})
for (const [title, ...data] of [
  [
    'fresh created primitive',
    [['enabled', selector.yes, factory]] as DeliverParameters[],
    [{ result: true, created: true }] as DeliverBahaviour[],
  ],
  [
    'once created primitive',
    [
      ['enabled', selector.yes, factory],
      ['enabled', selector.yes, factory],
    ] as DeliverParameters[],
    [
      { result: true, created: true },
      { result: true, created: false },
    ] as DeliverBahaviour[],
  ],
  [
    'once created primitive and recreated',
    [
      ['enabled', selector.yes, factory],
      ['enabled', selector.yes, factory],
      ['enabled', selector.no, factory],
      ['enabled', selector.no, factory],
    ] as DeliverParameters[],
    [
      { result: true, created: true },
      { result: true, created: false },
      { result: false, created: true },
      { result: false, created: false },
    ] as DeliverBahaviour[],
  ],
  [
    'fresh created object',
    [['LFO', selector.lfo.base, factory]] as DeliverParameters[],
    [{ result: lfo.base, created: true }] as DeliverBahaviour[],
  ],
  [
    'once created object',
    [
      ['LFO', selector.lfo.base, factory],
      ['LFO', selector.lfo.base, factory],
    ] as DeliverParameters[],
    [
      { result: lfo.base, created: true },
      { result: lfo.base, created: false },
    ] as DeliverBahaviour[],
  ],
  [
    'once created object and then recreated',
    [
      ['LFO', selector.lfo.base, factory],
      ['LFO', selector.lfo.base, factory],
      ['LFO', selector.lfo.modified, factory],
      ['LFO', selector.lfo.modified, factory],
    ] as DeliverParameters[],
    [
      { result: lfo.base, created: true },
      { result: lfo.base, created: false },
      { result: lfo.modified, created: true },
      { result: lfo.modified, created: false },
    ] as DeliverBahaviour[],
  ],
  [
    'once created two values called alternately',
    [
      ['LFO', selector.lfo.base, factory],
      ['enabled', selector.yes, factory],
      ['LFO', selector.lfo.base, factory],
      ['enabled', selector.yes, factory],
    ] as DeliverParameters[],
    [
      { result: lfo.base, created: true },
      { result: true, created: true },
      { result: lfo.base, created: false },
      { result: true, created: false },
    ] as DeliverBahaviour[],
  ],
])
  test.serial(title as string, deliverMacro, ...data)
