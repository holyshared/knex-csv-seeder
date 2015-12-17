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
      this.csv.end();
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
//# sourceMappingURL=data:application/json;base64,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LEdBQUcsRUFBRTtBQUNWLFVBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDZixVQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2xCLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ3pCOzs7bUNBdEdxQixJQUFJLEVBQUU7QUFDMUIsYUFBTyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM3Qjs7O1NBZkcsVUFBVTtXQWxCUCxZQUFZIiwiZmlsZSI6InNlZWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGFyc2UgZnJvbSAnY3N2LXBhcnNlJztcbmltcG9ydCBpY29udiBmcm9tICdpY29udi1saXRlJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuaW1wb3J0IHsgUHJvbWlzZSB9IGZyb20gJ2JsdWViaXJkJztcblxuZXhwb3J0IGNvbnN0IHNlZWRlciA9IHtcbiAgc2VlZChvcHRpb25zKSB7XG4gICAgcmV0dXJuIChrbmV4LCBQcm9taXNlKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBLbmV4U2VlZGVyLmZyb21LbmV4Q2xpZW50KGtuZXgpXG4gICAgICAgICAgLm9uKCdlbmQnLCByZXNvbHZlKVxuICAgICAgICAgIC5vbignZXJyb3InLCByZWplY3QpXG4gICAgICAgICAgLmdlbmVyYXRlKG9wdGlvbnMpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgc2VlZGVyLnNlZWQ7XG5cbmNsYXNzIEtuZXhTZWVkZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG4gIGNvbnN0cnVjdG9yKGtuZXgpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMub3B0cyA9IHt9O1xuICAgIHRoaXMua25leCA9IGtuZXg7XG4gICAgdGhpcy5oZWFkZXJzID0gW107XG4gICAgdGhpcy5yZWNvcmRzID0gW107XG4gICAgdGhpcy5wYXJzZXIgPSBudWxsO1xuICAgIHRoaXMucXVldWUgPSBudWxsO1xuICAgIHRoaXMucmVzdWx0cyA9IFtdO1xuICB9XG5cbiAgc3RhdGljIGZyb21LbmV4Q2xpZW50KGtuZXgpIHtcbiAgICByZXR1cm4gbmV3IEtuZXhTZWVkZXIoa25leCk7XG4gIH1cblxuICBtZXJnZU9wdGlvbnMob3B0aW9ucykge1xuICAgIGxldCBvcHRzID0gb3B0aW9ucyB8fCB7fTtcbiAgICBsZXQgZGVmYXVsdHMgPSB7XG4gICAgICBmaWxlOiBudWxsLFxuICAgICAgdGFibGU6IG51bGwsXG4gICAgICBlbmNvZGluZzogJ3V0ZjgnLFxuICAgICAgcmVjb3Jkc1BlclF1ZXJ5OiAxMDAsXG4gICAgICBwYXJzZXI6IHtcbiAgICAgICAgZGVsaW1pdGVyOiAnLCcsXG4gICAgICAgIHF1b3RlOiAnXCInLFxuICAgICAgICBlc2NhcGU6ICdcXFxcJyxcbiAgICAgICAgc2tpcF9lbXB0eV9saW5lczogdHJ1ZSxcbiAgICAgICAgYXV0b19wYXJzZTogdHJ1ZVxuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gXy5tZXJnZSh7fSwgZGVmYXVsdHMsIG9wdHMpO1xuICB9XG5cbiAgZ2VuZXJhdGUob3B0aW9ucykge1xuICAgIHRoaXMub3B0cyA9IHRoaXMubWVyZ2VPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgdGhpcy5wYXJzZXIgPSBwYXJzZSh0aGlzLm9wdHMucGFyc2VyKTtcbiAgICB0aGlzLnBhcnNlci5vbigncmVhZGFibGUnLCB0aGlzLnJlYWRhYmxlLmJpbmQodGhpcykgKTtcbiAgICB0aGlzLnBhcnNlci5vbignZW5kJywgdGhpcy5lbmQuYmluZCh0aGlzKSApO1xuICAgIHRoaXMucGFyc2VyLm9uKCdlcnJvcicsIHRoaXMuZmFpbGVkLmJpbmQodGhpcykgKTtcblxuICAgIHRoaXMucXVldWUgPSBQcm9taXNlLmJpbmQodGhpcykudGhlbiggdGhpcy5jcmVhdGVDbGVhblVwUXVldWUoKSApO1xuXG4gICAgdGhpcy5jc3YgPSBmcy5jcmVhdGVSZWFkU3RyZWFtKHRoaXMub3B0cy5maWxlKTtcbiAgICB0aGlzLmNzdi5waXBlKCBpY29udi5kZWNvZGVTdHJlYW0odGhpcy5vcHRzLmVuY29kaW5nKSApLnBpcGUodGhpcy5wYXJzZXIpO1xuICB9XG5cbiAgcmVhZGFibGUoKSB7XG4gICAgbGV0IG9iaiA9IHt9O1xuICAgIGxldCByZWNvcmQgPSB0aGlzLnBhcnNlci5yZWFkKCk7XG5cbiAgICBpZiAocmVjb3JkID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyc2VyLmNvdW50IDw9IDEpIHtcbiAgICAgIHRoaXMuaGVhZGVycyA9IHJlY29yZDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZWNvcmRzLnB1c2goIHRoaXMuY3JlYXRlT2JqZWN0RnJvbShyZWNvcmQpICk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVjb3Jkcy5sZW5ndGggPCB0aGlzLm9wdHMucmVjb3Jkc1BlclF1ZXJ5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5xdWV1ZSA9IHRoaXMucXVldWUudGhlbiggdGhpcy5jcmVhdGVCdWxrSW5zZXJ0UXVldWUoKSApO1xuICB9XG4gIGVuZCgpIHtcbiAgICBpZiAodGhpcy5yZWNvcmRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMucXVldWUgPSB0aGlzLnF1ZXVlLnRoZW4oIHRoaXMuY3JlYXRlQnVsa0luc2VydFF1ZXVlKCkgKTtcbiAgICB9XG4gICAgdGhpcy5xdWV1ZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmVtaXQoJ2VuZCcsIHRoaXMucmVzdWx0cyk7XG4gICAgfSk7XG4gIH1cbiAgY3JlYXRlQ2xlYW5VcFF1ZXVlKCkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5rbmV4KHRoaXMub3B0cy50YWJsZSkuZGVsKClcbiAgICAgICAgLnRoZW4odGhpcy5zdWNjZWVkZWQuYmluZCh0aGlzKSlcbiAgICAgICAgLmNhdGNoKHRoaXMuZmFpbGVkLmJpbmQodGhpcykpO1xuICAgIH07XG4gIH1cbiAgY3JlYXRlQnVsa0luc2VydFF1ZXVlKCkge1xuICAgIGNvbnN0IHJlY29yZHMgPSB0aGlzLnJlY29yZHMuc3BsaWNlKDAsIHRoaXMub3B0cy5yZWNvcmRzUGVyUXVlcnkpO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmtuZXgodGhpcy5vcHRzLnRhYmxlKVxuICAgICAgICAuaW5zZXJ0KHJlY29yZHMpXG4gICAgICAgIC50aGVuKHRoaXMuc3VjY2VlZGVkLmJpbmQodGhpcykpXG4gICAgICAgIC5jYXRjaCh0aGlzLmZhaWxlZC5iaW5kKHRoaXMpKTtcbiAgICB9O1xuICB9XG4gIGNyZWF0ZU9iamVjdEZyb20ocmVjb3JkKSB7XG4gICAgbGV0IG9iaiA9IHt9O1xuXG4gICAgdGhpcy5oZWFkZXJzLmZvckVhY2goKGNvbHVtbiwgaSkgPT4ge1xuICAgICAgbGV0IHZhbCA9IHJlY29yZFtpXTtcblxuICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnICYmIHZhbC50b0xvd2VyQ2FzZSgpID09PSAnbnVsbCcpIHtcbiAgICAgICAgdmFsID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIG9ialtjb2x1bW5dID0gdmFsO1xuICAgIH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH1cbiAgc3VjY2VlZGVkKHJlcykge1xuICAgIHRoaXMucmVzdWx0cy5wdXNoKHJlcyk7XG4gIH1cbiAgZmFpbGVkKGVycikge1xuICAgIHRoaXMuY3N2LmVuZCgpO1xuICAgIHRoaXMuY3N2LnVucGlwZSgpO1xuICAgIHRoaXMuZW1pdCgnZXJyb3InLCBlcnIpO1xuICB9XG59XG4iXX0=