'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var seeder = exports.seeder = {
  seed: function seed(options) {
    return function (knex, Promise) {
      return new Promise(function (resolve, reject) {
        KnexSeeder.fromKnexClient(knex).on('end', resolve).on('error', reject).generate(options);
      });
    };
  }
};

exports.default = seeder.seed;

var KnexSeeder = (function (_EventEmitter) {
  _inherits(KnexSeeder, _EventEmitter);

  function KnexSeeder(knex) {
    _classCallCheck(this, KnexSeeder);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(KnexSeeder).call(this));

    _this.opts = {};
    _this.knex = knex;
    _this.headers = [];
    _this.records = [];
    _this.parser = null;
    _this.queue = null;
    _this.results = [];
    return _this;
  }

  _createClass(KnexSeeder, [{
    key: 'mergeOptions',
    value: function mergeOptions(options) {
      var opts = options || {};
      var defaults = {
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
  }, {
    key: 'generate',
    value: function generate(options) {
      this.opts = this.mergeOptions(options);

      this.parser = (0, _csvParse2.default)(this.opts.parser);
      this.parser.on('readable', this.readable.bind(this));
      this.parser.on('end', this.end.bind(this));
      this.parser.on('error', this.failed.bind(this));

      this.queue = _bluebird.Promise.bind(this).then(this.createCleanUpQueue());

      this.csv = _fs2.default.createReadStream(this.opts.file);
      this.csv.pipe(_iconvLite2.default.decodeStream(this.opts.encoding)).pipe(this.parser);
    }
  }, {
    key: 'readable',
    value: function readable() {
      var obj = {};
      var record = this.parser.read();

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
  }, {
    key: 'end',
    value: function end() {
      var _this2 = this;

      if (this.records.length > 0) {
        this.queue = this.queue.then(this.createBulkInsertQueue());
      }
      this.queue.then(function () {
        return _this2.emit('end', _this2.results);
      });
    }
  }, {
    key: 'createCleanUpQueue',
    value: function createCleanUpQueue() {
      var _this3 = this;

      return function () {
        return _this3.knex(_this3.opts.table).del().then(_this3.succeeded.bind(_this3)).catch(_this3.failed.bind(_this3));
      };
    }
  }, {
    key: 'createBulkInsertQueue',
    value: function createBulkInsertQueue() {
      var _this4 = this;

      var records = this.records.splice(0, this.opts.recordsPerQuery);

      return function () {
        return _this4.knex(_this4.opts.table).insert(records).then(_this4.succeeded.bind(_this4)).catch(_this4.failed.bind(_this4));
      };
    }
  }, {
    key: 'createObjectFrom',
    value: function createObjectFrom(record) {
      var obj = {};

      this.headers.forEach(function (column, i) {
        var val = record[i];

        if (typeof val === 'string' && val.toLowerCase() === 'null') {
          val = null;
        }
        obj[column] = val;
      });
      return obj;
    }
  }, {
    key: 'succeeded',
    value: function succeeded(res) {
      this.results.push(res);
    }
  }, {
    key: 'failed',
    value: function failed(err) {
      this.csv.unpipe();
      this.emit('error', err);
    }
  }], [{
    key: 'fromKnexClient',
    value: function fromKnexClient(knex) {
      return new KnexSeeder(knex);
    }
  }]);

  return KnexSeeder;
})(_events.EventEmitter);
//# sourceMappingURL=data:application/json;base64,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LEdBQUcsRUFBRTtBQUNWLFVBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbEIsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDekI7OzttQ0FyR3FCLElBQUksRUFBRTtBQUMxQixhQUFPLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzdCOzs7U0FmRyxVQUFVO1dBbEJQLFlBQVkiLCJmaWxlIjoic2VlZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXJzZSBmcm9tICdjc3YtcGFyc2UnO1xuaW1wb3J0IGljb252IGZyb20gJ2ljb252LWxpdGUnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgeyBQcm9taXNlIH0gZnJvbSAnYmx1ZWJpcmQnO1xuXG5leHBvcnQgY29uc3Qgc2VlZGVyID0ge1xuICBzZWVkKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gKGtuZXgsIFByb21pc2UpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIEtuZXhTZWVkZXIuZnJvbUtuZXhDbGllbnQoa25leClcbiAgICAgICAgICAub24oJ2VuZCcsIHJlc29sdmUpXG4gICAgICAgICAgLm9uKCdlcnJvcicsIHJlamVjdClcbiAgICAgICAgICAuZ2VuZXJhdGUob3B0aW9ucyk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzZWVkZXIuc2VlZDtcblxuY2xhc3MgS25leFNlZWRlciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cbiAgY29uc3RydWN0b3Ioa25leCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5vcHRzID0ge307XG4gICAgdGhpcy5rbmV4ID0ga25leDtcbiAgICB0aGlzLmhlYWRlcnMgPSBbXTtcbiAgICB0aGlzLnJlY29yZHMgPSBbXTtcbiAgICB0aGlzLnBhcnNlciA9IG51bGw7XG4gICAgdGhpcy5xdWV1ZSA9IG51bGw7XG4gICAgdGhpcy5yZXN1bHRzID0gW107XG4gIH1cblxuICBzdGF0aWMgZnJvbUtuZXhDbGllbnQoa25leCkge1xuICAgIHJldHVybiBuZXcgS25leFNlZWRlcihrbmV4KTtcbiAgfVxuXG4gIG1lcmdlT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgbGV0IG9wdHMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGxldCBkZWZhdWx0cyA9IHtcbiAgICAgIGZpbGU6IG51bGwsXG4gICAgICB0YWJsZTogbnVsbCxcbiAgICAgIGVuY29kaW5nOiAndXRmOCcsXG4gICAgICByZWNvcmRzUGVyUXVlcnk6IDEwMCxcbiAgICAgIHBhcnNlcjoge1xuICAgICAgICBkZWxpbWl0ZXI6ICcsJyxcbiAgICAgICAgcXVvdGU6ICdcIicsXG4gICAgICAgIGVzY2FwZTogJ1xcXFwnLFxuICAgICAgICBza2lwX2VtcHR5X2xpbmVzOiB0cnVlLFxuICAgICAgICBhdXRvX3BhcnNlOiB0cnVlXG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBfLm1lcmdlKHt9LCBkZWZhdWx0cywgb3B0cyk7XG4gIH1cblxuICBnZW5lcmF0ZShvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRzID0gdGhpcy5tZXJnZU9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICB0aGlzLnBhcnNlciA9IHBhcnNlKHRoaXMub3B0cy5wYXJzZXIpO1xuICAgIHRoaXMucGFyc2VyLm9uKCdyZWFkYWJsZScsIHRoaXMucmVhZGFibGUuYmluZCh0aGlzKSApO1xuICAgIHRoaXMucGFyc2VyLm9uKCdlbmQnLCB0aGlzLmVuZC5iaW5kKHRoaXMpICk7XG4gICAgdGhpcy5wYXJzZXIub24oJ2Vycm9yJywgdGhpcy5mYWlsZWQuYmluZCh0aGlzKSApO1xuXG4gICAgdGhpcy5xdWV1ZSA9IFByb21pc2UuYmluZCh0aGlzKS50aGVuKCB0aGlzLmNyZWF0ZUNsZWFuVXBRdWV1ZSgpICk7XG5cbiAgICB0aGlzLmNzdiA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0odGhpcy5vcHRzLmZpbGUpO1xuICAgIHRoaXMuY3N2LnBpcGUoIGljb252LmRlY29kZVN0cmVhbSh0aGlzLm9wdHMuZW5jb2RpbmcpICkucGlwZSh0aGlzLnBhcnNlcik7XG4gIH1cblxuICByZWFkYWJsZSgpIHtcbiAgICBsZXQgb2JqID0ge307XG4gICAgbGV0IHJlY29yZCA9IHRoaXMucGFyc2VyLnJlYWQoKTtcblxuICAgIGlmIChyZWNvcmQgPT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJzZXIuY291bnQgPD0gMSkge1xuICAgICAgdGhpcy5oZWFkZXJzID0gcmVjb3JkO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlY29yZHMucHVzaCggdGhpcy5jcmVhdGVPYmplY3RGcm9tKHJlY29yZCkgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZWNvcmRzLmxlbmd0aCA8IHRoaXMub3B0cy5yZWNvcmRzUGVyUXVlcnkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnF1ZXVlID0gdGhpcy5xdWV1ZS50aGVuKCB0aGlzLmNyZWF0ZUJ1bGtJbnNlcnRRdWV1ZSgpICk7XG4gIH1cbiAgZW5kKCkge1xuICAgIGlmICh0aGlzLnJlY29yZHMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5xdWV1ZSA9IHRoaXMucXVldWUudGhlbiggdGhpcy5jcmVhdGVCdWxrSW5zZXJ0UXVldWUoKSApO1xuICAgIH1cbiAgICB0aGlzLnF1ZXVlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuZW1pdCgnZW5kJywgdGhpcy5yZXN1bHRzKTtcbiAgICB9KTtcbiAgfVxuICBjcmVhdGVDbGVhblVwUXVldWUoKSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmtuZXgodGhpcy5vcHRzLnRhYmxlKS5kZWwoKVxuICAgICAgICAudGhlbih0aGlzLnN1Y2NlZWRlZC5iaW5kKHRoaXMpKVxuICAgICAgICAuY2F0Y2godGhpcy5mYWlsZWQuYmluZCh0aGlzKSk7XG4gICAgfTtcbiAgfVxuICBjcmVhdGVCdWxrSW5zZXJ0UXVldWUoKSB7XG4gICAgY29uc3QgcmVjb3JkcyA9IHRoaXMucmVjb3Jkcy5zcGxpY2UoMCwgdGhpcy5vcHRzLnJlY29yZHNQZXJRdWVyeSk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMua25leCh0aGlzLm9wdHMudGFibGUpXG4gICAgICAgIC5pbnNlcnQocmVjb3JkcylcbiAgICAgICAgLnRoZW4odGhpcy5zdWNjZWVkZWQuYmluZCh0aGlzKSlcbiAgICAgICAgLmNhdGNoKHRoaXMuZmFpbGVkLmJpbmQodGhpcykpO1xuICAgIH07XG4gIH1cbiAgY3JlYXRlT2JqZWN0RnJvbShyZWNvcmQpIHtcbiAgICBsZXQgb2JqID0ge307XG5cbiAgICB0aGlzLmhlYWRlcnMuZm9yRWFjaCgoY29sdW1uLCBpKSA9PiB7XG4gICAgICBsZXQgdmFsID0gcmVjb3JkW2ldO1xuXG4gICAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgJiYgdmFsLnRvTG93ZXJDYXNlKCkgPT09ICdudWxsJykge1xuICAgICAgICB2YWwgPSBudWxsO1xuICAgICAgfVxuICAgICAgb2JqW2NvbHVtbl0gPSB2YWw7XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuICBzdWNjZWVkZWQocmVzKSB7XG4gICAgdGhpcy5yZXN1bHRzLnB1c2gocmVzKTtcbiAgfVxuICBmYWlsZWQoZXJyKSB7XG4gICAgdGhpcy5jc3YudW5waXBlKCk7XG4gICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycik7XG4gIH1cbn1cbiJdfQ==