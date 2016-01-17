# knex-csv-seeder

[![npm version](https://badge.fury.io/js/knex-csv-seeder.svg)](https://badge.fury.io/js/knex-csv-seeder)
[![Build Status](https://travis-ci.org/holyshared/knex-csv-seeder.svg)](https://travis-ci.org/holyshared/knex-csv-seeder)
[![codecov.io](https://codecov.io/github/holyshared/knex-csv-seeder/coverage.svg?branch=master)](https://codecov.io/github/holyshared/knex-csv-seeder?branch=master)
[![Dependency Status](https://david-dm.org/holyshared/knex-csv-seeder.svg)](https://david-dm.org/holyshared/knex-csv-seeder)

## Basic usage

Create a seed file for Knex.

	knex seed:make seed_name

Change the code to import the data from CSV.  
Please refer to [the link](https://raw.githubusercontent.com/holyshared/knex-csv-seeder/master/test/fixtures/users_utf8.csv) format of the file.

```js
import seeder from 'knex-csv-seeder';

exports.seed = seeder({
  table: 'users',
  file: '/path/to/users.csv',
  // recordsPerQuery: 100,
  // encoding: 'utf8' default encoding
  // parser: {
  //   delimiter: ',',
  //   quote: '"',
  //   escape: '\\'
  // }
});
```

Execute the seed files.

	knex seed:run
