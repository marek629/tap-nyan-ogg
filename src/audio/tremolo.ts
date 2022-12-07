import { Transform } from 'stream'

import { observerDummyState } from '../tap/index.js'
import { TapObserverState } from '../tap/TapObserver.js'

import { LowFrequencyOscilator } from './LowFrequencyOscilator'


export type MessageShape = {
  kind: string
  value: any
}
export type TremoloData = {
  observer: TapObserverState
  process: NodeJS.Process
}
type ChunkBufferType = Float32ArrayConstructor | Float64ArrayConstructor
  | Int8ArrayConstructor | Int16ArrayConstructor | Int32ArrayConstructor | BigInt64ArrayConstructor
  | Uint8ArrayConstructor | Uint16ArrayConstructor | Uint32ArrayConstructor | BigUint64ArrayConstructor
export type TremoloEffectDependencies = {
  ChunkBuffer: ChunkBufferType
  lfo: LowFrequencyOscilator
}

const config = {
  observer: observerDummyState,
  process,
}

export class TremoloEffect {
  #n = 0

  #observer: TapObserverState
  readonly #process: NodeJS.Process

  get observerState() {
    return this.#observer
  }

  constructor(cfg: TremoloData = config) {
    this.#observer = cfg.observer
    this.#process = cfg.process
    this.#process.on('message', ({ kind, value }: MessageShape) => {
      switch (kind) {
        case 'tap-stream-observer-state':
          this.#observer = JSON.parse(value)
          break
        default:
          break
      }
    })
  }

  effect({
    ChunkBuffer,
    lfo,
  }: TremoloEffectDependencies) {
    return new Transform({
      transform: (chunk, encoding, callback) => {
        if (this.#observer.isValid) {
          callback(null, chunk)
          return
        }
        const array = new ChunkBuffer(chunk.buffer) as Uint8Array
        callback(null, new Uint8Array(array.map(sample => sample * lfo.at(this.#n++)).buffer))
      }
    })
  }
}

export const tremolo = (deps: TremoloEffectDependencies) => {
  const instance = new TremoloEffect
  return instance.effect(deps)
}
