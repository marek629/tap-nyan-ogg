import { VorbisFormat } from '../audio/formatPipeline.js'

const store = {
  format: {
    sampleRate: 44_100,
  } as VorbisFormat,
}
export type StateShape = typeof store

export const updateConfiguration = (state: Record<string, object>) => {
  for (const key in state) {
    store[key] = state[key]
  }
}

export const getState = () => store
