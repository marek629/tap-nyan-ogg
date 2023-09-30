import { stderr } from 'process'
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
  #endRegex = /^\d+\.\.\d+$/im
  #buffer = ''

  constructor(options = {}) {
    super(options)
  }

  get isValid() {
    return !this.#errorOccured
  }

  _transform(chunk, encoding, callback) {
    const str = this._string(chunk)
    if (str.trim().length > 0) this.emit('start')
    if (this.#errorRegex.test(str)) {
      const oldFlag = this.#errorOccured
      this.#errorOccured = true
      if (this.#errorOccured !== oldFlag) this.emit('changed')
    }
    if (this.#endRegex.test(str)) this.emit('end')
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
    return (this.#buffer += str.slice(0))
  }
}
