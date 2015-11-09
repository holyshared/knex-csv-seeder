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
    _this.parser = (0, _csvParse2.default)({
      delimiter: ',',
      skip_empty_lines: true,
      auto_parse: true
    });
    return _this;
  }

  _createClass(KnexSeeder, [{
    key: 'mergeOptions',
    value: function mergeOptions(options) {
      var opts = options || {};
      var defaults = {
        file: null,
        table: null,
        encoding: 'utf8'
      };

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(opts)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var k = _step.value;

          defaults[k] = opts[k];
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return defaults;
    }
  }, {
    key: 'generate',
    value: function generate(options) {
      this.opts = this.mergeOptions(options);
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
        this.headers.forEach(function (column, i) {
          var val = record[i] || null;

          if (typeof val === 'string' && val.toLowerCase() === 'null') {
            val = null;
          }
          obj[column] = val;
        });
        this.records.push(obj);
      }
    }
  }, {
    key: 'end',
    value: function end() {
      var queues = [this.knex(this.opts.table).del(), this.knex(this.opts.table).insert(this.records)];
      this.emit('end', _bluebird.Promise.join.apply(_bluebird.Promise, queues));
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
//# sourceMappingURL=data:application/json;base64,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LFlBQVkiLCJmaWxlIjoic2VlZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXJzZSBmcm9tICdjc3YtcGFyc2UnO1xuaW1wb3J0IGljb252IGZyb20gJ2ljb252LWxpdGUnO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcbmltcG9ydCB7IFByb21pc2UgfSBmcm9tICdibHVlYmlyZCc7XG5cbmV4cG9ydCBjb25zdCBzZWVkZXIgPSB7XG4gIHNlZWQob3B0aW9ucykge1xuICAgIHJldHVybiAoa25leCwgUHJvbWlzZSkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgS25leFNlZWRlci5mcm9tS25leENsaWVudChrbmV4KVxuICAgICAgICAgIC5vbignZW5kJywgcmVzb2x2ZSlcbiAgICAgICAgICAub24oJ2Vycm9yJywgcmVqZWN0KVxuICAgICAgICAgIC5nZW5lcmF0ZShvcHRpb25zKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNlZWRlci5zZWVkO1xuXG5jbGFzcyBLbmV4U2VlZGVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuICBjb25zdHJ1Y3RvcihrbmV4KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLm9wdHMgPSB7fTtcbiAgICB0aGlzLmtuZXggPSBrbmV4O1xuICAgIHRoaXMuaGVhZGVycyA9IFtdO1xuICAgIHRoaXMucmVjb3JkcyA9IFtdO1xuICAgIHRoaXMucGFyc2VyID0gcGFyc2Uoe1xuICAgICAgZGVsaW1pdGVyOiAnLCcsXG4gICAgICBza2lwX2VtcHR5X2xpbmVzOiB0cnVlLFxuICAgICAgYXV0b19wYXJzZTogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGZyb21LbmV4Q2xpZW50KGtuZXgpIHtcbiAgICByZXR1cm4gbmV3IEtuZXhTZWVkZXIoa25leCk7XG4gIH1cblxuICBtZXJnZU9wdGlvbnMob3B0aW9ucykge1xuICAgIGxldCBvcHRzID0gb3B0aW9ucyB8fCB7fTtcbiAgICBsZXQgZGVmYXVsdHMgPSB7XG4gICAgICBmaWxlOiBudWxsLFxuICAgICAgdGFibGU6IG51bGwsXG4gICAgICBlbmNvZGluZzogJ3V0ZjgnXG4gICAgfTtcblxuICAgIGZvciAobGV0IGsgb2YgT2JqZWN0LmtleXMob3B0cykpIHtcbiAgICAgIGRlZmF1bHRzW2tdID0gb3B0c1trXTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGVmYXVsdHM7XG4gIH1cblxuICBnZW5lcmF0ZShvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRzID0gdGhpcy5tZXJnZU9wdGlvbnMob3B0aW9ucyk7XG4gICAgdGhpcy5wYXJzZXIub24oJ3JlYWRhYmxlJywgdGhpcy5yZWFkYWJsZS5iaW5kKHRoaXMpICk7XG4gICAgdGhpcy5wYXJzZXIub24oJ2VuZCcsIHRoaXMuZW5kLmJpbmQodGhpcykgKTtcbiAgICB0aGlzLnBhcnNlci5vbignZXJyb3InLCB0aGlzLmVycm9yLmJpbmQodGhpcykgKTtcblxuICAgIGxldCBjc3YgPSBmcy5jcmVhdGVSZWFkU3RyZWFtKHRoaXMub3B0cy5maWxlKTtcbiAgICBjc3YucGlwZSggaWNvbnYuZGVjb2RlU3RyZWFtKHRoaXMub3B0cy5lbmNvZGluZykgKS5waXBlKHRoaXMucGFyc2VyKTtcbiAgfVxuXG4gIHJlYWRhYmxlKCkge1xuICAgIGxldCBvYmogPSB7fTtcbiAgICBsZXQgcmVjb3JkID0gdGhpcy5wYXJzZXIucmVhZCgpO1xuXG4gICAgaWYgKHJlY29yZCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhcnNlci5jb3VudCA8PSAxKSB7XG4gICAgICB0aGlzLmhlYWRlcnMgPSByZWNvcmQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGVhZGVycy5mb3JFYWNoKChjb2x1bW4sIGkpID0+IHtcbiAgICAgICAgbGV0IHZhbCA9IHJlY29yZFtpXSB8fCBudWxsO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJyAmJiB2YWwudG9Mb3dlckNhc2UoKSA9PT0gJ251bGwnKSB7XG4gICAgICAgICAgdmFsID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBvYmpbY29sdW1uXSA9IHZhbDtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5yZWNvcmRzLnB1c2gob2JqKTtcbiAgICB9XG4gIH1cbiAgZW5kKCkge1xuICAgIGNvbnN0IHF1ZXVlcyA9IFtcbiAgICAgIHRoaXMua25leCh0aGlzLm9wdHMudGFibGUpLmRlbCgpLFxuICAgICAgdGhpcy5rbmV4KHRoaXMub3B0cy50YWJsZSkuaW5zZXJ0KHRoaXMucmVjb3JkcylcbiAgICBdO1xuICAgIHRoaXMuZW1pdCgnZW5kJywgUHJvbWlzZS5qb2luLmFwcGx5KFByb21pc2UsIHF1ZXVlcykpO1xuICB9XG4gIGVycm9yKGVycikge1xuICAgIHRoaXMuZW1pdCgnZXJyb3InLCBlcnIpO1xuICB9XG59XG4iXX0=