const pon = require('pon')
const { env, mocha, coz } = require('pon-task-basic')
const { react } = require('pon-task-web')
const { encrypt, decrypt } = require('pon-task-file-encrypt')

let TestEnv = {}
try {
  // Not public because it has access token
  TestEnv = require('./TestEnv.json')
} catch (e) {
  // Ignore
}

const { REMOTE_GIT_STORE_SECRET } = process.env

module.exports = pon({
  // --------------
  // Main Tasks
  // --------------
  'struct': [
    decrypt('TestEnv.json.enc', 'TestEnv.json', REMOTE_GIT_STORE_SECRET),
    coz([ '.*.bud' ])
  ],
  'test': [
    env('test', TestEnv),
    mocha('test/*.test.js')
  ],
  'shim': react('lib', 'shim'),
  'encrypt': encrypt('TestEnv.json', 'TestEnv.json.enc', REMOTE_GIT_STORE_SECRET),

  // ----------------
  // Aliases
  // ----------------
  't': 'test'
})
