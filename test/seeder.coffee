describe 'seeder', ->
  beforeEach ->
    Promise.join knex('users').del(),
      knex('users').insert id: 1, name: 'foo'
      knex('users').insert id: 2, name: 'bar'

  it 'returns csv seeder', ->
    @seeder = seeder(table: 'users', file: __dirname + '/fixtures/users_utf8.csv', encoding: 'utf8')
    @seeder(knex, Promise).then (res) ->
      deletedCount = res.shift()
      assert.ok deletedCount == 2

      insertedId = res.shift()
      assert.ok insertedId.shift() == 1

      insertedId = res.shift()
      assert.ok insertedId.shift() == 2
