const pon = require('pon')
const { env, mocha } = require('pon-task-basic')

let TestEnv = {}
try {
  TestEnv = require('./TestEnv.json')
} catch (e) {
  // Ignore
}

module.exports = pon({
  'env:test': env('test', TestEnv),
  'test': [
    'env:test',
    mocha('test/Store.test.js')
  ]
})
