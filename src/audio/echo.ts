import { Queue } from '@datastructures-js/queue'

import { Effect, EffectConfig, EffectDependencies } from './effect.js'


export class EchoEffect extends Effect {
  #queue: Queue<number>

  constructor(cfg?: EffectConfig) {
    super(cfg)
    this.#queue = new Queue(new Array(8000).fill(1))
  }

  protected sampleMapper(sample: number): number {
    const value = this.#queue.dequeue()
    this.#queue.enqueue(sample)
    return this.mix(sample, value*0.85)
  }
}

export const echo = (deps: EffectDependencies) => {
  const instance = new EchoEffect
  return instance.effect(deps)
}
