export const wait = tasks =>
  new Promise(resolve => {
    let counter = tasks.length
    const listener = (...args) => {
      if (--counter === 0) {
        resolve(tasks)
      }
    }
    tasks.forEach(t => {
      t.once('finish', listener)
    })

    // fallback checking tasks
    const intervalId = setInterval(function () {
      if (tasks.every(t => t.exitCode !== null)) {
        clearInterval(intervalId)
        resolve(tasks)
      }
    }, 500)
  })
