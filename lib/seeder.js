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
})(_events.EventEmitter);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZWVkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9PLElBQU0sTUFBTSxXQUFOLE1BQU0sR0FBRztBQUNwQixNQUFJLGdCQUFDLE9BQU8sRUFBRTtBQUNaLFdBQU8sVUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFLO0FBQ3hCLGFBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ3RDLGtCQUFVLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUM1QixFQUFFLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUNsQixFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUNuQixRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7T0FDdEIsQ0FBQyxDQUFDO0tBQ0osQ0FBQztHQUNIO0NBQ0YsQ0FBQzs7a0JBRWEsTUFBTSxDQUFDLElBQUk7O0lBRXBCLFVBQVU7WUFBVixVQUFVOztBQUVkLFdBRkksVUFBVSxDQUVGLElBQUksRUFBRTswQkFGZCxVQUFVOzt1RUFBVixVQUFVOztBQUlaLFVBQUssSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNmLFVBQUssSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixVQUFLLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDbEIsVUFBSyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFVBQUssTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixVQUFLLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsVUFBSyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFVBQUssVUFBVSxHQUFHLE1BQUssVUFBVSxDQUFDLElBQUksT0FBTSxDQUFDO0FBQzdDLFVBQUssS0FBSyxHQUFHLE1BQUssS0FBSyxDQUFDLElBQUksT0FBTSxDQUFDO0FBQ25DLFVBQUssV0FBVyxHQUFHLE1BQUssV0FBVyxDQUFDLElBQUksT0FBTSxDQUFDO0FBQy9DLFVBQUssUUFBUSxHQUFHLE1BQUssUUFBUSxDQUFDLElBQUksT0FBTSxDQUFDOztHQUMxQzs7ZUFmRyxVQUFVOztpQ0FxQkQsT0FBTyxFQUFFO0FBQ3BCLFVBQUksSUFBSSxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7QUFDekIsVUFBSSxRQUFRLEdBQUc7QUFDYixZQUFJLEVBQUUsSUFBSTtBQUNWLGFBQUssRUFBRSxJQUFJO0FBQ1gsZ0JBQVEsRUFBRSxNQUFNO0FBQ2hCLHVCQUFlLEVBQUUsR0FBRztBQUNwQixjQUFNLEVBQUU7QUFDTixtQkFBUyxFQUFFLEdBQUc7QUFDZCxlQUFLLEVBQUUsR0FBRztBQUNWLGdCQUFNLEVBQUUsSUFBSTtBQUNaLDBCQUFnQixFQUFFLElBQUk7QUFDdEIsb0JBQVUsRUFBRSxJQUFJO1NBQ2pCO09BQ0YsQ0FBQzs7QUFFRixhQUFPLGlCQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3BDOzs7NkJBRVEsT0FBTyxFQUFFO0FBQ2hCLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFdkMsVUFBSSxDQUFDLE1BQU0sR0FBRyx3QkFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RDLFVBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDNUMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUV2QyxVQUFJLENBQUMsS0FBSyxHQUFHLFVBakVSLE9BQU8sQ0FpRVMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBRSxDQUFDOztBQUVsRSxVQUFJLENBQUMsR0FBRyxHQUFHLGFBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQyxVQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBRSxvQkFBTSxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDM0U7OztpQ0FFWTtBQUNYLFVBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNiLFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRWhDLFVBQUksTUFBTSxLQUFLLElBQUksRUFBRTtBQUNuQixlQUFPO09BQ1I7O0FBRUQsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxDQUFDLEVBQUU7QUFDMUIsWUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7T0FDdkIsTUFBTTtBQUNMLFlBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBRSxDQUFDO09BQ3BEOztBQUVELFVBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7QUFDbkQsZUFBTztPQUNSOztBQUVELFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUUsQ0FBQztLQUM5RDs7OzRCQUNPOzs7QUFDTixVQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUMzQixZQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFFLENBQUM7T0FDOUQ7QUFDRCxVQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFNO0FBQ3BCLGVBQU8sT0FBSyxJQUFJLENBQUMsS0FBSyxFQUFFLE9BQUssT0FBTyxDQUFDLENBQUM7T0FDdkMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDekI7Ozt5Q0FDb0I7OztBQUNuQixhQUFPLFlBQU07QUFDWCxlQUFPLE9BQUssSUFBSSxDQUFDLE9BQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUNwQyxJQUFJLENBQUMsT0FBSyxXQUFXLENBQUMsQ0FDdEIsS0FBSyxDQUFDLE9BQUssUUFBUSxDQUFDLENBQUM7T0FDekIsQ0FBQztLQUNIOzs7NENBQ3VCOzs7QUFDdEIsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7O0FBRWxFLGFBQU8sWUFBTTtBQUNYLGVBQU8sT0FBSyxJQUFJLENBQUMsT0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQzlCLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FDZixJQUFJLENBQUMsT0FBSyxXQUFXLENBQUMsQ0FDdEIsS0FBSyxDQUFDLE9BQUssUUFBUSxDQUFDLENBQUM7T0FDekIsQ0FBQztLQUNIOzs7cUNBQ2dCLE1BQU0sRUFBRTtBQUN2QixVQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7O0FBRWIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNLEVBQUUsQ0FBQyxFQUFLO0FBQ2xDLFlBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFcEIsWUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLElBQUksR0FBRyxDQUFDLFdBQVcsRUFBRSxLQUFLLE1BQU0sRUFBRTtBQUMzRCxhQUFHLEdBQUcsSUFBSSxDQUFDO1NBQ1o7QUFDRCxXQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDO09BQ25CLENBQUMsQ0FBQztBQUNILGFBQU8sR0FBRyxDQUFDO0tBQ1o7OztnQ0FDVyxHQUFHLEVBQUU7QUFDZixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUN4Qjs7OzZCQUNRLEdBQUcsRUFBRTtBQUNaLFVBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbEIsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDekI7OzttQ0FyR3FCLElBQUksRUFBRTtBQUMxQixhQUFPLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzdCOzs7U0FuQkcsVUFBVTtXQWxCUCxZQUFZIiwiZmlsZSI6InNlZWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGFyc2UgZnJvbSAnY3N2LXBhcnNlJztcbmltcG9ydCBpY29udiBmcm9tICdpY29udi1saXRlJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuaW1wb3J0IHsgUHJvbWlzZSB9IGZyb20gJ2JsdWViaXJkJztcblxuZXhwb3J0IGNvbnN0IHNlZWRlciA9IHtcbiAgc2VlZChvcHRpb25zKSB7XG4gICAgcmV0dXJuIChrbmV4LCBQcm9taXNlKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBLbmV4U2VlZGVyLmZyb21LbmV4Q2xpZW50KGtuZXgpXG4gICAgICAgICAgLm9uKCdlbmQnLCByZXNvbHZlKVxuICAgICAgICAgIC5vbignZXJyb3InLCByZWplY3QpXG4gICAgICAgICAgLmdlbmVyYXRlKG9wdGlvbnMpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgc2VlZGVyLnNlZWQ7XG5cbmNsYXNzIEtuZXhTZWVkZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG4gIGNvbnN0cnVjdG9yKGtuZXgpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMub3B0cyA9IHt9O1xuICAgIHRoaXMua25leCA9IGtuZXg7XG4gICAgdGhpcy5oZWFkZXJzID0gW107XG4gICAgdGhpcy5yZWNvcmRzID0gW107XG4gICAgdGhpcy5wYXJzZXIgPSBudWxsO1xuICAgIHRoaXMucXVldWUgPSBudWxsO1xuICAgIHRoaXMucmVzdWx0cyA9IFtdO1xuICAgIHRoaXMub25SZWFkYWJsZSA9IHRoaXMub25SZWFkYWJsZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25FbmQgPSB0aGlzLm9uRW5kLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vblN1Y2NlZWRlZCA9IHRoaXMub25TdWNjZWVkZWQuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uRmFpbGVkID0gdGhpcy5vbkZhaWxlZC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgc3RhdGljIGZyb21LbmV4Q2xpZW50KGtuZXgpIHtcbiAgICByZXR1cm4gbmV3IEtuZXhTZWVkZXIoa25leCk7XG4gIH1cblxuICBtZXJnZU9wdGlvbnMob3B0aW9ucykge1xuICAgIGxldCBvcHRzID0gb3B0aW9ucyB8fCB7fTtcbiAgICBsZXQgZGVmYXVsdHMgPSB7XG4gICAgICBmaWxlOiBudWxsLFxuICAgICAgdGFibGU6IG51bGwsXG4gICAgICBlbmNvZGluZzogJ3V0ZjgnLFxuICAgICAgcmVjb3Jkc1BlclF1ZXJ5OiAxMDAsXG4gICAgICBwYXJzZXI6IHtcbiAgICAgICAgZGVsaW1pdGVyOiAnLCcsXG4gICAgICAgIHF1b3RlOiAnXCInLFxuICAgICAgICBlc2NhcGU6ICdcXFxcJyxcbiAgICAgICAgc2tpcF9lbXB0eV9saW5lczogdHJ1ZSxcbiAgICAgICAgYXV0b19wYXJzZTogdHJ1ZVxuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gXy5tZXJnZSh7fSwgZGVmYXVsdHMsIG9wdHMpO1xuICB9XG5cbiAgZ2VuZXJhdGUob3B0aW9ucykge1xuICAgIHRoaXMub3B0cyA9IHRoaXMubWVyZ2VPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgdGhpcy5wYXJzZXIgPSBwYXJzZSh0aGlzLm9wdHMucGFyc2VyKTtcbiAgICB0aGlzLnBhcnNlci5vbigncmVhZGFibGUnLCB0aGlzLm9uUmVhZGFibGUpO1xuICAgIHRoaXMucGFyc2VyLm9uKCdlbmQnLCB0aGlzLm9uRW5kKTtcbiAgICB0aGlzLnBhcnNlci5vbignZXJyb3InLCB0aGlzLm9uRmFpbGVkKTtcblxuICAgIHRoaXMucXVldWUgPSBQcm9taXNlLmJpbmQodGhpcykudGhlbiggdGhpcy5jcmVhdGVDbGVhblVwUXVldWUoKSApO1xuXG4gICAgdGhpcy5jc3YgPSBmcy5jcmVhdGVSZWFkU3RyZWFtKHRoaXMub3B0cy5maWxlKTtcbiAgICB0aGlzLmNzdi5waXBlKCBpY29udi5kZWNvZGVTdHJlYW0odGhpcy5vcHRzLmVuY29kaW5nKSApLnBpcGUodGhpcy5wYXJzZXIpO1xuICB9XG5cbiAgb25SZWFkYWJsZSgpIHtcbiAgICBsZXQgb2JqID0ge307XG4gICAgbGV0IHJlY29yZCA9IHRoaXMucGFyc2VyLnJlYWQoKTtcblxuICAgIGlmIChyZWNvcmQgPT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJzZXIuY291bnQgPD0gMSkge1xuICAgICAgdGhpcy5oZWFkZXJzID0gcmVjb3JkO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlY29yZHMucHVzaCggdGhpcy5jcmVhdGVPYmplY3RGcm9tKHJlY29yZCkgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZWNvcmRzLmxlbmd0aCA8IHRoaXMub3B0cy5yZWNvcmRzUGVyUXVlcnkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnF1ZXVlID0gdGhpcy5xdWV1ZS50aGVuKCB0aGlzLmNyZWF0ZUJ1bGtJbnNlcnRRdWV1ZSgpICk7XG4gIH1cbiAgb25FbmQoKSB7XG4gICAgaWYgKHRoaXMucmVjb3Jkcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnF1ZXVlID0gdGhpcy5xdWV1ZS50aGVuKCB0aGlzLmNyZWF0ZUJ1bGtJbnNlcnRRdWV1ZSgpICk7XG4gICAgfVxuICAgIHRoaXMucXVldWUudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5lbWl0KCdlbmQnLCB0aGlzLnJlc3VsdHMpO1xuICAgIH0pLmNhdGNoKHRoaXMub25GYWlsZWQpO1xuICB9XG4gIGNyZWF0ZUNsZWFuVXBRdWV1ZSgpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMua25leCh0aGlzLm9wdHMudGFibGUpLmRlbCgpXG4gICAgICAgIC50aGVuKHRoaXMub25TdWNjZWVkZWQpXG4gICAgICAgIC5jYXRjaCh0aGlzLm9uRmFpbGVkKTtcbiAgICB9O1xuICB9XG4gIGNyZWF0ZUJ1bGtJbnNlcnRRdWV1ZSgpIHtcbiAgICBjb25zdCByZWNvcmRzID0gdGhpcy5yZWNvcmRzLnNwbGljZSgwLCB0aGlzLm9wdHMucmVjb3Jkc1BlclF1ZXJ5KTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5rbmV4KHRoaXMub3B0cy50YWJsZSlcbiAgICAgICAgLmluc2VydChyZWNvcmRzKVxuICAgICAgICAudGhlbih0aGlzLm9uU3VjY2VlZGVkKVxuICAgICAgICAuY2F0Y2godGhpcy5vbkZhaWxlZCk7XG4gICAgfTtcbiAgfVxuICBjcmVhdGVPYmplY3RGcm9tKHJlY29yZCkge1xuICAgIGxldCBvYmogPSB7fTtcblxuICAgIHRoaXMuaGVhZGVycy5mb3JFYWNoKChjb2x1bW4sIGkpID0+IHtcbiAgICAgIGxldCB2YWwgPSByZWNvcmRbaV07XG5cbiAgICAgIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJyAmJiB2YWwudG9Mb3dlckNhc2UoKSA9PT0gJ251bGwnKSB7XG4gICAgICAgIHZhbCA9IG51bGw7XG4gICAgICB9XG4gICAgICBvYmpbY29sdW1uXSA9IHZhbDtcbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9XG4gIG9uU3VjY2VlZGVkKHJlcykge1xuICAgIHRoaXMucmVzdWx0cy5wdXNoKHJlcyk7XG4gIH1cbiAgb25GYWlsZWQoZXJyKSB7XG4gICAgdGhpcy5jc3YudW5waXBlKCk7XG4gICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycik7XG4gIH1cbn1cbiJdfQ==