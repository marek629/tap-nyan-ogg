import { PassThrough } from 'stream'

export type TapObserverState = {
  isValid: boolean
}
export const observerDummyState: TapObserverState = Object.freeze({
  isValid: true,
})

export class TapObserver extends PassThrough implements TapObserverState {
  #errorOccured = false
  #errorRegex = /^\s*not ok \d+ - /im
  #buffer = ''

  constructor(options = {}) {
    super(options)
  }

  get isValid() {
    return !this.#errorOccured
  }

  _transform(chunk, encoding, callback) {
    if (this.#errorRegex.test(this._string(chunk))) {
      const oldFlag = this.#errorOccured
      this.#errorOccured = true
      if (this.#errorOccured !== oldFlag) this.emit('changed')
    }
    super._transform(chunk, encoding, callback)
  }

  private _string(chunk) {
    const str = chunk.toString()
    const lastBreakLineIndex = str.lastIndexOf('\n')
    if (lastBreakLineIndex >= 0) {
      const lines = this.#buffer + str.slice(0, lastBreakLineIndex)
      this.#buffer = str.slice(lastBreakLineIndex)
      return lines
    } 
    return this.#buffer += str.slice(0)
  }
}
