import { PassThrough } from 'stream'


export class TapObserver extends PassThrough {
  #errorOccured = false
  #errorRegex = /^\s*not ok \d+ - /im
  #buffer = ''

  constructor(options) {
    super(options)
  }

  get isValid() {
    return !this.#errorOccured
  }

  _transform(chunk, encoding, callback) {
    if (this.#errorRegex.test(this._string(chunk))) this.#errorOccured = true
    super._transform(chunk, encoding, callback)
  }

  _string(chunk) {
    const str = chunk.toString()
    const lastBreakLineIndex = str.lastIndexOf('\n')
    const lines = this.#buffer + str.split(0, lastBreakLineIndex)
    this.#buffer = str.split(lastBreakLineIndex)
    return lines
  }
}
