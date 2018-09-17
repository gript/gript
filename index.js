const execa = require('execa')
const inquirer = require('inquirer')
const chalk = require('chalk')
const { scripts } = require('./configurations')
// TODO: start script -> load configurations -> load scripts -> check updates -> ask if update -> update or exit -> updated and push inform

console.log(chalk.blue('Loading configurations...'))
;(async () => {
  const { shouldUpdate } = await inquirer.prompt([{
    name: 'shouldUpdate',
    type: 'confirm',
    message: `\n` + scripts.map(({ type, url }) => `${chalk.blue(type)}: ${chalk.grey(url)}\n`) + `\n` +
    `Update this dependency?`
  }])
})()
// ;(async () => {
//   const stdout = await Promise.all(Array.from(scripts).map(url => execa.shell(`git clone --depth 1 --single-branch ${url}`)))
//   console.log(stdout)
// })()
