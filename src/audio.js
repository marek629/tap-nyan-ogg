import { createReadStream } from 'fs'
import { stat } from 'fs/promises'
import path from 'path'
import { argv, cwd } from 'process'

import ogg from '@suldashi/ogg'
import { dirname } from 'dirname-filename-esm'
import Speaker from 'speaker'
import vorbis from 'vorbis'


function play(file) {
  const decoder = new ogg.Decoder()
  decoder.on('stream', stream => {
    const vd = new vorbis.Decoder()
    vd.on('format', format => {
      vd.pipe(new Speaker(format))
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
    'sound/nyan.ogg',
  )
}

play(await filePath(argv[2]))
