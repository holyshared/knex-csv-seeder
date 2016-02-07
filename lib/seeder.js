'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

var KnexSeeder = function (_EventEmitter) {
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
    _this.onReadable = _this.onReadable.bind(_this);
    _this.onEnd = _this.onEnd.bind(_this);
    _this.onSucceeded = _this.onSucceeded.bind(_this);
    _this.onFailed = _this.onFailed.bind(_this);
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
      this.parser.on('readable', this.onReadable);
      this.parser.on('end', this.onEnd);
      this.parser.on('error', this.onFailed);

      this.queue = _bluebird.Promise.bind(this).then(this.createCleanUpQueue());

      this.csv = _fs2.default.createReadStream(this.opts.file);
      this.csv.pipe(_iconvLite2.default.decodeStream(this.opts.encoding)).pipe(this.parser);
    }
  }, {
    key: 'onReadable',
    value: function onReadable() {
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
    key: 'onEnd',
    value: function onEnd() {
      var _this2 = this;

      if (this.records.length > 0) {
        this.queue = this.queue.then(this.createBulkInsertQueue());
      }
      this.queue.then(function () {
        return _this2.emit('end', _this2.results);
      }).catch(this.onFailed);
    }
  }, {
    key: 'createCleanUpQueue',
    value: function createCleanUpQueue() {
      var _this3 = this;

      return function () {
        return _this3.knex(_this3.opts.table).del().then(_this3.onSucceeded).catch(_this3.onFailed);
      };
    }
  }, {
    key: 'createBulkInsertQueue',
    value: function createBulkInsertQueue() {
      var _this4 = this;

      var records = this.records.splice(0, this.opts.recordsPerQuery);

      return function () {
        return _this4.knex(_this4.opts.table).insert(records).then(_this4.onSucceeded).catch(_this4.onFailed);
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
    key: 'onSucceeded',
    value: function onSucceeded(res) {
      this.results.push(res);
    }
  }, {
    key: 'onFailed',
    value: function onFailed(err) {
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
}(_events.EventEmitter);
//# sourceMappingURL=data:application/json;base64,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Ozs0Q0FPRzs7O0FBQ3RCLFVBQU0sVUFBVSxLQUFLLE9BQUwsQ0FBYSxNQUFiLENBQW9CLENBQXBCLEVBQXVCLEtBQUssSUFBTCxDQUFVLGVBQVYsQ0FBakMsQ0FEZ0I7O0FBR3RCLGFBQU8sWUFBTTtBQUNYLGVBQU8sT0FBSyxJQUFMLENBQVUsT0FBSyxJQUFMLENBQVUsS0FBVixDQUFWLENBQ0osTUFESSxDQUNHLE9BREgsRUFFSixJQUZJLENBRUMsT0FBSyxXQUFMLENBRkQsQ0FHSixLQUhJLENBR0UsT0FBSyxRQUFMLENBSFQsQ0FEVztPQUFOLENBSGU7Ozs7cUNBVVAsUUFBUTtBQUN2QixVQUFJLE1BQU0sRUFBTixDQURtQjs7QUFHdkIsV0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixVQUFDLE1BQUQsRUFBUyxDQUFULEVBQWU7QUFDbEMsWUFBSSxNQUFNLE9BQU8sQ0FBUCxDQUFOLENBRDhCOztBQUdsQyxZQUFJLE9BQU8sR0FBUCxLQUFlLFFBQWYsSUFBMkIsSUFBSSxXQUFKLE9BQXNCLE1BQXRCLEVBQThCO0FBQzNELGdCQUFNLElBQU4sQ0FEMkQ7U0FBN0Q7QUFHQSxZQUFJLE1BQUosSUFBYyxHQUFkLENBTmtDO09BQWYsQ0FBckIsQ0FIdUI7QUFXdkIsYUFBTyxHQUFQLENBWHVCOzs7O2dDQWFiLEtBQUs7QUFDZixXQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLEdBQWxCLEVBRGU7Ozs7NkJBR1IsS0FBSztBQUNaLFdBQUssR0FBTCxDQUFTLE1BQVQsR0FEWTtBQUVaLFdBQUssSUFBTCxDQUFVLE9BQVYsRUFBbUIsR0FBbkIsRUFGWTs7OzttQ0FsR1EsTUFBTTtBQUMxQixhQUFPLElBQUksVUFBSixDQUFlLElBQWYsQ0FBUCxDQUQwQjs7OztTQWpCeEIiLCJmaWxlIjoic2VlZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXJzZSBmcm9tICdjc3YtcGFyc2UnO1xuaW1wb3J0IGljb252IGZyb20gJ2ljb252LWxpdGUnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgeyBQcm9taXNlIH0gZnJvbSAnYmx1ZWJpcmQnO1xuXG5leHBvcnQgY29uc3Qgc2VlZGVyID0ge1xuICBzZWVkKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gKGtuZXgsIFByb21pc2UpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIEtuZXhTZWVkZXIuZnJvbUtuZXhDbGllbnQoa25leClcbiAgICAgICAgICAub24oJ2VuZCcsIHJlc29sdmUpXG4gICAgICAgICAgLm9uKCdlcnJvcicsIHJlamVjdClcbiAgICAgICAgICAuZ2VuZXJhdGUob3B0aW9ucyk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzZWVkZXIuc2VlZDtcblxuY2xhc3MgS25leFNlZWRlciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cbiAgY29uc3RydWN0b3Ioa25leCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5vcHRzID0ge307XG4gICAgdGhpcy5rbmV4ID0ga25leDtcbiAgICB0aGlzLmhlYWRlcnMgPSBbXTtcbiAgICB0aGlzLnJlY29yZHMgPSBbXTtcbiAgICB0aGlzLnBhcnNlciA9IG51bGw7XG4gICAgdGhpcy5xdWV1ZSA9IG51bGw7XG4gICAgdGhpcy5yZXN1bHRzID0gW107XG4gICAgdGhpcy5vblJlYWRhYmxlID0gdGhpcy5vblJlYWRhYmxlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vbkVuZCA9IHRoaXMub25FbmQuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uU3VjY2VlZGVkID0gdGhpcy5vblN1Y2NlZWRlZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25GYWlsZWQgPSB0aGlzLm9uRmFpbGVkLmJpbmQodGhpcyk7XG4gIH1cblxuICBzdGF0aWMgZnJvbUtuZXhDbGllbnQoa25leCkge1xuICAgIHJldHVybiBuZXcgS25leFNlZWRlcihrbmV4KTtcbiAgfVxuXG4gIG1lcmdlT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgbGV0IG9wdHMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGxldCBkZWZhdWx0cyA9IHtcbiAgICAgIGZpbGU6IG51bGwsXG4gICAgICB0YWJsZTogbnVsbCxcbiAgICAgIGVuY29kaW5nOiAndXRmOCcsXG4gICAgICByZWNvcmRzUGVyUXVlcnk6IDEwMCxcbiAgICAgIHBhcnNlcjoge1xuICAgICAgICBkZWxpbWl0ZXI6ICcsJyxcbiAgICAgICAgcXVvdGU6ICdcIicsXG4gICAgICAgIGVzY2FwZTogJ1xcXFwnLFxuICAgICAgICBza2lwX2VtcHR5X2xpbmVzOiB0cnVlLFxuICAgICAgICBhdXRvX3BhcnNlOiB0cnVlXG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBfLm1lcmdlKHt9LCBkZWZhdWx0cywgb3B0cyk7XG4gIH1cblxuICBnZW5lcmF0ZShvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRzID0gdGhpcy5tZXJnZU9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICB0aGlzLnBhcnNlciA9IHBhcnNlKHRoaXMub3B0cy5wYXJzZXIpO1xuICAgIHRoaXMucGFyc2VyLm9uKCdyZWFkYWJsZScsIHRoaXMub25SZWFkYWJsZSk7XG4gICAgdGhpcy5wYXJzZXIub24oJ2VuZCcsIHRoaXMub25FbmQpO1xuICAgIHRoaXMucGFyc2VyLm9uKCdlcnJvcicsIHRoaXMub25GYWlsZWQpO1xuXG4gICAgdGhpcy5xdWV1ZSA9IFByb21pc2UuYmluZCh0aGlzKS50aGVuKCB0aGlzLmNyZWF0ZUNsZWFuVXBRdWV1ZSgpICk7XG5cbiAgICB0aGlzLmNzdiA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0odGhpcy5vcHRzLmZpbGUpO1xuICAgIHRoaXMuY3N2LnBpcGUoIGljb252LmRlY29kZVN0cmVhbSh0aGlzLm9wdHMuZW5jb2RpbmcpICkucGlwZSh0aGlzLnBhcnNlcik7XG4gIH1cblxuICBvblJlYWRhYmxlKCkge1xuICAgIGxldCBvYmogPSB7fTtcbiAgICBsZXQgcmVjb3JkID0gdGhpcy5wYXJzZXIucmVhZCgpO1xuXG4gICAgaWYgKHJlY29yZCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhcnNlci5jb3VudCA8PSAxKSB7XG4gICAgICB0aGlzLmhlYWRlcnMgPSByZWNvcmQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVjb3Jkcy5wdXNoKCB0aGlzLmNyZWF0ZU9iamVjdEZyb20ocmVjb3JkKSApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlY29yZHMubGVuZ3RoIDwgdGhpcy5vcHRzLnJlY29yZHNQZXJRdWVyeSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucXVldWUgPSB0aGlzLnF1ZXVlLnRoZW4oIHRoaXMuY3JlYXRlQnVsa0luc2VydFF1ZXVlKCkgKTtcbiAgfVxuICBvbkVuZCgpIHtcbiAgICBpZiAodGhpcy5yZWNvcmRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMucXVldWUgPSB0aGlzLnF1ZXVlLnRoZW4oIHRoaXMuY3JlYXRlQnVsa0luc2VydFF1ZXVlKCkgKTtcbiAgICB9XG4gICAgdGhpcy5xdWV1ZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmVtaXQoJ2VuZCcsIHRoaXMucmVzdWx0cyk7XG4gICAgfSkuY2F0Y2godGhpcy5vbkZhaWxlZCk7XG4gIH1cbiAgY3JlYXRlQ2xlYW5VcFF1ZXVlKCkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5rbmV4KHRoaXMub3B0cy50YWJsZSkuZGVsKClcbiAgICAgICAgLnRoZW4odGhpcy5vblN1Y2NlZWRlZClcbiAgICAgICAgLmNhdGNoKHRoaXMub25GYWlsZWQpO1xuICAgIH07XG4gIH1cbiAgY3JlYXRlQnVsa0luc2VydFF1ZXVlKCkge1xuICAgIGNvbnN0IHJlY29yZHMgPSB0aGlzLnJlY29yZHMuc3BsaWNlKDAsIHRoaXMub3B0cy5yZWNvcmRzUGVyUXVlcnkpO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmtuZXgodGhpcy5vcHRzLnRhYmxlKVxuICAgICAgICAuaW5zZXJ0KHJlY29yZHMpXG4gICAgICAgIC50aGVuKHRoaXMub25TdWNjZWVkZWQpXG4gICAgICAgIC5jYXRjaCh0aGlzLm9uRmFpbGVkKTtcbiAgICB9O1xuICB9XG4gIGNyZWF0ZU9iamVjdEZyb20ocmVjb3JkKSB7XG4gICAgbGV0IG9iaiA9IHt9O1xuXG4gICAgdGhpcy5oZWFkZXJzLmZvckVhY2goKGNvbHVtbiwgaSkgPT4ge1xuICAgICAgbGV0IHZhbCA9IHJlY29yZFtpXTtcblxuICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnICYmIHZhbC50b0xvd2VyQ2FzZSgpID09PSAnbnVsbCcpIHtcbiAgICAgICAgdmFsID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIG9ialtjb2x1bW5dID0gdmFsO1xuICAgIH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH1cbiAgb25TdWNjZWVkZWQocmVzKSB7XG4gICAgdGhpcy5yZXN1bHRzLnB1c2gocmVzKTtcbiAgfVxuICBvbkZhaWxlZChlcnIpIHtcbiAgICB0aGlzLmNzdi51bnBpcGUoKTtcbiAgICB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgfVxufVxuIl19