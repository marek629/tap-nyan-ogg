import { createReadStream } from 'fs'
import { stat } from 'fs/promises'
import { resolve } from 'path'
import { argv, cwd, env } from 'process'

import ogg from '@suldashi/ogg'
import vorbis from '@tap-ogg/vorbis'

import { formatPipeline } from './formatPipeline'

const volumeLevel = parseInt(argv[3], 10) / 100

function play(file) {
  const decoder = new ogg.Decoder()
  decoder.on('stream', stream => {
    const vd = new vorbis.Decoder()
    vd.on('format', async format => {
      await formatPipeline(vd, format, volumeLevel)
    })
    stream.pipe(vd)

    stream.on('end', () => {
      play(file)
    })
  })
  decoder.on('error', err => {
    console.log({ err })
  })
  decoder.on('close', () => {
    console.log('on close')
  })

  createReadStream(file).pipe(decoder)
}

const filePath = async file => {
  if (file && file !== 'undefined') {
    const fp = resolve(cwd(), file)
    const info = await stat(fp)
    if (info.isFile()) return fp
  }
  return resolve(env.PWD || '', 'dist/sound/nyan.ogg')
}

play(await filePath(argv[2]))
