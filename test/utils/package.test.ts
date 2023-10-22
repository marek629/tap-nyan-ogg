import { constants } from 'fs'

import anyTest, { ExecutionContext, TestFn } from 'ava'
import {
  createSandbox,
  SinonSandbox,
  SinonStub,
  SinonStubbedInstance,
} from 'sinon'

import { external, readJson } from '../../src/utils/package.js'

import { titleFn } from '../utils.js'

interface TestContext {
  sandbox: SinonSandbox
}

const test = anyTest as TestFn<TestContext>

const stubFs = (
  sandbox: SinonSandbox,
  files: Map<string, string>,
): SinonStubbedInstance<typeof external> & SinonStub => {
  const fs = sandbox.stub(external)

  for (const [path, json] of files) {
    fs.access.withArgs(path, constants.F_OK).resolves()
    fs.readFile.withArgs(path, 'utf8').resolves(json)
  }

  fs.access.rejects()
  fs.readFile.rejects()

  return fs as any
}

test.afterEach.always(t => {
  t.context.sandbox.restore()
})

const ogg = {
  name: 'tap-ogg',
  version: '1.2.501',
}
const usage = {
  name: '@tap-ogg/usage',
  version: '1.2.41',
}

const readJsonMacro = test.macro({
  exec: async (
    t: ExecutionContext<TestContext>,
    files: Map<string, Awaited<ReturnType<typeof readJson>>>,
    expected?: Error,
  ) => {
    t.context.sandbox = createSandbox()
    const ext = stubFs(
      t.context.sandbox,
      new Map(
        Array.from(files.entries()).map(([path, json]) => [
          path,
          JSON.stringify(json),
        ]),
      ),
    )
    const { access, readFile } = ext
    external.access = access
    external.readFile = readFile

    if (expected instanceof Error) return t.throwsAsync(readJson)

    t.deepEqual(await readJson(), ogg)
  },
  title: titleFn('package.json', 'in'),
})

for (const [title, ...data] of [
  ['.', new Map([['package.json', ogg]])],
  ['..', new Map([['../package.json', ogg]])],
  ['../..', new Map([['../../package.json', ogg]])],
  ['../../..', new Map([['../../../package.json', ogg]])],
  [
    '../../../../',
    new Map([['../../../../package.json', ogg]]),
    new Error('An error is extected!'),
  ],
  [
    'node_modules/tap-ogg',
    new Map([
      ['package.json', usage],
      ['node_modules/tap-ogg/package.json', ogg],
    ]),
  ],
  [
    '../node_modules/tap-ogg',
    new Map([
      ['package.json', usage],
      ['../node_modules/tap-ogg/package.json', ogg],
    ]),
  ],
  [
    '../../node_modules/tap-ogg',
    new Map([
      ['package.json', usage],
      ['../../node_modules/tap-ogg/package.json', ogg],
    ]),
    new Error('An error is extected!'),
  ],
])
  test.serial(title as any, readJsonMacro, ...data)
