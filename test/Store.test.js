const { ok, equal } = require('assert')
const Store = require('../lib/Store')
const GitHubApi = require('../lib/GitHubApi')
const {
  GITHUB_OWNER,
  GITHUB_REPO,
  GITHUB_TOKEN
} = process.env

describe('Store', function () {
  this.timeout(30000)
  const owner = GITHUB_OWNER
  const repo = GITHUB_REPO
  const token = GITHUB_TOKEN
  const api = new GitHubApi({ owner, repo, token })

  it('ref', async () => {
    const store = new Store({ api })
    const path = 'test/stores/book'
    const Book = await store.ref(path)
    await Book.update({
      author: 'foo'
    })
    {
      let book = await Book.get()
      ok(book)
      equal(book.author, 'foo')
    }

    await Book.update({
      author: 'bar'
    })
    {
      let book = await Book.get()
      ok(book)
      equal(book.author, 'bar')
    }
  })

  it('deleteRef', async () => {
    const store = new Store({ api })
    const path = 'test/stores/person'
    // ref is created
    await store.ref(path)

    await store.deleteRef(path)
    const exists = await store.existsRef(path)
    ok(!exists)
  })
})

/* global describe, it */
