import { createReadStream } from 'fs'
import path from 'path'

import ogg from '@suldashi/ogg'
import { dirname } from 'dirname-filename-esm'
// import { parseFile } from 'music-metadata'
import Speaker from 'speaker'
import vorbis from 'vorbis'



const nyanFilePath = path.resolve(
  dirname(import.meta),
  'sound/nyan.ogg',
)

// const metadata = await parseFile(file)
// console.log({ metadata })

function playSound(signal, file=nyanFilePath) {
  if (signal.aborted === true) {
    console.log('aborted!')
    return
  }

  const decoder = new ogg.Decoder()
  decoder.on('stream', stream => {
    const vd = new vorbis.Decoder()
    vd.on('format', format => {
      console.log({ format })
      vd.pipe(new Speaker(format))
    })
    stream.pipe(vd)
  
    // stream.pipe(speaker)
    stream.on('end', () => {
      playSound(file)
    })
  })
  decoder.on('error', err => {
    console.log({err})
  })
  decoder.on('close', () => {
    console.log('on close')
  })

  if (signal.aborted === true)
    throw new Error('Operation canceled')

  signal.addEventListener('abort', () => {
    console.log('finishing...')
    decoder.end()
  }, {
    once:true,
  })

  createReadStream(file).pipe(decoder)
}
// play()

export const play = (file, signal) => playSound(signal, file)
