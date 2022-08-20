import test from 'ava'

import {
  LowFrequencyOscilator,
  radianFromSampleNumber,
} from '../../src/audio/LowFrequencyOscilator'

import { titleFn } from '../utils'


const radianMacro = test.macro({
  exec: (t, sampling, frequency, n, expected) => {
    const radian = radianFromSampleNumber({ sampling, frequency, number: n })
    t.is(typeof radian, typeof expected)
    t.is(radian.toFixed(10), expected.toFixed(10))
  },
  title: titleFn('radian from sample number')
})
for (const [title, ...data] of [
  [
    '0',
    60, 5, 0,
    0,
  ],
  [
    'π / 6',
    60, 5, 1,
    Math.PI / 6,
  ],
  [
    'π / 2',
    60, 5, 3,
    Math.PI / 2,
  ],
  [
    'π',
    60, 5, 6,
    Math.PI,
  ],
  [
    '3π / 2',
    60, 5, 9,
    1.5 * Math.PI,
  ],
  [
    '11π / 6',
    60, 5, 11,
    (2-1/6) * Math.PI,
  ],
  [
    '2π',
    60, 5, 12,
    2 * Math.PI,
  ],
]) test(title, radianMacro, ...data)

const sineMacro = test.macro({
  exec: (t, lfo, n, expected) => {
    const value = lfo.at(n)
    t.is(typeof value, typeof expected)
    let fixed = value.toFixed(10)
    if (expected === 0 && fixed.startsWith('-0.')) {
      fixed = fixed.replace('-', '')
    }
    t.is(fixed, expected.toFixed(10))
  },
  title: titleFn('sinewave value', 'for')
})
const lfo = new LowFrequencyOscilator({
  sampling: 60,
  frequency: 5,
})
for (const [title, ...data] of [
  [
    '0',
    lfo, 0,
    0,
  ],
  [
    'π / 6',
    lfo, 1,
    0.5,
  ],
  [
    'π / 2',
    lfo, 3,
    1,
  ],
  [
    'π',
    lfo, 6,
    0,
  ],
  [
    '3π / 2',
    lfo, 9,
    -1,
  ],
  [
    '11π / 6',
    lfo, 11,
    -0.5,
  ],
  [
    '2π',
    lfo, 12,
    0,
  ],
]) test(title, sineMacro, ...data)
