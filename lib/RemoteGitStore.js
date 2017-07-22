const GitHubApi = require('./GitHubApi')
const Store = require('./Store')

function RemoteGitStore (setting = {}) {
  const {
    owner,
    repo,
    token,
    commonKey = null,
    name = 'remote-git-store',
    email = 'remote-git-store',
    service = 'GitHub'
  } = setting
  // Now, support only GitHub
  if (service !== 'GitHub') {
    throw new Error(`Not support service ${service}`)
  }
  const api = new GitHubApi({ owner, repo, token, name, email })
  const store = new Store({ api: api, commonKey })
  return store
}

module.exports = RemoteGitStore
