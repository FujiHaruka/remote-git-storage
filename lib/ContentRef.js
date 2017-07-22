const _ = require('lodash')

class ContentRef {
  constructor (api, path) {
    const s = this
    s.api = api
    s.path = path
    s._cache = {
      cached: false,
      content: {},
      sha: ''
    }
  }

  async get () {
    const s = this
    const { api, path } = s
    if (s._cache.cached) {
      return _.cloneDeep(s._cache)
    }
    const { err, content, sha } = await api.get({ path })
    if (err) {
      return { err }
    }
    s._cache = {
      cached: true,
      content,
      sha
    }
    return JSON.parse(content)
  }

  async update (contentObj) {
    const s = this
    const { api, path } = s
    const sha = s._cache.cached ? s._cache.sha : null
    const content = JSON.stringify(contentObj, null, '  ')
    const res = await api.create({ path, content, sha })
    if (res.err) {
      return { err: res.err }
    }
    s._cached = {
      cached: true,
      content,
      sha: res.content.sha
    }
    return {}
  }
}

module.exports = ContentRef
