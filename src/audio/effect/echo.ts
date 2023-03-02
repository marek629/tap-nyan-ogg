import { Queue } from '@datastructures-js/queue'

import { ConfigurationShape, deliver } from '../../configuration/index.js'

import { Effect, EffectDependencies, valueFactory } from './effect.js'


export const external = Object.seal({
  deliver,
})

type EchoConfigurationShape = ConfigurationShape['effect']['echo']
const echoSelector = ({ effect: { echo: { enabled, gain, size } } }: ConfigurationShape): EchoConfigurationShape => ({
  enabled,
  gain,
  size,
})

export class EchoEffect extends Effect {
  private gain: number
  private queue: Queue<number>

  async setup() {
    const { deliver } = external

    const { enabled, gain, size } = await deliver<EchoConfigurationShape>(
      'effect.echo',
      echoSelector,
      valueFactory,
    )
    this.enabled = enabled
    this.gain = gain
    this.queue = new Queue(new Array(size).fill(1))
  }

  protected sampleMapper(sample: number): number {
    const value = this.queue.dequeue()
    this.queue.enqueue(sample)
    return this.mix(sample, value*this.gain)
  }
}

export const echo = async (deps: EffectDependencies) => {
  const instance = new EchoEffect
  await instance.setup()
  return instance.effect(deps)
}
