const fs = require('fs')
const path = require('path')
const cp = require('child_process')
const { performance } = require('perf_hooks')

const npmCmd = process.platform.startsWith('win') ? 'npm.cmd' : 'npm'
const subprojects = ['Engine', 'Server', 'Client', 'Demo']

for(const proj of subprojects) {
  if(!fs.existsSync(path.join(proj, 'package.json'))) {
    throw new Error(`Subproject ${proj} is missing package.json`)
  }


  console.log(`Building ${proj}...`)
  cp.execSync(`${npmCmd} run -s build`, {
    env: process.env,
    cwd: path.resolve(proj)
  })
}

console.log(`Finished building all subprojects in ${performance.now().toFixed(2)}ms.`)
