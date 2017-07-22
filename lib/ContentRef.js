class ContentRef {
  constructor (api, path) {
    const s = this
    s.api = api
    s.path = path
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
      return JSON.parse(s._cache.content)
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
    return JSON.parse(content)
  }

  async update (contentObj) {
    const s = this
    const { api, path } = s
    const sha = s._cache.cached ? s._cache.sha : null
    const content = JSON.stringify(contentObj, null, '  ')
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
}

module.exports = ContentRef
