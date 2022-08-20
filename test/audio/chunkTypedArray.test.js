import test from 'ava'

import { chunkTypedArray } from '../../src/audio/chunkTypedArray'
import { expectedTitleFn } from '../utils'


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
]) test(typeMacro, ...data)
