import fs from 'fs';
import parse from 'csv-parse';
import iconv from 'iconv-lite';

export default function seeder(tableName, filePath, encoding = 'utf8') {

  return (knex, Promise) => {
    let seeder = new CSVSeeder(knex);

    return seeder.createFrom({
      file: filePath,
      table: tableName,
      encoding: encoding
    });
  };

}

export class CSVSeeder {
  constructor(knex) {
    this.knex = knex;
    this.headers = [];
    this.queues = [];
    this.opts = {}; 
    this.parser = parse({
      delimiter: ',',
      skip_empty_lines: true,
      auto_parse: true
    });
  }
  createFrom(options) {
    let callback = (resolve, reject) => {
      this.opts = options || {};
      this.finish = resolve;
      this.error = reject;
      this.parser.on('readable', this.readable.bind(this) );
      this.parser.on('end', this.end.bind(this) );
      this.parser.on('error', this.error.bind(this) );
      this.queues.push( this.knex(this.opts.table).del() );

      let csv = fs.createReadStream(this.opts.file);
      csv.pipe( iconv.decodeStream(this.opts.encoding) ).pipe(this.parser);
    };

    return new Promise( callback.bind(this) );
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
      this.headers.forEach((column, i) => { obj[column] = record[i]; });
      this.queues.push( this.knex(this.opts.table).insert(obj) );
    }
  }

  end() {
    this.finish(Promise.join.apply(Promise, this.queues));
  }

};
