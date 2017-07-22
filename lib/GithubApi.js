const assert = require('assert')
const request = require('request-promise')
const base64 = require('base-64')
const utf8 = require('utf8')
const BASE_URL = 'https://api.github.com'
const CONTENT_PATH = '/repos/:owner/:repo/contents/:path'

const ok = (...args) => args.map((arg) => assert.ok(arg))

const encode = (text) => base64.encode(utf8.encode(text))
const decode = (encoded) => utf8.decode(base64.decode(encoded))

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
    ok(owner, repo, token)
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

  async get ({ path = '' }) {
    const s = this
    const url = s._makeUrl(path)
    const res = await s._tryRequest(url, 'GET', {
      path
    })
    // Overwrite content
    if (res.content) {
      res.content = decode(res.content)
    }
    return res
  }

  async create ({ path, content = '' }) {
    ok(path)
    const s = this
    const { committer } = s
    const url = s._makeUrl(path)
    const res = await s._tryRequest(url, 'PUT', {
      committer,
      path,
      message: 'Create a file',
      content: encode(content)
    })
    return res
  }

  async update ({ path, content = '' }) {
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
      content: encode(content),
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
