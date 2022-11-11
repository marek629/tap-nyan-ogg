#!/usr/bin/env -S node --experimental-specifier-resolution=node
import { readFile, writeFile } from 'fs/promises'
import { resolve } from 'path'

import { dirname } from 'dirname-filename-esm'
import { pipe } from 'ramda'


const addImports = str => {
  const regex = /^(import [\w$]+ from ['"]\w+['"];?)\n{2,}/m
  const subst = `$1\n\nimport { filename } from 'dirname-filename-esm'\n\n\n\n`
  return str.replace(regex, subst)
}

const fixPath = str => {
  const regex = /^\s{4}url: \"file:\/\/((\/[\w.]+)+)+\"$/mg
  const subst = `    url: \"file://\" + filename(import.meta)`
  return str.replace(regex, subst)
}


const fix = async file => {
  const path = resolve(dirname(import.meta), file)
  const plan = pipe(addImports, fixPath)

  const content = await readFile(path, 'utf8')
  await writeFile(path, plan(content))
}


for await (const path of process.argv.slice(2)) {
  console.log(path)
  await fix(path)
}
