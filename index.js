const fs = require('fs')
const path = require('path')
const cp = require('child_process')

const npmCmd = process.platform.startsWith('win') ? 'npm.cmd' : 'npm'

if(!fs.existsSync(path.resolve('Server', 'build', 'index.js'))) {
  console.log('Building all subprojects before starting server...')
  cp.execSync('npm run -s build --workspaces')
}

cp.spawn(npmCmd, ['run', '-s', 'start'], {
  cwd: path.resolve('./Server'),
  stdio: 'inherit'
})
