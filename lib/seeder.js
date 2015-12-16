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
      var _this2 = this;

      this.opts = this.mergeOptions(options);
      this.queue = _bluebird.Promise.bind(this).then(function () {
        return _this2.knex(_this2.opts.table).del().then(_this2.stackResult.bind(_this2));
      });
      this.parser = (0, _csvParse2.default)(this.opts.parser);
      this.parser.on('readable', this.readable.bind(this));
      this.parser.on('end', this.end.bind(this));
      this.parser.on('error', this.error.bind(this));

      var csv = _fs2.default.createReadStream(this.opts.file);
      csv.pipe(_iconvLite2.default.decodeStream(this.opts.encoding)).pipe(this.parser);
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
        //TODO add options
        return;
      }
      this.queue = this.queue.then(this.createQueue());
    }
  }, {
    key: 'end',
    value: function end() {
      var _this3 = this;

      if (this.records.length > 0) {
        this.queue = this.queue.then(this.createQueue());
      }
      this.queue.then(function () {
        return _this3.emit('end', _this3.results);
      });
    }
  }, {
    key: 'createQueue',
    value: function createQueue() {
      var _this4 = this;

      return function () {
        return _this4.knex(_this4.opts.table).insert(_this4.records.splice(0, _this4.opts.recordsPerQuery)).then(_this4.stackResult.bind(_this4));
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
    key: 'stackResult',
    value: function stackResult(res) {
      this.results.push(res);
    }
  }, {
    key: 'error',
    value: function error(err) {
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
//# sourceMappingURL=data:application/json;base64,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bSAnZnMnO1xuaW1wb3J0IHBhcnNlIGZyb20gJ2Nzdi1wYXJzZSc7XG5pbXBvcnQgaWNvbnYgZnJvbSAnaWNvbnYtbGl0ZSc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcbmltcG9ydCB7IFByb21pc2UgfSBmcm9tICdibHVlYmlyZCc7XG5cbmV4cG9ydCBjb25zdCBzZWVkZXIgPSB7XG4gIHNlZWQob3B0aW9ucykge1xuICAgIHJldHVybiAoa25leCwgUHJvbWlzZSkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgS25leFNlZWRlci5mcm9tS25leENsaWVudChrbmV4KVxuICAgICAgICAgIC5vbignZW5kJywgcmVzb2x2ZSlcbiAgICAgICAgICAub24oJ2Vycm9yJywgcmVqZWN0KVxuICAgICAgICAgIC5nZW5lcmF0ZShvcHRpb25zKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNlZWRlci5zZWVkO1xuXG5jbGFzcyBLbmV4U2VlZGVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuICBjb25zdHJ1Y3RvcihrbmV4KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLm9wdHMgPSB7fTtcbiAgICB0aGlzLmtuZXggPSBrbmV4O1xuICAgIHRoaXMuaGVhZGVycyA9IFtdO1xuICAgIHRoaXMucmVjb3JkcyA9IFtdO1xuICAgIHRoaXMucGFyc2VyID0gbnVsbDtcbiAgICB0aGlzLnF1ZXVlID0gbnVsbDtcbiAgICB0aGlzLnJlc3VsdHMgPSBbXTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tS25leENsaWVudChrbmV4KSB7XG4gICAgcmV0dXJuIG5ldyBLbmV4U2VlZGVyKGtuZXgpO1xuICB9XG5cbiAgbWVyZ2VPcHRpb25zKG9wdGlvbnMpIHtcbiAgICBsZXQgb3B0cyA9IG9wdGlvbnMgfHwge307XG4gICAgbGV0IGRlZmF1bHRzID0ge1xuICAgICAgZmlsZTogbnVsbCxcbiAgICAgIHRhYmxlOiBudWxsLFxuICAgICAgZW5jb2Rpbmc6ICd1dGY4JyxcbiAgICAgIHJlY29yZHNQZXJRdWVyeTogMTAwLFxuICAgICAgcGFyc2VyOiB7XG4gICAgICAgIGRlbGltaXRlcjogJywnLFxuICAgICAgICBxdW90ZTogJ1wiJyxcbiAgICAgICAgZXNjYXBlOiAnXFxcXCcsXG4gICAgICAgIHNraXBfZW1wdHlfbGluZXM6IHRydWUsXG4gICAgICAgIGF1dG9fcGFyc2U6IHRydWVcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIF8ubWVyZ2Uoe30sIGRlZmF1bHRzLCBvcHRzKTtcbiAgfVxuXG4gIGdlbmVyYXRlKG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdHMgPSB0aGlzLm1lcmdlT3B0aW9ucyhvcHRpb25zKTtcbiAgICB0aGlzLnF1ZXVlID0gUHJvbWlzZS5iaW5kKHRoaXMpLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMua25leCh0aGlzLm9wdHMudGFibGUpLmRlbCgpLnRoZW4odGhpcy5zdGFja1Jlc3VsdC5iaW5kKHRoaXMpKTtcbiAgICB9KTtcbiAgICB0aGlzLnBhcnNlciA9IHBhcnNlKHRoaXMub3B0cy5wYXJzZXIpO1xuICAgIHRoaXMucGFyc2VyLm9uKCdyZWFkYWJsZScsIHRoaXMucmVhZGFibGUuYmluZCh0aGlzKSApO1xuICAgIHRoaXMucGFyc2VyLm9uKCdlbmQnLCB0aGlzLmVuZC5iaW5kKHRoaXMpICk7XG4gICAgdGhpcy5wYXJzZXIub24oJ2Vycm9yJywgdGhpcy5lcnJvci5iaW5kKHRoaXMpICk7XG5cbiAgICBsZXQgY3N2ID0gZnMuY3JlYXRlUmVhZFN0cmVhbSh0aGlzLm9wdHMuZmlsZSk7XG4gICAgY3N2LnBpcGUoIGljb252LmRlY29kZVN0cmVhbSh0aGlzLm9wdHMuZW5jb2RpbmcpICkucGlwZSh0aGlzLnBhcnNlcik7XG4gIH1cblxuICByZWFkYWJsZSgpIHtcbiAgICBsZXQgb2JqID0ge307XG4gICAgbGV0IHJlY29yZCA9IHRoaXMucGFyc2VyLnJlYWQoKTtcblxuICAgIGlmIChyZWNvcmQgPT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJzZXIuY291bnQgPD0gMSkge1xuICAgICAgdGhpcy5oZWFkZXJzID0gcmVjb3JkO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlY29yZHMucHVzaCggdGhpcy5jcmVhdGVPYmplY3RGcm9tKHJlY29yZCkgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZWNvcmRzLmxlbmd0aCA8IHRoaXMub3B0cy5yZWNvcmRzUGVyUXVlcnkpIHsgLy9UT0RPIGFkZCBvcHRpb25zXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucXVldWUgPSB0aGlzLnF1ZXVlLnRoZW4oIHRoaXMuY3JlYXRlUXVldWUoKSApO1xuICB9XG4gIGVuZCgpIHtcbiAgICBpZiAodGhpcy5yZWNvcmRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMucXVldWUgPSB0aGlzLnF1ZXVlLnRoZW4oIHRoaXMuY3JlYXRlUXVldWUoKSApO1xuICAgIH1cbiAgICB0aGlzLnF1ZXVlLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuZW1pdCgnZW5kJywgdGhpcy5yZXN1bHRzKTtcbiAgICB9KTtcbiAgfVxuICBjcmVhdGVRdWV1ZSgpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMua25leCh0aGlzLm9wdHMudGFibGUpXG4gICAgICAgIC5pbnNlcnQodGhpcy5yZWNvcmRzLnNwbGljZSgwLCB0aGlzLm9wdHMucmVjb3Jkc1BlclF1ZXJ5KSlcbiAgICAgICAgLnRoZW4odGhpcy5zdGFja1Jlc3VsdC5iaW5kKHRoaXMpKTtcbiAgICB9O1xuICB9XG4gIGNyZWF0ZU9iamVjdEZyb20ocmVjb3JkKSB7XG4gICAgbGV0IG9iaiA9IHt9O1xuXG4gICAgdGhpcy5oZWFkZXJzLmZvckVhY2goKGNvbHVtbiwgaSkgPT4ge1xuICAgICAgbGV0IHZhbCA9IHJlY29yZFtpXTtcblxuICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnICYmIHZhbC50b0xvd2VyQ2FzZSgpID09PSAnbnVsbCcpIHtcbiAgICAgICAgdmFsID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIG9ialtjb2x1bW5dID0gdmFsO1xuICAgIH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH1cbiAgc3RhY2tSZXN1bHQocmVzKSB7XG4gICAgdGhpcy5yZXN1bHRzLnB1c2gocmVzKTtcbiAgfVxuICBlcnJvcihlcnIpIHtcbiAgICB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgfVxufVxuIl19