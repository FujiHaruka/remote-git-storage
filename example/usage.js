const RemoteStore = require('remote-git-store')

async function example () {
  const store = RemoteStore({
    owner: 'github-repository-owner',
    repo: 'github-repository-name',
    // Access token must not be known by others.
    token: 'access-token',
    // If you need, you can encrypt data file by commonKey.
    // Of course this must not be known by others too.
    commonKey: '1851565a02261638ab14f1d38eb1adc31100500a'
  })

  // Ref has a unique path.
  // The path means a JSON file path in the repository.
  const ToDo = await store.ref('users/1/todo')

  // Save as a JSON file.
  // Supported type: string, number, boolean, null
  await ToDo.save([
    {
      text: 'To meet my dad',
      done: false,
      createdAt: String(new Date()), // Date type is not supported.
      impotant: 10
    }
  ])

  // Load the saved object
  const todos = await ToDo.load()
  console.log(todos)
  // [ { text: 'To meet my dad',
  //   done: false,
  //   createdAt: 'Sun Jul 23 2017 11:27:32 GMT+0900 (JST)',
  //   impotant: 10 } ]
}

example()
