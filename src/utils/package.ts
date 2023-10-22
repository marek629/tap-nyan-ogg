import { constants } from 'fs'
import { access, readFile } from 'fs/promises'
import { join } from 'path'
import { cwd } from 'process'

export const external = Object.seal({
  access,
  readFile,
})

type PackageJson = {
  name: string
  version: string
}

export const readJson = async (): Promise<PackageJson> => {
  const { access, readFile } = external

  const parents: string[] = []
  while (parents.length < 4) {
    const path = join(...parents, 'package.json')
    try {
      await access(path, constants.F_OK)
      const pkg: PackageJson = JSON.parse(await readFile(path, 'utf8'))
      const expected = 'tap-ogg'
      if (pkg.name !== expected) {
        parents.splice(0)
        parents.push('node_modules', expected)
        continue
      }
      return pkg
    } catch {
      parents.unshift('..')
    }
  }
  throw new Error(`Could not find package.json from CWD: ${cwd()}`)
}
