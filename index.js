const execa = require('execa')
const scripts = require('./configurations').urls

;(async () => {
  const stdout = await Promise.all(Array.from(scripts).map(url => execa.shell(`git clone --depth 1 --single-branch ${url}`)))
  console.log(stdout)
})()
