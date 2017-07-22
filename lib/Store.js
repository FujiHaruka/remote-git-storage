const { dirname, basename } = require('path')

class ContentRef {
  constructor (api, path) {
    const s = this
    s.api = api
    s.path = path
  }

  async get () {
    const { api, path } = this
    return await api.get({ path })
  }

  async update (content) {
    const { api, path } = this
    return await api.create({ path, content })
  }
}

class Store {
  constructor (setting = {}) {
    const {
      api
    } = setting
    const s = this
    if (!api) {
      throw new Error(`Invalid arg. setting.api is required`)
    }
    s.api = api
  }

  async ref (path) {
    const s = this
    const { api } = s
    const jsonPath = path + '.json'
    const dir = dirname(jsonPath)
    const filename = basename(jsonPath)
    const itemsInDir = await api.get(dir)
    const fileExists = itemsInDir.some((item) => item.name === filename)
    if (!fileExists) {
      await api.create({ path: jsonPath, content: '{}' })
    }
    const storeRef = new ContentRef(api, jsonPath)
    return storeRef
  }

  async deleteRef (path) {
    // TODO 実装
  }
}

module.exports = Store
