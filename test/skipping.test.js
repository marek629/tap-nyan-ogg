import test from 'ava'


const pass = t => t.pass()
for (let i=0; i<200; i++) {
  test(`massive skipping ${i}`, pass)
}
