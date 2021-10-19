export const wait = tasks => new Promise(resolve => {
  let counter = tasks.length
  const listener = (...args) => {
    console.log('closed', args)
    if (--counter === 0) {
      console.log('DONE')
      resolve(tasks)
    }
  }
  tasks.forEach(t => {
    t.once('close', listener)
  })
})
