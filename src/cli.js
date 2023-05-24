#!/usr/bin/env -S node --experimental-specifier-resolution=node --loader=./submodule/loaders-test/commonjs-extension-resolution-loader/loader.js

import { fork, spawn } from 'child_process'
import { pipeline } from 'stream'
import { resolve } from 'path'

import tapNyan from '@tap-ogg/tap-nyan'
import { dirname } from 'dirname-filename-esm'
import es from 'event-stream'
import tapMerge from 'tap-merge'
import yargs from 'yargs'

import { getDefaultsYAML } from './configuration'
import { TapObserver } from './tap'
import { connectObserverToAudio } from './utils/ipc'
import { wait } from './utils/wait'

const { argv } = yargs(process.argv.slice(2))
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
  .option('producer', {
    alias: 'p',
    demandOption: false,
    describe:
      'Executable of TAP stream producer. Could be used more than one time.',
    string: true,
    array: true,
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
  .option('tap', {
    alias: 't',
    demandOption: false,
    describe: 'Produce TAP output instead of nyan cat animation.',
    boolean: true,
    nargs: 0,
  })

if (argv.defaults) {
  console.log(getDefaultsYAML())
  process.exit(0)
}
if (!Array.isArray(argv.producer) || argv.producer.length === 0) {
  console.log('Missing required argument: producer')
  process.exit(6)
}

const spawnOptions = {
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: true,
}
const tasks = argv.producer
  .map(cmd => cmd.split(' '))
  .map(([cmd, ...args]) => spawn(cmd, args, spawnOptions))

const observer = new TapObserver()
const sources = [es.merge(tasks.map(proc => proc.stdout)), tapMerge(), observer]

if (!argv.tap) sources.push(tapNyan())
pipeline([...sources, process.stdout], () => {})

const volume = parseInt(argv.volume, 10)
if (volume < 0 || volume > 100) {
  console.error(`Volume should be in range 0-100. Given value was ${volume}.`)
  process.exit(2)
}
if (!argv.silence && volume > 0) {
  // setting enviroment variable in main process
  // configFilePath would be consumed by audio process
  process.env.configFilePath = argv.config

  const controller = new AbortController()
  const audio = fork(
    resolve(dirname(import.meta), 'audio/play.js'),
    [argv.audio, volume],
    {
      env: {
        ...process.env,
        isAudioProcess: true,
      },
      signal: controller.signal,
    },
  )
  connectObserverToAudio(observer, audio)
  audio.on('error', err => {
    if (err.code !== 'ABORT_ERR') console.error(err)
  })
  await wait(tasks)
  controller.abort()
} else {
  await wait(tasks)
}

process.exit(0)
