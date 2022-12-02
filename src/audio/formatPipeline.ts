import { env } from 'process'
import { pipeline, Readable, Stream, Transform } from 'stream'
import { takeCoverage } from 'v8'

import { throttle } from 'debouncing'
import Speaker from 'speaker'

import { observerDummyState } from '../tap'
import { chunkTypedArray } from './chunkTypedArray'
import { LowFrequencyOscilator } from './LowFrequencyOscilator'


export interface VorbisFormat extends Required<Speaker.Format> {}

const volume = ({
  ChunkBuffer,
  level,
}) => new Transform({
  transform: (chunk, encoding, callback) => {
    const array = new ChunkBuffer(chunk.buffer)
    callback(null, new Uint8Array(array.map(sample => sample * level).buffer))
  },
})

const flushCoverage = throttle(takeCoverage, 120)
const coverage = env.NODE_V8_COVERAGE
  ? new Transform({
    transform: (chunk, _, callback) => {
      callback(null, chunk)
      flushCoverage()
    }
  })
  : null

const config = {
  observer: observerDummyState,
}
process.on('message', ({ kind, value }: any) => {
  switch (kind) {
    case 'tap-stream-observer-state':
      config.observer = JSON.parse(value)
      break
    default:
      break
  }
})

let n = 0
const tremolo = ({
  ChunkBuffer,
  lfo,
}) => new Transform({
  transform: (chunk, encoding, callback) => {
    const { observer } = config
    if (observer.isValid) {
      callback(null, chunk)
      return
    }
    const array = new ChunkBuffer(chunk.buffer)
    callback(null, new Uint8Array(array.map(sample => sample * lfo.at(n++)).buffer))
  }
})

export const formatPipeline = (input: Readable, format: VorbisFormat, volumeLevel: number) => {
  const ChunkBuffer = chunkTypedArray(format)
  const lfo = new LowFrequencyOscilator({
    sampling: format.sampleRate,
    frequency: 3,
  })

  const sequence: Stream[] = [input]
  if (coverage) sequence.push(coverage)
  if (volumeLevel < 1) sequence.push(volume({ ChunkBuffer, level: volumeLevel }))
  sequence.push(
    tremolo({ ChunkBuffer, lfo }),
    new Speaker(format),
  )

  return pipeline(sequence as NodeJS.ReadWriteStream[], () => {})
}
