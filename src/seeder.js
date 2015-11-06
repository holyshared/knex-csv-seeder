import fs from 'fs';
import parse from 'csv-parse';
import iconv from 'iconv-lite';

export default function seeder(tableName, filePath, encoding = 'utf8') {

  return (knex, Promise) => {

    return new Promise((resolve, reject) => {

      let parser = parse({
        delimiter: ',',
        skip_empty_lines: true,
        auto_parse: true
      });

      let queues = [
        knex(tableName).del()
      ];

      let headers = [];

      parser.on('readable', () => {
        let obj = {};
        let record = parser.read();

        if (record === null) {
          return;
        }

        if (parser.count <= 1) {
          headers = record;
        } else {
          headers.forEach((column, i) => { obj[column] = record[i]; });
          queues.push( knex(tableName).insert(obj) );
        }
      });

      parser.on('end', () => {
        resolve( Promise.join.apply(Promise, queues) );
      });

      parser.on('error', reject);

      let csv = fs.createReadStream(filePath);
      csv.pipe( iconv.decodeStream(encoding) ).pipe(parser);
    });
  };

}
