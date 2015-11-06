# knex-csv-seeder

[![Build Status](https://travis-ci.org/holyshared/knex-csv-seeder.svg)](https://travis-ci.org/holyshared/knex-csv-seeder)

## Basic usage

Create a seed file for Knex.

	knex seed:make seed_name

Change the code to import the data from CSV.  
Please refer to [the link](https://raw.githubusercontent.com/holyshared/knex-csv-seeder/master/test/fixtures/users_utf8.csv) format of the file.

```js
import seeder from 'knex-csv-seeder';

exports.seed = seeder('users', '/path/to/users.csv');
```

Execute the seed files.

	knex seed:run