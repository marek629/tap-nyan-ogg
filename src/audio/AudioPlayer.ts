import assert from 'assert'
import { ChildProcess, fork } from 'child_process'
import { resolve } from 'path'
import { dirname } from 'dirname-filename-esm'

import { TapObserver } from '../tap'
import { connectObserverToAudio } from '../utils/ipc.js'

export class AudioPlayer {
  readonly #process: ChildProcess

  public constructor(
    filePath: string,
    volume: number,
    abortSignal: AbortSignal,
  ) {
    if (!Number.isSafeInteger(volume)) return
    const paths = [dirname(import.meta)]
    if (!paths[0].endsWith('/audio')) paths.push('audio')
    paths.push('play.js')
    this.#process = fork(resolve(...paths), [filePath, `${volume}`], {
      env: {
        ...process.env,
        isAudioProcess: 'true',
      },
      signal: abortSignal,
    })
    this.#process.on('error', this.onError)
  }

  private onError(err: Error) {
    const { code } = err as any
    if (code !== 'ABORT_ERR') console.error(err)
    if (code === 'ENOENT') process.exit(8)
  }

  public connect(observer: TapObserver) {
    assert(
      this.#process instanceof ChildProcess,
      `${this.#process} process should be ChildProcess instance`,
    )
    connectObserverToAudio(observer, this.#process)
  }
}
