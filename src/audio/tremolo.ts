import { Effect, EffectConfig, EffectDependencies } from './effect.js'
import { LowFrequencyOscilator } from './LowFrequencyOscilator.js'


export type TremoloEffectDependencies = EffectDependencies & {
  lfo: LowFrequencyOscilator
}

export class TremoloEffect extends Effect {
  #n = 0
  #lfo: LowFrequencyOscilator

  constructor(cfg?: EffectConfig) {
    super(cfg)
  }

  effect(deps: TremoloEffectDependencies) {
    this.#lfo = deps.lfo
    return super.effect(deps)
  }

  protected sampleMapper(input: number): number {
    return this.mix(input, this.#lfo.at(this.#n++))
  }
}

export const tremolo = (deps: TremoloEffectDependencies) => {
  const instance = new TremoloEffect
  return instance.effect(deps)
}
