describe 'seeder', ->
  it 'returns csv seeder', ->
    @seeder = seeder('users', __dirname + '/fixtures/users_utf8.csv')
    @seeder(knex, Promise).then (res) ->
      deletedCount = res.shift()
      assert.ok deletedCount == 2

      insertedId = res.shift()
      assert.ok insertedId.shift() == 1

      insertedId = res.shift()
      assert.ok insertedId.shift() == 2
