import { Transform } from 'stream'

import { observerDummyState, TapObserverState } from '../tap/TapObserver.js'


type ChunkBufferType = Float32ArrayConstructor | Float64ArrayConstructor
  | Int8ArrayConstructor | Int16ArrayConstructor | Int32ArrayConstructor | BigInt64ArrayConstructor
  | Uint8ArrayConstructor | Uint16ArrayConstructor | Uint32ArrayConstructor | BigUint64ArrayConstructor
export type EffectDependencies = {
  ChunkBuffer: ChunkBufferType
}

export type EffectConfig = {
  observer: TapObserverState
  process: NodeJS.Process
}
export type MessageShape = {
  kind: string
  value: any
}

const config = {
  observer: observerDummyState,
  process,
}

export abstract class Effect {
  protected observer: TapObserverState
  private process: NodeJS.Process

  get observerState() {
    return this.observer
  }

  constructor(cfg: EffectConfig = config) {
    this.observer = cfg.observer
    this.process = cfg.process
    this.process.on('message', ({ kind, value }: MessageShape) => {
      switch (kind) {
        case 'tap-stream-observer-state':
          this.observer = JSON.parse(value)
          break
        default:
          break
      }
    })
  }

  protected mix(a: number, b: number): number {
    return a + b - a*b;
  }

  effect({
    ChunkBuffer,
  }: EffectDependencies) {
    return new Transform({
      transform: (chunk, encoding, callback) => {
        if (this.observer.isValid) {
          callback(null, chunk)
          return
        }
        const array = new ChunkBuffer(chunk.buffer) as Uint8Array
        callback(null, new Uint8Array(array.map(this.sampleMapper.bind(this)).buffer))
      }
    })
  }
  protected abstract sampleMapper(input: number): number
}
