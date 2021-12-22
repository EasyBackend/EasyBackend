const path = require('path')

const execGitAdd = require('child_process').execSync

const getPath = () => `${path.resolve('./')}/`

execGitAdd(`git add ${getPath()}`, { stdio: [0, 1, 2] })

module.exports = execGitAdd
