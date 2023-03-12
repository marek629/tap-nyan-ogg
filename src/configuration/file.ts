import EventEmitter from 'events'
import fs from 'fs/promises'
import { dirname } from 'path'
import { env, exit } from 'process'

import { mergeDeepRight } from 'ramda'
import YAML from 'yaml'

import { StateShape } from './state.js'

export const external = Object.seal({
  exit,
  readFile: fs.readFile,
})

const defaultSettings = Object.freeze({
  effect: {
    echo: {
      enabled: true,
      size: 8_000,
      gain: 0.85,
    },
    tremolo: {
      enabled: true,
      lfo: {
        frequency: 33,
        sampling: 8_000,
      },
    },
  },
})

export const fileWatcher = new EventEmitter()
const watchFile = async () => {
  const { configFilePath } = env
  if (!configFilePath) {
    console.error('wrong path from process:', process.argv)
    return
  }

  for await (const { filename } of fs.watch(dirname(configFilePath))) {
    if (filename === configFilePath) {
      fileWatcher.emit('change')
    }
  }
}
if (env.isAudioProcess) watchFile()
export const readFile = async (): Promise<ConfigurationShape> => {
  const { configFilePath } = env
  const { exit, readFile } = external

  try {
    const code = await readFile(configFilePath, 'utf-8')
    if (code.trim() === '') {
      return {} as ConfigurationShape
    }
    return YAML.parse(code) as ConfigurationShape
  } catch (e) {
    if (e.code !== 'ENOENT') {
      console.error(e)
      exit(4)
    }
    return {} as ConfigurationShape
  }
}

type DefaultShape = typeof defaultSettings
export interface ConfigurationShape extends DefaultShape, StateShape {}
export const assembleConfiguration = async (
  file: () => Promise<Partial<DefaultShape>>,
  state: () => StateShape,
): Promise<ConfigurationShape> =>
  mergeDeepRight(mergeDeepRight(defaultSettings, await file()), state())

export const getDefaultsYAML = () => YAML.stringify(defaultSettings)
