const { encryptObj, decryptObj } = require('./Crypto')

class ContentRef {
  constructor (api, path, option = {}) {
    const s = this
    const { commonKey } = option
    s.api = api
    s.path = path
    if (commonKey) {
      s.isPrivate = true
      s.commonKey = commonKey
    }
    s._cache = {
      cached: false,
      content: '',
      sha: ''
    }
  }

  async get () {
    const s = this
    const { api, path } = s
    if (s._cache.cached) {
      return s._parse(s._cache.content)
    }
    const { err, content, sha } = await api.get({ path })
    if (err) {
      throw err
    }
    s._cache = {
      cached: true,
      content,
      sha
    }
    return s._parse(content)
  }

  async update (contentObj) {
    const s = this
    const { api, path } = s
    const sha = s._cache.cached ? s._cache.sha : null
    const content = s._stringify(contentObj)
    const res = await api.update({ path, content, sha })
    if (res.err) {
      throw res.err
    }
    s._cache = {
      cached: true,
      content,
      sha: res.content.sha
    }
  }

  _parse (json) {
    const obj = JSON.parse(json)
    return this.isPrivate ? decryptObj(obj, this.commonKey) : obj
  }

  _stringify (obj) {
    const enc = this.isPrivate ? encryptObj(obj, this.commonKey) : obj
    return JSON.stringify(enc, null, '  ')
  }
}

module.exports = ContentRef
