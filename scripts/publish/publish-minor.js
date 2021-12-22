const execPublishMinor = require('child_process').execSync

execPublishMinor(`npm version minor && npm publish`, { stdio: [0, 1, 2] })

module.exports = execPublishMinor
