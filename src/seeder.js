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
    this.queue = Promise.bind(this).then(() => {
      return this.knex(this.opts.table).del().then(this.stackResult.bind(this));
    });
    this.parser = parse(this.opts.parser);
    this.parser.on('readable', this.readable.bind(this) );
    this.parser.on('end', this.end.bind(this) );
    this.parser.on('error', this.error.bind(this) );

    let csv = fs.createReadStream(this.opts.file);
    csv.pipe( iconv.decodeStream(this.opts.encoding) ).pipe(this.parser);
  }

  readable() {
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

    if (this.records.length < this.opts.recordsPerQuery) { //TODO add options
      return;
    }
    this.queue = this.queue.then( this.createQueue() );
  }
  end() {
    if (this.records.length > 0) {
      this.queue = this.queue.then( this.createQueue() );
    }
    this.queue.then(() => {
      return this.emit('end', this.results);
    });
  }
  createQueue() {
    return () => {
      return this.knex(this.opts.table)
        .insert(this.records.splice(0, this.opts.recordsPerQuery))
        .then(this.stackResult.bind(this));
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
  stackResult(res) {
    this.results.push(res);
  }
  error(err) {
    this.emit('error', err);
  }
}
