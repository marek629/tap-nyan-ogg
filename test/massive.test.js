import { scheduler } from 'timers/promises'

import test from 'ava'

const pass = async t => {
  await scheduler.wait(60)
  t.pass()
}
const fail = async t => {
  await scheduler.wait(140)
  t.fail()
}
for (let i = 0; i < 2000; i++) {
  test.serial(`massive testing ${i}`, i === 106 ? fail : pass)
}
