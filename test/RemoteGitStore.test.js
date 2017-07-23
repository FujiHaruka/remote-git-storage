const RemoteGitStorage = require('../lib')
const { ok } = require('assert')
const {
  GITHUB_OWNER,
  GITHUB_REPO,
  GITHUB_TOKEN
} = process.env

describe('RemoteGitStorage', function () {
  this.timeout(30000)
  const owner = GITHUB_OWNER
  const repo = GITHUB_REPO
  const token = GITHUB_TOKEN

  it('do', async () => {
    const storage = RemoteGitStorage({
      owner,
      repo,
      token,
      commonKey: 'password1234'
    })
    const Memo = await storage.ref('test/memo')
    ok(Memo)
  })
})

/* global describe it */
