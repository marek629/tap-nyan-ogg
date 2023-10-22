#!/usr/bin/env -S node --experimental-specifier-resolution=node --loader=./submodule/loaders-test/commonjs-extension-resolution-loader/loader.js

import { pipeline } from 'stream'

import yargs from 'yargs'

import { AudioPlayer } from './audio'
import { getDefaultsYAML } from './configuration'
import { TapObserver } from './tap'
import { readPackageJson, eventTimeout } from './utils'

const { version } = await readPackageJson()

const { argv } = yargs(process.argv.slice(2))
  .version(version)
  .locale('en')
  .option('defaults', {
    alias: 'd',
    demandOption: false,
    describe: 'Print default configuration values',
    boolean: true,
    nargs: 0,
  })
  .option('config', {
    alias: 'c',
    demandOption: false,
    describe: 'YAML configuration file path',
    string: 'true',
    nargs: 1,
    default: 'config.yml',
  })
  .option('audio', {
    alias: 'a',
    demandOption: false,
    describe: 'Sound file path. Default is nyan cat song.',
    string: true,
    nargs: 1,
  })
  .option('silence', {
    alias: 's',
    demandOption: false,
    describe: 'Do not play any sound.',
    boolean: true,
    nargs: 0,
  })
  .option('volume', {
    alias: 'v',
    demandOption: false,
    describe: 'Set percent value of sound volume in range [0-100]',
    number: true,
    nargs: 1,
    default: 100,
  })

const volume = parseInt(argv.volume, 10)
if (volume < 0 || volume > 100) {
  console.error(`Volume should be in range 0-100. Given value was ${volume}.`)
  process.exit(2)
}

if (argv.defaults) {
  console.log(getDefaultsYAML())
  process.exit(0)
}

const observer = new TapObserver()
pipeline([process.stdin, observer, process.stdout], () => {})

try {
  await eventTimeout(observer, 'start', 250)
} catch (r) {
  console.error(
    'Empty input stream! A text stream formatted according to the Test Anything Protocol was expected.',
  )
  process.exit(5)
}

const controller = new AbortController()
observer.once('end', () => {
  controller.abort()
  process.exit(0)
})

if (!argv.silence && volume > 0) {
  // setting enviroment variable in main process
  // configFilePath would be consumed by audio process
  process.env.configFilePath = argv.config

  const player = new AudioPlayer(argv.audio, volume, controller.signal)
  player.connect(observer)
}
