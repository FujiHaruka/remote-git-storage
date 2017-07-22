const ContentRef = require('./ContentRef')
const { dirname, basename } = require('path')

const INITIAL_CONTENT = '{}'
const toFilePath = (path) => path + '.json'

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
    const filePath = toFilePath(path)
    const exists = await s.existsRef(path)
    if (!exists) {
      await api.create({ path: filePath, content: INITIAL_CONTENT })
    }
    const storeRef = new ContentRef(api, filePath)
    return storeRef
  }

  async deleteRef (path) {
    const s = this
    const { api } = s
    const filePath = toFilePath(path)
    const exists = await s.existsRef(path)
    if (!exists) {
      return {}
    }
    const res = await api.delete({ patt: filePath })
    return res
  }

  async existsRef (path) {
    const s = this
    const { api } = s
    const filePath = toFilePath(path)
    const dir = dirname(filePath)
    const filename = basename(filePath)
    const itemsInDir = await api.get(dir)
    const fileExists = itemsInDir.some((item) => item.name === filename)
    return fileExists
  }
}

module.exports = Store
