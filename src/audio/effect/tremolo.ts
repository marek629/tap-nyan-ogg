import { ConfigurationShape, deliver } from '../../configuration/index.js'

import { LowFrequencyOscilator } from './LowFrequencyOscilator.js'
import { Effect, EffectDependencies, valueFactory } from './effect.js'


export const external = Object.seal({
  deliver,
})

export const lfoSelector = ({
  effect: { tremolo:  { lfo } },
  format,
}: ConfigurationShape) => {
  if (!Object.hasOwn(lfo, 'frequency')) {
    throw new RangeError('frequency must be configured in tremolo effect')
  }
  const sampling = format?.sampleRate ?? lfo.sampling
  return { ...lfo, sampling }
}
export const lfoFactory = ({ frequency, sampling }) => new LowFrequencyOscilator({
  sampling,
  frequency,
})

export const tremoloEnabledSelector = ({
  effect: { tremolo:  { enabled } },
}: ConfigurationShape) => enabled

export class TremoloEffect extends Effect {
  private n = 0
  protected lfo: LowFrequencyOscilator

  async setup() {
    const { deliver } = external

    this.lfo = await deliver<LowFrequencyOscilator>(
       'LowFrequencyOscilator',
       lfoSelector,
       lfoFactory,
     )
     this.enabled = await deliver<boolean>(
       'effect.tremolo.enabled',
       tremoloEnabledSelector,
       valueFactory,
     )
  }

  protected sampleMapper(input: number): number {
    return this.mix(input, this.lfo.at(this.n++))
  }
}

export const tremolo = async (deps: EffectDependencies) => {
  const instance = new TremoloEffect
  await instance.setup()
  return instance.effect(deps)
}
