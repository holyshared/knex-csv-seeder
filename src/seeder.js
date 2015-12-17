import fs from 'fs';
import parse from 'csv-parse';
import iconv from 'iconv-lite';
import _ from 'lodash';
import { EventEmitter } from 'events';
import { Promise } from 'bluebird';

export const seeder = {
  seed(options) {
    return (knex, Promise) => {
      return new Promise((resolve, reject) => {
        KnexSeeder.fromKnexClient(knex)
          .on('end', resolve)
          .on('error', reject)
          .generate(options);
      });
    };
  }
};

export default seeder.seed;

class KnexSeeder extends EventEmitter {

  constructor(knex) {
    super();
    this.opts = {};
    this.knex = knex;
    this.headers = [];
    this.records = [];
    this.parser = null;
    this.queue = null;
    this.results = [];
    this.onReadable = this.onReadable.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onSucceeded = this.onSucceeded.bind(this);
    this.onFailed = this.onFailed.bind(this);
  }

  static fromKnexClient(knex) {
    return new KnexSeeder(knex);
  }

  mergeOptions(options) {
    let opts = options || {};
    let defaults = {
      file: null,
      table: null,
      encoding: 'utf8',
      recordsPerQuery: 100,
      parser: {
        delimiter: ',',
        quote: '"',
        escape: '\\',
        skip_empty_lines: true,
        auto_parse: true
      }
    };

    return _.merge({}, defaults, opts);
  }

  generate(options) {
    this.opts = this.mergeOptions(options);

    this.parser = parse(this.opts.parser);
    this.parser.on('readable', this.onReadable);
    this.parser.on('end', this.onEnd);
    this.parser.on('error', this.onFailed);

    this.queue = Promise.bind(this).then( this.createCleanUpQueue() );

    this.csv = fs.createReadStream(this.opts.file);
    this.csv.pipe( iconv.decodeStream(this.opts.encoding) ).pipe(this.parser);
  }

  onReadable() {
    let obj = {};
    let record = this.parser.read();

    if (record === null) {
      return;
    }

    if (this.parser.count <= 1) {
      this.headers = record;
    } else {
      this.records.push( this.createObjectFrom(record) );
    }

    if (this.records.length < this.opts.recordsPerQuery) {
      return;
    }

    this.queue = this.queue.then( this.createBulkInsertQueue() );
  }
  onEnd() {
    if (this.records.length > 0) {
      this.queue = this.queue.then( this.createBulkInsertQueue() );
    }
    this.queue.then(() => {
      return this.emit('end', this.results);
    }).catch(this.onFailed);
  }
  createCleanUpQueue() {
    return () => {
      return this.knex(this.opts.table).del()
        .then(this.onSucceeded)
        .catch(this.onFailed);
    };
  }
  createBulkInsertQueue() {
    const records = this.records.splice(0, this.opts.recordsPerQuery);

    return () => {
      return this.knex(this.opts.table)
        .insert(records)
        .then(this.onSucceeded)
        .catch(this.onFailed);
    };
  }
  createObjectFrom(record) {
    let obj = {};

    this.headers.forEach((column, i) => {
      let val = record[i];

      if (typeof val === 'string' && val.toLowerCase() === 'null') {
        val = null;
      }
      obj[column] = val;
    });
    return obj;
  }
  onSucceeded(res) {
    this.results.push(res);
  }
  onFailed(err) {
    this.csv.unpipe();
    this.emit('error', err);
  }
}
