#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises'
import { resolve } from 'path'

import { dirname } from 'dirname-filename-esm'
import { pipe } from 'ramda'


const fixShebang = str => {
  const regex = /^#!\/usr\/bin\/env -S node (--[\w\-=.\/]+\s?)+/
  const subst = `#!/usr/bin/env node\n\n`
  return str.replace(regex, subst)
}

const fix = async file => {
  const path = resolve(dirname(import.meta), file)
  const plan = pipe(fixShebang)

  const content = await readFile(path, 'utf8')
  await writeFile(path, plan(content))
}


for await (const path of process.argv.slice(2)) {
  console.log(path)
  await fix(path)
}
