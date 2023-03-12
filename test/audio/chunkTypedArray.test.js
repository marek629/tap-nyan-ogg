import test from 'ava'

import { chunkTypedArray } from '../../src/audio/chunkTypedArray.js'
import { expectedTitleFn } from '../utils.js'

const typeMacro = test.macro({
  exec: (t, format, expected) => {
    t.is(chunkTypedArray(format), expected)
  },
  title: expectedTitleFn('TypedArray class for given format'),
})
for (const data of [
  [
    {
      bitDepth: 32,
      float: true,
      signed: true,
    },
    Float32Array,
  ],
  [
    {
      bitDepth: 64,
      float: true,
      signed: true,
    },
    Float64Array,
  ],
  [
    {
      bitDepth: 8,
      float: false,
      signed: true,
    },
    Int8Array,
  ],
  [
    {
      bitDepth: 16,
      float: false,
      signed: true,
    },
    Int16Array,
  ],
  [
    {
      bitDepth: 32,
      float: false,
      signed: true,
    },
    Int32Array,
  ],
  [
    {
      bitDepth: 64,
      float: false,
      signed: true,
    },
    BigInt64Array,
  ],
  [
    {
      bitDepth: 8,
      float: false,
      signed: false,
    },
    Uint8Array,
  ],
  [
    {
      bitDepth: 16,
      float: false,
      signed: false,
    },
    Uint16Array,
  ],
  [
    {
      bitDepth: 32,
      float: false,
      signed: false,
    },
    Uint32Array,
  ],
  [
    {
      bitDepth: 64,
      float: false,
      signed: false,
    },
    BigUint64Array,
  ],
])
  test(typeMacro, ...data)

const errorMacro = test.macro({
  exec: (t, format, expected) => {
    t.throws(() => chunkTypedArray(format), {
      instanceOf: Error,
      message: expected,
    })
  },
  title: expectedTitleFn('throws Error for given format'),
})
for (const data of [
  [
    {
      bitDepth: 100,
      float: true,
      signed: true,
    },
    'Unsupported float bit depth!',
  ],
  [
    {
      bitDepth: 100,
      float: false,
      signed: true,
    },
    'Unsupported signed integer bit depth!',
  ],
  [
    {
      bitDepth: 100,
      float: false,
      signed: false,
    },
    'Unsupported unsigned integer bit depth!',
  ],
])
  test(errorMacro, ...data)
