import { spawn } from 'child_process'
import MultiStream from 'multistream'
import tapMerge from 'tap-merge'
import tapNyan from 'tap-nyan'
import yargs from 'yargs'


const { argv } = yargs(process.argv.slice(2))
  .locale('en')
  .option('producer', {
    alias: 'p',
    demandOption: true,
    describe: 'Executable of TAP stream producer. Could be used more than one time.',
    string: true,
    nargs: 1,
  })

// console.log(argv)
// const { producer } = argv
const streams = argv.producer
  .map(cmd => cmd.split(' '))
  .map(([cmd, ...args]) => spawn(cmd, args))
  .map(proc => proc.stdout)
new MultiStream(streams)
  .pipe(tapMerge())
  .pipe(tapNyan())
  .pipe(process.stdout)
