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
        return _this2.knex(_this2.opts.table).del().then(_this2.succeeded.bind(_this2)).catch(_this2.failed.bind(_this2));
      });
      this.parser = (0, _csvParse2.default)(this.opts.parser);
      this.parser.on('readable', this.readable.bind(this));
      this.parser.on('end', this.end.bind(this));
      this.parser.on('error', this.failed.bind(this));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZWVkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9PLElBQU0sTUFBTSxXQUFOLE1BQU0sR0FBRztBQUNwQixNQUFJLGdCQUFDLE9BQU8sRUFBRTtBQUNaLFdBQU8sVUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFLO0FBQ3hCLGFBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ3RDLGtCQUFVLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUM1QixFQUFFLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUNsQixFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUNuQixRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7T0FDdEIsQ0FBQyxDQUFDO0tBQ0osQ0FBQztHQUNIO0NBQ0YsQ0FBQzs7a0JBRWEsTUFBTSxDQUFDLElBQUk7O0lBRXBCLFVBQVU7WUFBVixVQUFVOztBQUVkLFdBRkksVUFBVSxDQUVGLElBQUksRUFBRTswQkFGZCxVQUFVOzt1RUFBVixVQUFVOztBQUlaLFVBQUssSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNmLFVBQUssSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixVQUFLLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDbEIsVUFBSyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFVBQUssTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixVQUFLLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsVUFBSyxPQUFPLEdBQUcsRUFBRSxDQUFDOztHQUNuQjs7ZUFYRyxVQUFVOztpQ0FpQkQsT0FBTyxFQUFFO0FBQ3BCLFVBQUksSUFBSSxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7QUFDekIsVUFBSSxRQUFRLEdBQUc7QUFDYixZQUFJLEVBQUUsSUFBSTtBQUNWLGFBQUssRUFBRSxJQUFJO0FBQ1gsZ0JBQVEsRUFBRSxNQUFNO0FBQ2hCLHVCQUFlLEVBQUUsR0FBRztBQUNwQixjQUFNLEVBQUU7QUFDTixtQkFBUyxFQUFFLEdBQUc7QUFDZCxlQUFLLEVBQUUsR0FBRztBQUNWLGdCQUFNLEVBQUUsSUFBSTtBQUNaLDBCQUFnQixFQUFFLElBQUk7QUFDdEIsb0JBQVUsRUFBRSxJQUFJO1NBQ2pCO09BQ0YsQ0FBQzs7QUFFRixhQUFPLGlCQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3BDOzs7NkJBRVEsT0FBTyxFQUFFOzs7QUFDaEIsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZDLFVBQUksQ0FBQyxLQUFLLEdBQUcsVUF2RFIsT0FBTyxDQXVEUyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQU07QUFDekMsZUFBTyxPQUFLLElBQUksQ0FBQyxPQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FDcEMsSUFBSSxDQUFDLE9BQUssU0FBUyxDQUFDLElBQUksUUFBTSxDQUFDLENBQy9CLEtBQUssQ0FBQyxPQUFLLE1BQU0sQ0FBQyxJQUFJLFFBQU0sQ0FBQyxDQUFDO09BQ2xDLENBQUMsQ0FBQztBQUNILFVBQUksQ0FBQyxNQUFNLEdBQUcsd0JBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0QyxVQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUUsQ0FBQztBQUN0RCxVQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUUsQ0FBQztBQUM1QyxVQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUUsQ0FBQzs7QUFFakQsVUFBSSxDQUFDLEdBQUcsR0FBRyxhQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0MsVUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUUsb0JBQU0sWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzNFOzs7K0JBRVU7QUFDVCxVQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDYixVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVoQyxVQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUU7QUFDbkIsZUFBTztPQUNSOztBQUVELFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksQ0FBQyxFQUFFO0FBQzFCLFlBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO09BQ3ZCLE1BQU07QUFDTCxZQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUUsQ0FBQztPQUNwRDs7QUFFRCxVQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO0FBQ25ELGVBQU87T0FDUjs7QUFFRCxVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBRSxDQUFDO0tBQ3BEOzs7MEJBQ0s7OztBQUNKLFVBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQzNCLFlBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFFLENBQUM7T0FDcEQ7QUFDRCxVQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFNO0FBQ3BCLGVBQU8sT0FBSyxJQUFJLENBQUMsS0FBSyxFQUFFLE9BQUssT0FBTyxDQUFDLENBQUM7T0FDdkMsQ0FBQyxDQUFDO0tBQ0o7OztrQ0FDYTs7O0FBQ1osVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7O0FBRWxFLGFBQU8sWUFBTTtBQUNYLGVBQU8sT0FBSyxJQUFJLENBQUMsT0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQzlCLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FDZixJQUFJLENBQUMsT0FBSyxTQUFTLENBQUMsSUFBSSxRQUFNLENBQUMsQ0FDL0IsS0FBSyxDQUFDLE9BQUssTUFBTSxDQUFDLElBQUksUUFBTSxDQUFDLENBQUM7T0FDbEMsQ0FBQztLQUNIOzs7cUNBQ2dCLE1BQU0sRUFBRTtBQUN2QixVQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7O0FBRWIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNLEVBQUUsQ0FBQyxFQUFLO0FBQ2xDLFlBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFcEIsWUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLElBQUksR0FBRyxDQUFDLFdBQVcsRUFBRSxLQUFLLE1BQU0sRUFBRTtBQUMzRCxhQUFHLEdBQUcsSUFBSSxDQUFDO1NBQ1o7QUFDRCxXQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDO09BQ25CLENBQUMsQ0FBQztBQUNILGFBQU8sR0FBRyxDQUFDO0tBQ1o7Ozs4QkFDUyxHQUFHLEVBQUU7QUFDYixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUN4Qjs7OzJCQUNNLEdBQUcsRUFBRTtBQUNWLFVBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDZixVQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2xCLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ3pCOzs7bUNBakdxQixJQUFJLEVBQUU7QUFDMUIsYUFBTyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM3Qjs7O1NBZkcsVUFBVTtXQWxCUCxZQUFZIiwiZmlsZSI6InNlZWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGFyc2UgZnJvbSAnY3N2LXBhcnNlJztcbmltcG9ydCBpY29udiBmcm9tICdpY29udi1saXRlJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuaW1wb3J0IHsgUHJvbWlzZSB9IGZyb20gJ2JsdWViaXJkJztcblxuZXhwb3J0IGNvbnN0IHNlZWRlciA9IHtcbiAgc2VlZChvcHRpb25zKSB7XG4gICAgcmV0dXJuIChrbmV4LCBQcm9taXNlKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBLbmV4U2VlZGVyLmZyb21LbmV4Q2xpZW50KGtuZXgpXG4gICAgICAgICAgLm9uKCdlbmQnLCByZXNvbHZlKVxuICAgICAgICAgIC5vbignZXJyb3InLCByZWplY3QpXG4gICAgICAgICAgLmdlbmVyYXRlKG9wdGlvbnMpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgc2VlZGVyLnNlZWQ7XG5cbmNsYXNzIEtuZXhTZWVkZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG4gIGNvbnN0cnVjdG9yKGtuZXgpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMub3B0cyA9IHt9O1xuICAgIHRoaXMua25leCA9IGtuZXg7XG4gICAgdGhpcy5oZWFkZXJzID0gW107XG4gICAgdGhpcy5yZWNvcmRzID0gW107XG4gICAgdGhpcy5wYXJzZXIgPSBudWxsO1xuICAgIHRoaXMucXVldWUgPSBudWxsO1xuICAgIHRoaXMucmVzdWx0cyA9IFtdO1xuICB9XG5cbiAgc3RhdGljIGZyb21LbmV4Q2xpZW50KGtuZXgpIHtcbiAgICByZXR1cm4gbmV3IEtuZXhTZWVkZXIoa25leCk7XG4gIH1cblxuICBtZXJnZU9wdGlvbnMob3B0aW9ucykge1xuICAgIGxldCBvcHRzID0gb3B0aW9ucyB8fCB7fTtcbiAgICBsZXQgZGVmYXVsdHMgPSB7XG4gICAgICBmaWxlOiBudWxsLFxuICAgICAgdGFibGU6IG51bGwsXG4gICAgICBlbmNvZGluZzogJ3V0ZjgnLFxuICAgICAgcmVjb3Jkc1BlclF1ZXJ5OiAxMDAsXG4gICAgICBwYXJzZXI6IHtcbiAgICAgICAgZGVsaW1pdGVyOiAnLCcsXG4gICAgICAgIHF1b3RlOiAnXCInLFxuICAgICAgICBlc2NhcGU6ICdcXFxcJyxcbiAgICAgICAgc2tpcF9lbXB0eV9saW5lczogdHJ1ZSxcbiAgICAgICAgYXV0b19wYXJzZTogdHJ1ZVxuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gXy5tZXJnZSh7fSwgZGVmYXVsdHMsIG9wdHMpO1xuICB9XG5cbiAgZ2VuZXJhdGUob3B0aW9ucykge1xuICAgIHRoaXMub3B0cyA9IHRoaXMubWVyZ2VPcHRpb25zKG9wdGlvbnMpO1xuICAgIHRoaXMucXVldWUgPSBQcm9taXNlLmJpbmQodGhpcykudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5rbmV4KHRoaXMub3B0cy50YWJsZSkuZGVsKClcbiAgICAgICAgLnRoZW4odGhpcy5zdWNjZWVkZWQuYmluZCh0aGlzKSlcbiAgICAgICAgLmNhdGNoKHRoaXMuZmFpbGVkLmJpbmQodGhpcykpO1xuICAgIH0pO1xuICAgIHRoaXMucGFyc2VyID0gcGFyc2UodGhpcy5vcHRzLnBhcnNlcik7XG4gICAgdGhpcy5wYXJzZXIub24oJ3JlYWRhYmxlJywgdGhpcy5yZWFkYWJsZS5iaW5kKHRoaXMpICk7XG4gICAgdGhpcy5wYXJzZXIub24oJ2VuZCcsIHRoaXMuZW5kLmJpbmQodGhpcykgKTtcbiAgICB0aGlzLnBhcnNlci5vbignZXJyb3InLCB0aGlzLmZhaWxlZC5iaW5kKHRoaXMpICk7XG5cbiAgICB0aGlzLmNzdiA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0odGhpcy5vcHRzLmZpbGUpO1xuICAgIHRoaXMuY3N2LnBpcGUoIGljb252LmRlY29kZVN0cmVhbSh0aGlzLm9wdHMuZW5jb2RpbmcpICkucGlwZSh0aGlzLnBhcnNlcik7XG4gIH1cblxuICByZWFkYWJsZSgpIHtcbiAgICBsZXQgb2JqID0ge307XG4gICAgbGV0IHJlY29yZCA9IHRoaXMucGFyc2VyLnJlYWQoKTtcblxuICAgIGlmIChyZWNvcmQgPT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJzZXIuY291bnQgPD0gMSkge1xuICAgICAgdGhpcy5oZWFkZXJzID0gcmVjb3JkO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlY29yZHMucHVzaCggdGhpcy5jcmVhdGVPYmplY3RGcm9tKHJlY29yZCkgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZWNvcmRzLmxlbmd0aCA8IHRoaXMub3B0cy5yZWNvcmRzUGVyUXVlcnkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnF1ZXVlID0gdGhpcy5xdWV1ZS50aGVuKCB0aGlzLmNyZWF0ZVF1ZXVlKCkgKTtcbiAgfVxuICBlbmQoKSB7XG4gICAgaWYgKHRoaXMucmVjb3Jkcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnF1ZXVlID0gdGhpcy5xdWV1ZS50aGVuKCB0aGlzLmNyZWF0ZVF1ZXVlKCkgKTtcbiAgICB9XG4gICAgdGhpcy5xdWV1ZS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmVtaXQoJ2VuZCcsIHRoaXMucmVzdWx0cyk7XG4gICAgfSk7XG4gIH1cbiAgY3JlYXRlUXVldWUoKSB7XG4gICAgY29uc3QgcmVjb3JkcyA9IHRoaXMucmVjb3Jkcy5zcGxpY2UoMCwgdGhpcy5vcHRzLnJlY29yZHNQZXJRdWVyeSk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMua25leCh0aGlzLm9wdHMudGFibGUpXG4gICAgICAgIC5pbnNlcnQocmVjb3JkcylcbiAgICAgICAgLnRoZW4odGhpcy5zdWNjZWVkZWQuYmluZCh0aGlzKSlcbiAgICAgICAgLmNhdGNoKHRoaXMuZmFpbGVkLmJpbmQodGhpcykpO1xuICAgIH07XG4gIH1cbiAgY3JlYXRlT2JqZWN0RnJvbShyZWNvcmQpIHtcbiAgICBsZXQgb2JqID0ge307XG5cbiAgICB0aGlzLmhlYWRlcnMuZm9yRWFjaCgoY29sdW1uLCBpKSA9PiB7XG4gICAgICBsZXQgdmFsID0gcmVjb3JkW2ldO1xuXG4gICAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgJiYgdmFsLnRvTG93ZXJDYXNlKCkgPT09ICdudWxsJykge1xuICAgICAgICB2YWwgPSBudWxsO1xuICAgICAgfVxuICAgICAgb2JqW2NvbHVtbl0gPSB2YWw7XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuICBzdWNjZWVkZWQocmVzKSB7XG4gICAgdGhpcy5yZXN1bHRzLnB1c2gocmVzKTtcbiAgfVxuICBmYWlsZWQoZXJyKSB7XG4gICAgdGhpcy5jc3YuZW5kKCk7XG4gICAgdGhpcy5jc3YudW5waXBlKCk7XG4gICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycik7XG4gIH1cbn1cbiJdfQ==