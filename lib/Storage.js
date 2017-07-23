const ContentRef = require('./ContentRef')
const { dirname, basename } = require('path')

const INITIAL_CONTENT = '{}'
const toFilePath = (path) => path + '.json'

class Storage {
  constructor (setting = {}) {
    const {
      api,
      commonKey
    } = setting
    const s = this
    if (!api) {
      throw new Error(`Invalid arg. setting.api is required`)
    }
    s.api = api
    s.commonKey = commonKey
  }

  async ref (path) {
    const s = this
    const { api, commonKey } = s
    const filePath = toFilePath(path)
    const exists = await s.existsRef(path)
    if (!exists) {
      await api.create({ path: filePath, content: INITIAL_CONTENT })
    }
    const storageRef = new ContentRef(api, filePath, { commonKey })
    return storageRef
  }

  async deleteRef (path) {
    const s = this
    const { api } = s
    const filePath = toFilePath(path)
    const exists = await s.existsRef(path)
    if (!exists) {
      return
    }
    const res = await api.delete({ patt: filePath })
    if (res.err) {
      throw res.err
    }
  }

  async existsRef (path) {
    const s = this
    const { api } = s
    const filePath = toFilePath(path)
    const dir = dirname(filePath)
    const filename = basename(filePath)
    const itemsInDir = await api.get(dir)
    if (itemsInDir.err) {
      throw itemsInDir.err
    }
    const fileExists = itemsInDir.some((item) => item.name === filename)
    return fileExists
  }
}

module.exports = Storage
