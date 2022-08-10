export const titleFn = (title, conjunction = '|') => (providedTitle = '') => {
  if (providedTitle) return `${title} ${conjunction ?? '|'} ${providedTitle}`
  return title
}