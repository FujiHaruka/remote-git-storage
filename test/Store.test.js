const { ok, equal } = require('assert')
const Storage = require('../lib/Storage')
const GitHubApi = require('../lib/GitHubApi')
const {
  GITHUB_OWNER,
  GITHUB_REPO,
  GITHUB_TOKEN
} = process.env

describe('Storage', function () {
  this.timeout(30000)
  const owner = GITHUB_OWNER
  const repo = GITHUB_REPO
  const token = GITHUB_TOKEN
  const api = new GitHubApi({ owner, repo, token })

  it('ref', async () => {
    const storage = new Storage({ api })
    const path = 'test/storages/book'
    const Book = await storage.ref(path)
    await Book.save({
      author: 'foo'
    })
    {
      let book = await Book.load()
      ok(book)
      equal(book.author, 'foo')
    }

    await Book.save({
      author: 'bar'
    })
    {
      let book = await Book.load()
      ok(book)
      equal(book.author, 'bar')
    }
  })

  it('deleteRef', async () => {
    const storage = new Storage({ api })
    const path = 'test/storages/person'
    // ref is created
    await storage.ref(path)

    await storage.deleteRef(path)
    const exists = await storage.existsRef(path)
    ok(!exists)
  })

  it('private ref', async () => {
    const storage = new Storage({ api, commonKey: 'password1234' })
    const path = 'test/storages/secret'
    const Book = await storage.ref(path)
    await Book.save({
      author: 'foo'
    })
    {
      let book = await Book.load()
      ok(book)
      equal(book.author, 'foo')
    }

    await Book.save({
      author: 'bar'
    })
    {
      let book = await Book.load()
      ok(book)
      equal(book.author, 'bar')
    }
  })
})

/* global describe, it */
