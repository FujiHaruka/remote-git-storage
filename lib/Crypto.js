const typeOf = require('type-of')
const CryptoJS = require('crypto-js')

const JSON_PRIMITIVE_TYPES = ['string', 'number', 'boolean', 'null']

const encryptor = (commonKey) => (value) => {
  const type = typeOf(value)
  if (!JSON_PRIMITIVE_TYPES.includes(type)) {
    throw new Error(`Unsupported type (${type}) of ${value}`)
  }
  const valueJson = JSON.stringify({ v: value }) // こうすることでJSONの型付きで暗号化できる
  const enc = CryptoJS.AES.encrypt(valueJson, commonKey).toString()
  return enc
}

const decryptor = (commonKey) => (enc) => {
  const valueJson = CryptoJS.AES.decrypt(enc, commonKey).toString(CryptoJS.enc.Utf8)
  const { v: value } = JSON.parse(valueJson)
  return value
}

function deepTranslate (obj, translate) {
  let type = typeOf(obj)
  switch (type) {
    case 'object':
      return Object.keys(obj).reduce(
        (translated, key) => Object.assign(translated, { [key]: deepTranslate(obj[key], translate) }),
        {}
      )
    case 'array':
      return obj.map(
        (value) => deepTranslate(value, translate)
      )
    case 'string':
    case 'number':
    case 'boolean':
    case 'null':
      return translate(obj)
    default:
      throw new Error(`Unsupported type (${type}) of ${obj}`)
  }
}

const encryptObj = (obj, commonKey) => {
  const encrypt = encryptor(commonKey)
  return deepTranslate(obj, encrypt)
}

const decryptObj = (obj, commonKey) => {
  const decrypt = decryptor(commonKey)
  return deepTranslate(obj, decrypt)
}

module.exports = {
  encryptObj,
  decryptObj
}
