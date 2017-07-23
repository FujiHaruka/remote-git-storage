const GitHubApi = require('./GitHubApi')
const Storage = require('./Storage')

function RemoteGitStorage (setting = {}) {
  const {
    owner,
    repo,
    token,
    commonKey = null,
    name = 'remote-git-storage',
    email = 'remote-git-storage',
    service = 'GitHub'
  } = setting
  // Now, support only GitHub
  if (service !== 'GitHub') {
    throw new Error(`Not support service ${service}`)
  }
  const api = new GitHubApi({ owner, repo, token, name, email })
  const storage = new Storage({ api: api, commonKey })
  return storage
}

module.exports = RemoteGitStorage
