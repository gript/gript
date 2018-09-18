const execa = require('execa')
const getStream = require('get-stream')
const inquirer = require('inquirer')
const chalk = require('chalk')
const globby = require('globby')
const { scripts } = require('./configurations')
// TODO: start script -> load configurations -> load scripts -> check updates -> ask if update -> update or exit -> updated and push inform

let scriptsCache = []

const getExistScriptDirectories = async () => {
  scriptsCache = await globby('scripts/*/', ['!README*'])
  return scriptsCache
}

const existScipt = async name => {
  if (!scriptsCache.length) {
    const locals = await getExistScriptDirectories()
    return locals.includes(name)
  }
  return scriptsCache.includes(name)
}

const generateSingle = async ({ type, url, name }) =>
  chalk.blue(type) + ': ' + chalk.grey(url) + chalk.blue(' LOCAL:') + (await existScipt(name) ? chalk.green('Y') : chalk.red('N')) + '\n'

const generateLoadingMsg = async ([curr, ...rest]) => rest.length
  ? `${await generateSingle(curr)}${await generateLoadingMsg(rest)}`
  : `${await generateSingle(curr)}`

const gitCloneRepo = async ([{ url, name }, ...others]) => {
  const stream = execa.shell(`git clone --depth 1 --single-branch ${url} ${name}`, { cwd: 'scripts' }).stdout
  console.log(await getStream(stream))
  if (others.length) await gitCloneRepo(others)
}

const main = async () => {
  const { shouldUpdate } = await inquirer.prompt([{
    name: 'shouldUpdate',
    type: 'confirm',
    message: chalk.blue('Loading configurations & local scripts...\n') + await generateLoadingMsg(scripts) + `Update scripts?`
  }])

  if (shouldUpdate) {
    await gitCloneRepo(scripts)
  }
}

main().then(ret => {
  console.log(ret)
})

