import { createReadStream } from 'fs'
import { stat } from 'fs/promises'
import { Transform } from 'stream'
import path from 'path'
import { argv, cwd } from 'process'

import ogg from '@suldashi/ogg'
import { dirname } from 'dirname-filename-esm'
import Speaker from 'speaker'
import vorbis from 'vorbis'

import { observerDummyState } from '../tap'
import { LowFrequencyOscilator } from './LowFrequencyOscilator'
import { chunkTypedArray } from './chunkTypedArray'


const config = {
  observer: observerDummyState,
}
process.on('message', ({ kind, value }) => {
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

function play(file) {
  const decoder = new ogg.Decoder()
  decoder.on('stream', stream => {
    const vd = new vorbis.Decoder()
    vd.on('format', format => {
      const ChunkBuffer = chunkTypedArray(format)
      const lfo = new LowFrequencyOscilator({
        sampling: format.sampleRate,
        frequency: 3,
      })
      vd
        .pipe(tremolo({ ChunkBuffer, lfo }))
        .pipe(new Speaker(format))
    })
    stream.pipe(vd)
  
    stream.on('end', () => {
      play(file)
    })
  })
  decoder.on('error', err => {
    console.log({err})
  })
  decoder.on('close', () => {
    console.log('on close')
  })

  createReadStream(file).pipe(decoder)
}

const filePath = async file => {
  if (file && file !== 'undefined') {
    const fp = path.resolve(cwd(), file)
    const info = await stat(fp)
    if (info.isFile()) return fp
  }
  return path.resolve(
    dirname(import.meta),
    '../sound/nyan.ogg',
  )
}

play(await filePath(argv[2]))
