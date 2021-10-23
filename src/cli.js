#!/usr/bin/env -S node --experimental-specifier-resolution=node

import { fork, spawn } from 'child_process'
import { pipeline } from 'stream'

import es from 'event-stream'
import tapMerge from 'tap-merge'
import tapNyan from 'tap-nyan'
import yargs from 'yargs'

import { wait } from './wait'


const { argv } = yargs(process.argv.slice(2))
  .locale('en')
  .option('producer', {
    alias: 'p',
    demandOption: true,
    describe: 'Executable of TAP stream producer. Could be used more than one time.',
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
  .option('tap', {
    alias: 't',
    demandOption: false,
    describe: 'Produce TAP output instead of nyan cat animation.',
    boolean: true,
    nargs: 0,
  })

const spawnOptions = {
  stdio: ['ignore', 'pipe', 'pipe'],
}
const tasks = argv.producer
  .map(cmd => cmd.split(' '))
  .map(([cmd, ...args]) => spawn(cmd, args, spawnOptions))

const sources = [
  es.merge(tasks.map(proc => proc.stdout)),
  tapMerge(),
]

if (!argv.tap) sources.push(tapNyan())
pipeline(
  [
    ...sources,
    process.stdout
  ],
  () => {},
)

if (!argv.silence) {
  const controller = new AbortController()
  const audio = fork('./src/audio.js', [argv.audio], {
    signal: controller.signal,
  })
  audio.on('error', (err) => {
    if (err.code !== 'ABORT_ERR') console.error(err)
  })
  await wait(tasks)
  controller.abort()
}

