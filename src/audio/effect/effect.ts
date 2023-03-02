import EventEmitter from 'events'
import { Transform } from 'stream'

import { fileWatcher } from '../../configuration/index.js'
import { observerDummyState, TapObserverState } from '../../tap/index.js'


type ChunkBufferType = Float32ArrayConstructor | Float64ArrayConstructor
  | Int8ArrayConstructor | Int16ArrayConstructor | Int32ArrayConstructor | BigInt64ArrayConstructor
  | Uint8ArrayConstructor | Uint16ArrayConstructor | Uint32ArrayConstructor | BigUint64ArrayConstructor
export type EffectDependencies = {
  ChunkBuffer: ChunkBufferType
}

export type EffectConfig = {
  observer: TapObserverState
  process: NodeJS.Process
  watcher: EventEmitter
}
export type MessageShape = {
  kind: string
  value: any
}

const config = {
  observer: observerDummyState,
  process,
  watcher: fileWatcher,
}

export abstract class Effect {
  protected enabled: boolean
  protected observer: TapObserverState
  private watcher: EventEmitter
  private process: NodeJS.Process

  get observerState() {
    return this.observer
  }

  constructor(cfg: EffectConfig = config) {
    this.enabled = false
    this.observer = cfg.observer
    this.watcher = cfg.watcher
    this.watcher.on('change', this.setup.bind(this))
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

  abstract setup(): Promise<void>

  protected mix(a: number, b: number): number {
    return a + b - a*b;
  }

  protected get isDisabled(): boolean {
    return !this.enabled || this.observer.isValid
  }

  effect({
    ChunkBuffer,
  }: EffectDependencies) {
    return new Transform({
      transform: (chunk, encoding, callback) => {
        if (this.isDisabled) {
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

export const valueFactory = (v: any) => v
