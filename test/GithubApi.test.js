const { equal, ok } = require('assert')
const GithubApi = require('../lib/GithubApi')
const {
  GITHUB_OWNER,
  GITHUB_REPO,
  GITHUB_TOKEN
} = process.env

describe('GithubApi', function () {
  this.timeout(30000)
  const owner = GITHUB_OWNER
  const repo = GITHUB_REPO
  const token = GITHUB_TOKEN
  const api = new GithubApi({ owner, repo, token })
  const path = 'test/foo.txt'

  it('Create, Get, Delete', async () => {
    await api.delete({ path })
    const firstContent = 'いろはにほへと\nちりぬるを'
    const secondContent = 'いろはにほへと\nちりぬるを\nわかよたれそ\nつねならむ'
    {
      const res = await api.create({ path, content: firstContent })
      ok(!res.err)
    }
    {
      const res = await api.get({ path })
      ok(!res.err)
      equal(res.content, firstContent)
    }
    {
      const res = await api.update({ path, content: secondContent })
      ok(!res.err)
    }
    let sha
    {
      const res = await api.get({ path })
      ok(!res.err)
      equal(res.content, secondContent)
      sha = res.sha
    }
    {
      const res = await api.update({ path, content: '', sha })
      ok(!res.err)
    }
    {
      const res = await api.delete({ path })
      ok(!res.err)
    }
  })
})

/* global describe, it */
