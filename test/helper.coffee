global.seeder = require('../lib/seeder').default
global.Promise = require 'bluebird'
global.assert = require 'power-assert'
global.knex = require('knex')
  client: 'mysql'
  connection:
    host: '127.0.0.1',
    user: 'knex',
    password: 'knex',
    database: 'knex'
