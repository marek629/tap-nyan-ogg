import { isDeepStrictEqual } from 'util'

import { assembleConfiguration, readFile } from './file.js'
import { getState } from './state.js'


const deliverConfiguration = () => assembleConfiguration(readFile, getState)
export const external = {
  deliverConfiguration,
}

const cache = Object.seal({
  input: new Map<string, object>(),
  result: new Map<string, object>(),
})
export const deliver = async <T>(name: string, selector: Function, factory: Function): Promise<T> => {
  const { deliverConfiguration } = external

  const config = await deliverConfiguration()
  const data = selector(config)
  if (cache.input.has(name) && isDeepStrictEqual(data, cache.input.get(name))) {
    return cache.result.get(name) as T
  }

  const value = factory(data)
  cache.input.set(name, data)
  cache.result.set(name, value)
  return value as T
}
export const clearCache = () => {
  for (const key in cache) {
    const map = cache[key] as Map<string, object>
    map.clear()
  }
}
