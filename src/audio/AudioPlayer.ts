import assert from 'assert'
import { ChildProcess, fork } from 'child_process'
import { resolve } from 'path'
import { env, cwd } from 'process'

import { dirname } from 'dirname-filename-esm'

import { TapObserver } from '../tap'
import { connectObserverToAudio, readPackageJson } from '../utils/index.js'

const { name: packageName } = await readPackageJson()
const dirPath =
  env.NODE_V8_COVERAGE && env.npm_package_name === packageName
    ? 'build/src/'
    : dirname(import.meta)

export class AudioPlayer {
  readonly #process: ChildProcess

  public constructor(
    filePath: string,
    volume: number,
    abortSignal: AbortSignal,
  ) {
    if (!Number.isSafeInteger(volume)) return
    this.#process = fork(this.modulePath, [filePath, `${volume}`], {
      env: {
        ...process.env,
        PWD: resolve(this.modulePath.split(`/${packageName}/`)[0], packageName),
        isAudioProcess: 'true',
      },
      signal: abortSignal,
    })
    this.#process.on('error', this.onError)
  }

  private get modulePath(): string {
    const paths = [
      dirPath.startsWith(`/${packageName}/`)
        ? `${
            cwd().endsWith(`/${packageName}`)
              ? ''
              : `../node_modules/${packageName}/`
          }dist/`
        : dirPath,
      'audio/play.js',
    ]
    return resolve(cwd(), ...paths)
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
