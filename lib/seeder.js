'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.seeder = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _csvParse = require('csv-parse');

var _csvParse2 = _interopRequireDefault(_csvParse);

var _iconvLite = require('iconv-lite');

var _iconvLite2 = _interopRequireDefault(_iconvLite);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _events = require('events');

var _bluebird = require('bluebird');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const seeder = exports.seeder = {
  seed(options) {
    return (knex, Promise) => {
      return new Promise((resolve, reject) => {
        KnexSeeder.fromKnexClient(knex).on('end', resolve).on('error', reject).generate(options);
      });
    };
  }
};

exports.default = seeder.seed;


class KnexSeeder extends _events.EventEmitter {

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

    return _lodash2.default.merge({}, defaults, opts);
  }

  generate(options) {
    this.opts = this.mergeOptions(options);

    this.parser = (0, _csvParse2.default)(this.opts.parser);
    this.parser.on('readable', this.onReadable);
    this.parser.on('end', this.onEnd);
    this.parser.on('error', this.onFailed);

    this.queue = _bluebird.Promise.bind(this).then(this.createCleanUpQueue());

    this.csv = _fs2.default.createReadStream(this.opts.file);
    this.csv.pipe(_iconvLite2.default.decodeStream(this.opts.encoding)).pipe(this.parser);
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
      this.records.push(this.createObjectFrom(record));
    }

    if (this.records.length < this.opts.recordsPerQuery) {
      return;
    }

    this.queue = this.queue.then(this.createBulkInsertQueue());
  }
  onEnd() {
    if (this.records.length > 0) {
      this.queue = this.queue.then(this.createBulkInsertQueue());
    }
    this.queue.then(() => {
      return this.emit('end', this.results);
    }).catch(this.onFailed);
  }
  createCleanUpQueue() {
    return () => {
      return this.knex(this.opts.table).del().then(this.onSucceeded).catch(this.onFailed);
    };
  }
  createBulkInsertQueue() {
    const records = this.records.splice(0, this.opts.recordsPerQuery);

    return () => {
      return this.knex(this.opts.table).insert(records).then(this.onSucceeded).catch(this.onFailed);
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
//# sourceMappingURL=data:application/json;base64,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Qjs7QUFFQSxXQUFPLE1BQU07QUFDWCxhQUFPLEtBQUssSUFBTCxDQUFVLEtBQUssSUFBTCxDQUFVLEtBQXBCLEVBQ0osTUFESSxDQUNHLE9BREgsRUFFSixJQUZJLENBRUMsS0FBSyxXQUZOLEVBR0osS0FISSxDQUdFLEtBQUssUUFIUCxDQUFQO0FBSUQsS0FMRDtBQU1EO0FBQ0QsbUJBQWlCLE1BQWpCLEVBQXlCO0FBQ3ZCLFFBQUksTUFBTSxFQUFWOztBQUVBLFNBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsQ0FBQyxNQUFELEVBQVMsQ0FBVCxLQUFlO0FBQ2xDLFVBQUksTUFBTSxPQUFPLENBQVAsQ0FBVjs7QUFFQSxVQUFJLE9BQU8sR0FBUCxLQUFlLFFBQWYsSUFBMkIsSUFBSSxXQUFKLE9BQXNCLE1BQXJELEVBQTZEO0FBQzNELGNBQU0sSUFBTjtBQUNEO0FBQ0QsVUFBSSxNQUFKLElBQWMsR0FBZDtBQUNELEtBUEQ7QUFRQSxXQUFPLEdBQVA7QUFDRDtBQUNELGNBQVksR0FBWixFQUFpQjtBQUNmLFNBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsR0FBbEI7QUFDRDtBQUNELFdBQVMsR0FBVCxFQUFjO0FBQ1osU0FBSyxHQUFMLENBQVMsTUFBVDtBQUNBLFNBQUssSUFBTCxDQUFVLE9BQVYsRUFBbUIsR0FBbkI7QUFDRDtBQXRIbUMiLCJmaWxlIjoic2VlZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXJzZSBmcm9tICdjc3YtcGFyc2UnO1xuaW1wb3J0IGljb252IGZyb20gJ2ljb252LWxpdGUnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgeyBQcm9taXNlIH0gZnJvbSAnYmx1ZWJpcmQnO1xuXG5leHBvcnQgY29uc3Qgc2VlZGVyID0ge1xuICBzZWVkKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gKGtuZXgsIFByb21pc2UpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIEtuZXhTZWVkZXIuZnJvbUtuZXhDbGllbnQoa25leClcbiAgICAgICAgICAub24oJ2VuZCcsIHJlc29sdmUpXG4gICAgICAgICAgLm9uKCdlcnJvcicsIHJlamVjdClcbiAgICAgICAgICAuZ2VuZXJhdGUob3B0aW9ucyk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzZWVkZXIuc2VlZDtcblxuY2xhc3MgS25leFNlZWRlciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cbiAgY29uc3RydWN0b3Ioa25leCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5vcHRzID0ge307XG4gICAgdGhpcy5rbmV4ID0ga25leDtcbiAgICB0aGlzLmhlYWRlcnMgPSBbXTtcbiAgICB0aGlzLnJlY29yZHMgPSBbXTtcbiAgICB0aGlzLnBhcnNlciA9IG51bGw7XG4gICAgdGhpcy5xdWV1ZSA9IG51bGw7XG4gICAgdGhpcy5yZXN1bHRzID0gW107XG4gICAgdGhpcy5vblJlYWRhYmxlID0gdGhpcy5vblJlYWRhYmxlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vbkVuZCA9IHRoaXMub25FbmQuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uU3VjY2VlZGVkID0gdGhpcy5vblN1Y2NlZWRlZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25GYWlsZWQgPSB0aGlzLm9uRmFpbGVkLmJpbmQodGhpcyk7XG4gIH1cblxuICBzdGF0aWMgZnJvbUtuZXhDbGllbnQoa25leCkge1xuICAgIHJldHVybiBuZXcgS25leFNlZWRlcihrbmV4KTtcbiAgfVxuXG4gIG1lcmdlT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgbGV0IG9wdHMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGxldCBkZWZhdWx0cyA9IHtcbiAgICAgIGZpbGU6IG51bGwsXG4gICAgICB0YWJsZTogbnVsbCxcbiAgICAgIGVuY29kaW5nOiAndXRmOCcsXG4gICAgICByZWNvcmRzUGVyUXVlcnk6IDEwMCxcbiAgICAgIHBhcnNlcjoge1xuICAgICAgICBkZWxpbWl0ZXI6ICcsJyxcbiAgICAgICAgcXVvdGU6ICdcIicsXG4gICAgICAgIGVzY2FwZTogJ1xcXFwnLFxuICAgICAgICBza2lwX2VtcHR5X2xpbmVzOiB0cnVlLFxuICAgICAgICBhdXRvX3BhcnNlOiB0cnVlXG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBfLm1lcmdlKHt9LCBkZWZhdWx0cywgb3B0cyk7XG4gIH1cblxuICBnZW5lcmF0ZShvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRzID0gdGhpcy5tZXJnZU9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICB0aGlzLnBhcnNlciA9IHBhcnNlKHRoaXMub3B0cy5wYXJzZXIpO1xuICAgIHRoaXMucGFyc2VyLm9uKCdyZWFkYWJsZScsIHRoaXMub25SZWFkYWJsZSk7XG4gICAgdGhpcy5wYXJzZXIub24oJ2VuZCcsIHRoaXMub25FbmQpO1xuICAgIHRoaXMucGFyc2VyLm9uKCdlcnJvcicsIHRoaXMub25GYWlsZWQpO1xuXG4gICAgdGhpcy5xdWV1ZSA9IFByb21pc2UuYmluZCh0aGlzKS50aGVuKCB0aGlzLmNyZWF0ZUNsZWFuVXBRdWV1ZSgpICk7XG5cbiAgICB0aGlzLmNzdiA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0odGhpcy5vcHRzLmZpbGUpO1xuICAgIHRoaXMuY3N2LnBpcGUoIGljb252LmRlY29kZVN0cmVhbSh0aGlzLm9wdHMuZW5jb2RpbmcpICkucGlwZSh0aGlzLnBhcnNlcik7XG4gIH1cblxuICBvblJlYWRhYmxlKCkge1xuICAgIGxldCBvYmogPSB7fTtcbiAgICBsZXQgcmVjb3JkID0gdGhpcy5wYXJzZXIucmVhZCgpO1xuXG4gICAgaWYgKHJlY29yZCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhcnNlci5jb3VudCA8PSAxKSB7XG4gICAgICB0aGlzLmhlYWRlcnMgPSByZWNvcmQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVjb3Jkcy5wdXNoKCB0aGlzLmNyZWF0ZU9iamVjdEZyb20ocmVjb3JkKSApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlY29yZHMubGVuZ3RoIDwgdGhpcy5vcHRzLnJlY29yZHNQZXJRdWVyeSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucXVldWUgPSB0aGlzLnF1ZXVlLnRoZW4oIHRoaXMuY3JlYXRlQnVsa0luc2VydFF1ZXVlKCkgKTtcbiAgfVxuICBvbkVuZCgpIHtcbiAgICBpZiAodGhpcy5yZWNvcmRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMucXVldWUgPSB0aGlzLnF1ZXVlLnRoZW4oIHRoaXMuY3JlYXRlQnVsa0luc2VydFF1ZXVlKCkgKTtcbiAgICB9XG4gICAgdGhpcy5xdWV1ZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmVtaXQoJ2VuZCcsIHRoaXMucmVzdWx0cyk7XG4gICAgfSkuY2F0Y2godGhpcy5vbkZhaWxlZCk7XG4gIH1cbiAgY3JlYXRlQ2xlYW5VcFF1ZXVlKCkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5rbmV4KHRoaXMub3B0cy50YWJsZSkuZGVsKClcbiAgICAgICAgLnRoZW4odGhpcy5vblN1Y2NlZWRlZClcbiAgICAgICAgLmNhdGNoKHRoaXMub25GYWlsZWQpO1xuICAgIH07XG4gIH1cbiAgY3JlYXRlQnVsa0luc2VydFF1ZXVlKCkge1xuICAgIGNvbnN0IHJlY29yZHMgPSB0aGlzLnJlY29yZHMuc3BsaWNlKDAsIHRoaXMub3B0cy5yZWNvcmRzUGVyUXVlcnkpO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmtuZXgodGhpcy5vcHRzLnRhYmxlKVxuICAgICAgICAuaW5zZXJ0KHJlY29yZHMpXG4gICAgICAgIC50aGVuKHRoaXMub25TdWNjZWVkZWQpXG4gICAgICAgIC5jYXRjaCh0aGlzLm9uRmFpbGVkKTtcbiAgICB9O1xuICB9XG4gIGNyZWF0ZU9iamVjdEZyb20ocmVjb3JkKSB7XG4gICAgbGV0IG9iaiA9IHt9O1xuXG4gICAgdGhpcy5oZWFkZXJzLmZvckVhY2goKGNvbHVtbiwgaSkgPT4ge1xuICAgICAgbGV0IHZhbCA9IHJlY29yZFtpXTtcblxuICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnICYmIHZhbC50b0xvd2VyQ2FzZSgpID09PSAnbnVsbCcpIHtcbiAgICAgICAgdmFsID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIG9ialtjb2x1bW5dID0gdmFsO1xuICAgIH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH1cbiAgb25TdWNjZWVkZWQocmVzKSB7XG4gICAgdGhpcy5yZXN1bHRzLnB1c2gocmVzKTtcbiAgfVxuICBvbkZhaWxlZChlcnIpIHtcbiAgICB0aGlzLmNzdi51bnBpcGUoKTtcbiAgICB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgfVxufVxuIl19