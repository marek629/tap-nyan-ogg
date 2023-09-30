import EventEmitter from 'events'
import { scheduler } from 'timers/promises'

export const eventTimeout = (
  emitter: EventEmitter,
  event: string,
  timeout: number,
) => {
  const positive = new Promise(resolve => {
    emitter.once(event, resolve)
  })
  const negative = scheduler.wait(timeout).then(() => {
    return Promise.reject(new Error(`Timed out waiting for "${event}" event.`))
  })
  return Promise.race([positive, negative])
}
