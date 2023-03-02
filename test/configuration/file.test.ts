import test, { ExecutionContext } from 'ava'
import { SinonSpy, spy, stub } from 'sinon'
import YAML from 'yaml'

import { assembleConfiguration, ConfigurationShape, external, readFile } from '../../src/configuration/file.js'
import { titleFn } from '../utils.js'


const settings = {
  effect: {
    echo: {
      enabled: true,
      size: 8_000,
      gain: 0.85,
    },
    tremolo: {
      enabled: true,
      lfo: {
        frequency: 33,
        sampling: 8_000,
      },
    },
  },
}
const noop = () => ({})
type AssemblerParameters = Parameters<typeof assembleConfiguration>
type FileFn = AssemblerParameters[0]
type StateFn = AssemblerParameters[1]
const assembleConfigurationMacro = test.macro({
  exec: async (t: ExecutionContext, readFile: FileFn, getState: StateFn, expected: ConfigurationShape) => {
    t.deepEqual(await assembleConfiguration(readFile, getState), expected)
  },
  title: titleFn('assembleConfiguration', 'should'),
})
for (const [title, ...data] of [
  [
    'return clean defaults on clean system',
    noop as FileFn,
    noop as StateFn,
    settings,
  ],
  [
    'modify default subtree given from file',
    () => ({
      effect: {
        echo: {
          enabled: false,
          size: 3,
          gain: 1.12,
        },
      }
    }),
    noop as StateFn,
    {
      effect: {
        echo: {
          enabled: false,
          size: 3,
          gain: 1.12,
        },
        tremolo: {
          enabled: true,
          lfo: {
            frequency: 33,
            sampling: 8_000,
          },
        },
      },
    },
  ],
  [
    'modify part of default subtree given from file',
    () => ({
      effect: {
        echo: {
          size: 3,
        },
      }
    }),
    noop as StateFn,
    {
      effect: {
        echo: {
          enabled: true,
          size: 3,
          gain: 0.85,
        },
        tremolo: {
          enabled: true,
          lfo: {
            frequency: 33,
            sampling: 8_000,
          },
        },
      },
    },
  ],
  [
    'inject another subtree from state',
    noop as FileFn,
    () => ({
      format: {
        channels: 2,
        sampleRate: 8_000,
      },
    }),
    {
      effect: {
        echo: {
          enabled: true,
          size: 8_000,
          gain: 0.85,
        },
        tremolo: {
          enabled: true,
          lfo: {
            frequency: 33,
            sampling: 8_000,
          },
        },
      },
      format: {
        channels: 2,
        sampleRate: 8_000,
      },
    },
  ],
  [
    'modify part of default subtree given from file and inject another subtree from state',
    () => ({
      effect: {
        tremolo: {
          lfo: {
            frequency: 11,
          },
        },
      }
    }),
    () => ({
      format: {
        channels: 2,
        sampleRate: 8_000,
      },
    }),
    {
      effect: {
        echo: {
          enabled: true,
          size: 8_000,
          gain: 0.85,
        },
        tremolo: {
          enabled: true,
          lfo: {
            frequency: 11,
            sampling: 8_000,
          },
        },
      },
      format: {
        channels: 2,
        sampleRate: 8_000,
      },
    },
  ],
]) test(title as string, assembleConfigurationMacro, ...data)

const config = {
  echoOnly: {
    effect: {
      echo: {
        enabled: true,
        size: 8_000,
        gain: 0.85,
      },
    },
  },
  complex: settings,
}
const error = {
  any: new Error('fake not file exists error'),
  enoent: new Error('fake not file exists error'),
}
// @ts-ignore
error.enoent.code = 'ENOENT'
const readFileMacro = test.macro({
  exec: async (t: ExecutionContext, contents: string | Error, exited?: number, expected?: ConfigurationShape) => {
    external.exit = spy() as any
    external.readFile = typeof contents === 'string' ? stub().resolves(contents) : stub().rejects(contents)
    
    const result = await readFile()

    if (Number.isFinite(exited)) {
      const exit: SinonSpy = external.exit as any
      t.true(exit.calledOnceWith(exited))
    }
    else {
      t.deepEqual(result, expected)
    }
  },
  title: titleFn('readFile', 'should')
})
for (const [title, ...data] of [
  [
    'return empty object on read empty file',
    '',
    null,
    {},
  ],
  [
    'return 1 effect object if 1 effect was configured',
    YAML.stringify(config.echoOnly),
    null,
    config.echoOnly,
  ],
  [
    'return so object as complex effects ware configured',
    YAML.stringify(config.complex),
    null,
    config.complex,
  ],
  [
    'exit if read throws ENOENT error',
    error.enoent,
    4,
    null,
  ],
  [
    'return empty object if read throws an error',
    error.any,
    null,
    {},
  ],
]) test(title as string, readFileMacro, ...data)
