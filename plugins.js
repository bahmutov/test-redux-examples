const filePreprocessor = require('cypress-react-unit-test/plugins/cra-v3/file-preprocessor')

module.exports = (on, config) => {
  on('file:preprocessor', filePreprocessor(config))
  on('task', require('@cypress/code-coverage/task'))
}
