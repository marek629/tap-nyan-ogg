import { last } from 'ramda'

export const titleFn =
  (title, conjunction = '|') =>
  (providedTitle = '') => {
    if (providedTitle) return `${title} ${conjunction ?? '|'} ${providedTitle}`
    return title
  }

export const expectedTitleFn =
  title =>
  (...args) => {
    const expected = last(args)
    return titleFn(title, 'should be')(expected.name || expected)
  }
