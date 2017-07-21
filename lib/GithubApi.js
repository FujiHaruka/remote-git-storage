const request = require('request-promise')
const base64 = require('base-64')
const BASE_URL = 'https://api.github.com'

const Method = {
  Create: {
    METHOD: 'PUT',
    PATH: '/repos/:owner/:repo/contents/:path',
    MESSAGE: 'Create file'
  }
}

const makeUrl = (pathString, params) => Object.keys(params).reduce(
  (path, name) => path.replace(`:${name}`, params[name]),
  BASE_URL + pathString
)

const tryRequest = async (arg) => {
  try {
    const res = await request(arg)
    return res
  } catch (e) {
    return {
      err: {
        statusCode: e.statusCode,
        message: e.error.message
      }
    }
  }
}

class GithubApi {
  constructor (setting) {
    const {
      owner,
      repo,
      token
    } = setting
    const s = this
    s.owner = owner
    s.repo = repo
    s.token = token
    s.headers = {
      'User-Agent': 'remote-git-store',
      Authorization: `token ${token}`
    }
  }

  async create ({ path, content }) {
    const s = this
    const {
      owner,
      repo,
      headers
    } = s
    const {
      METHOD,
      MESSAGE,
      PATH
    } = Method.Create
    const url = makeUrl(PATH, { owner, repo, path })
    const res = await tryRequest({
      method: METHOD,
      url,
      headers,
      json: true,
      body: {
        path,
        message: MESSAGE,
        content: base64.encode(content)
      }
    })
    return res
  }
}

module.exports = GithubApi
