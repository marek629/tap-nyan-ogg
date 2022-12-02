#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises'
import { resolve } from 'path'

import { dirname } from 'dirname-filename-esm'
import { pipe } from 'ramda'


const addImports = str => {
  const regex = /^(import \{?[\w\s$]+\}? from ['"]\w+['"];?)\n{2,}/m
  const subst = `$1\n\nimport { filename } from 'dirname-filename-esm'\n\n\n\n`
  return str.replace(regex, subst)
}

const fixPath = str => {
  const regex = /^\s{4}url: \"file:\/\/((\/[\w.]+)+)+\"$/mg
  const subst = `    url: \"file://\" + filename(import.meta)`
  return str.replace(regex, subst)
}

const fixShebang = str => {
  const regex = /^#!\/usr\/bin\/env -S node (--[\w\-=.\/]+\s?)+/
  const subst = `#!/usr/bin/env node\n\n`
  return str.replace(regex, subst)
}

const fix = async file => {
  const path = resolve(dirname(import.meta), file)
  const plan = pipe(addImports, fixPath, fixShebang)

  const content = await readFile(path, 'utf8')
  await writeFile(path, plan(content))
}


for await (const path of process.argv.slice(2)) {
  console.log(path)
  await fix(path)
}
