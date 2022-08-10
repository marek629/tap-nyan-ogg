export const titleFn = title => (providedTitle = '') => {
  if (providedTitle) return `${title} | ${providedTitle}`
  return title
}