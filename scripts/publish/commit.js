const execCommit = require('child_process').execSync

const minorMessage = process.argv[process.argv.length - 1]

const checkCommitMessage = () => {
  if (!minorMessage) throw Error('No commit message! aborting.')
  return ''
}

execCommit(`${checkCommitMessage()} git commit -m "${minorMessage}"`, {
  stdio: [0, 1, 2],
})

module.exports = execCommit
