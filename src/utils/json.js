export const propertiesNamesReplacer = obj => Object.entries(
  Object.getOwnPropertyDescriptors(obj.__proto__)
)
  .filter(([name, item]) => typeof item.get === 'function')
  .map(([name]) => name)
