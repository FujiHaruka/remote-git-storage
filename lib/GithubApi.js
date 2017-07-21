const request = require('request-promise')
const base64 = require('base-64')
const BASE_URL = 'https://api.github.com'
const CONTENT_PATH = '/repos/:owner/:repo/contents/:path'

const makeUrl = (params) => Object.keys(params).reduce(
  (path, name) => path.replace(`:${name}`, params[name]),
  BASE_URL + CONTENT_PATH
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
      token,
      name = 'remote-git-store',
      email = 'remote-git-store'
    } = setting
    const s = this
    s.owner = owner
    s.repo = repo
    s.token = token
    s.name = name
    s.email = email
    s.committer = { name, email }
    s.headers = {
      'User-Agent': 'remote-git-store',
      Authorization: `token ${token}`
    }
  }

  async get ({ path }) {
    const s = this
    const url = s._makeUrl(path)
    const res = await s._tryRequest(url, 'GET', {
      path
    })
    return res
  }

  async create ({ path, content }) {
    const s = this
    const { committer } = s
    const url = s._makeUrl(path)
    const res = await s._tryRequest(url, 'PUT', {
      committer,
      path,
      message: 'Create a file',
      content: base64.encode(content)
    })
    return res
  }

  async update ({ path, content }) {
    const s = this
    const { committer } = s
    const url = s._makeUrl(path)
    const { sha, err } = await s.get({ path })
    if (err) {
      return { err }
    }
    const res = await s._tryRequest(url, 'PUT', {
      committer,
      path,
      message: 'Update a file',
      content: base64.encode(content),
      sha
    })
    return res
  }

  async delete ({ path }) {
    const s = this
    const { committer } = s
    const url = s._makeUrl(path)
    const { sha, err } = await s.get({ path })
    if (err) {
      return { err }
    }
    const res = await s._tryRequest(url, 'DELETE', {
      committer,
      path,
      message: 'Delete a file',
      sha
    })
    return res
  }

  async _tryRequest (url, method, body) {
    const {
      headers
    } = this
    const res = await tryRequest({
      url,
      method,
      headers,
      json: true,
      body
    })
    return res
  }

  _makeUrl (path) {
    const { owner, repo } = this
    return makeUrl({ owner, repo, path })
  }
}

module.exports = GithubApi
