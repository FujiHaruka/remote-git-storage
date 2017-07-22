const { deepEqual } = require('assert')
const { encryptObj, decryptObj } = require('../lib/Crypto')

describe('Crypto', function () {
  it('encrypt / decrypt', () => {
    const commonKey = 'password1234'
    const obj = {
      string: 'fooo',
      object: {
        bar2: [
          { bar3: 1 }
        ]
      },
      number: 100,
      null: null,
      true: true,
      false: false,
      array: [ 1, 2, 3 ],
      longString: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    }
    const enc = encryptObj(obj, commonKey)
    const dec = decryptObj(enc, commonKey)
    deepEqual(obj, dec)
  })
})

/* global describe, it */
