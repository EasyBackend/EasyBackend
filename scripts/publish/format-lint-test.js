const execFormatLintTest = require('child_process').execSync

execFormatLintTest(`npm run build && npm run format && npm run lint && npm run test`, {
  stdio: [0, 1, 2],
})

module.exports = execFormatLintTest
