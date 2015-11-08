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

    _this.knex = knex;
    _this.headers = [];
    _this.queues = [];
    _this.opts = {};
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
      this.queues.push(this.knex(this.opts.table).del());

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
          obj[column] = record[i];
        });
        this.queues.push(this.knex(this.opts.table).insert(obj));
      }
    }
  }, {
    key: 'end',
    value: function end() {
      this.emit('end', Promise.join.apply(Promise, this.queues));
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
//# sourceMappingURL=data:application/json;base64,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O0FBQ2IsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFaEMsVUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFO0FBQ25CLGVBQU87T0FDUjs7QUFFRCxVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLENBQUMsRUFBRTtBQUMxQixZQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztPQUN2QixNQUFNO0FBQ0wsWUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNLEVBQUUsQ0FBQyxFQUFLO0FBQUUsYUFBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUFFLENBQUMsQ0FBQztBQUNsRSxZQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFFLENBQUM7T0FDNUQ7S0FDRjs7OzBCQUNLO0FBQ0osVUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQzVEOzs7MEJBQ0ssR0FBRyxFQUFFO0FBQ1QsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDekI7OzttQ0FsRHFCLElBQUksRUFBRTtBQUMxQixhQUFPLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzdCOzs7U0FqQkcsVUFBVTtXQWpCUCxZQUFZIiwiZmlsZSI6InNlZWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGFyc2UgZnJvbSAnY3N2LXBhcnNlJztcbmltcG9ydCBpY29udiBmcm9tICdpY29udi1saXRlJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbmV4cG9ydCBjb25zdCBzZWVkZXIgPSB7XG4gIHNlZWQob3B0aW9ucykge1xuICAgIHJldHVybiAoa25leCwgUHJvbWlzZSkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgS25leFNlZWRlci5mcm9tS25leENsaWVudChrbmV4KVxuICAgICAgICAgIC5vbignZW5kJywgcmVzb2x2ZSlcbiAgICAgICAgICAub24oJ2Vycm9yJywgcmVqZWN0KVxuICAgICAgICAgIC5nZW5lcmF0ZShvcHRpb25zKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNlZWRlci5zZWVkO1xuXG5jbGFzcyBLbmV4U2VlZGVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuICBjb25zdHJ1Y3RvcihrbmV4KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmtuZXggPSBrbmV4O1xuICAgIHRoaXMuaGVhZGVycyA9IFtdO1xuICAgIHRoaXMucXVldWVzID0gW107XG4gICAgdGhpcy5vcHRzID0ge307IFxuICAgIHRoaXMucGFyc2VyID0gcGFyc2Uoe1xuICAgICAgZGVsaW1pdGVyOiAnLCcsXG4gICAgICBza2lwX2VtcHR5X2xpbmVzOiB0cnVlLFxuICAgICAgYXV0b19wYXJzZTogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGZyb21LbmV4Q2xpZW50KGtuZXgpIHtcbiAgICByZXR1cm4gbmV3IEtuZXhTZWVkZXIoa25leCk7XG4gIH1cblxuICBtZXJnZU9wdGlvbnMob3B0aW9ucykge1xuICAgIGxldCBvcHRzID0gb3B0aW9ucyB8fCB7fTtcbiAgICBsZXQgZGVmYXVsdHMgPSB7XG4gICAgICBmaWxlOiBudWxsLFxuICAgICAgdGFibGU6IG51bGwsXG4gICAgICBlbmNvZGluZzogJ3V0ZjgnXG4gICAgfTtcblxuICAgIGZvciAobGV0IGsgb2YgT2JqZWN0LmtleXMob3B0cykpIHtcbiAgICAgIGRlZmF1bHRzW2tdID0gb3B0c1trXTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGVmYXVsdHM7XG4gIH1cblxuICBnZW5lcmF0ZShvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRzID0gdGhpcy5tZXJnZU9wdGlvbnMob3B0aW9ucyk7XG4gICAgdGhpcy5wYXJzZXIub24oJ3JlYWRhYmxlJywgdGhpcy5yZWFkYWJsZS5iaW5kKHRoaXMpICk7XG4gICAgdGhpcy5wYXJzZXIub24oJ2VuZCcsIHRoaXMuZW5kLmJpbmQodGhpcykgKTtcbiAgICB0aGlzLnBhcnNlci5vbignZXJyb3InLCB0aGlzLmVycm9yLmJpbmQodGhpcykgKTtcbiAgICB0aGlzLnF1ZXVlcy5wdXNoKCB0aGlzLmtuZXgodGhpcy5vcHRzLnRhYmxlKS5kZWwoKSApO1xuXG4gICAgbGV0IGNzdiA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0odGhpcy5vcHRzLmZpbGUpO1xuICAgIGNzdi5waXBlKCBpY29udi5kZWNvZGVTdHJlYW0odGhpcy5vcHRzLmVuY29kaW5nKSApLnBpcGUodGhpcy5wYXJzZXIpO1xuICB9XG5cbiAgcmVhZGFibGUoKSB7XG4gICAgbGV0IG9iaiA9IHt9O1xuICAgIGxldCByZWNvcmQgPSB0aGlzLnBhcnNlci5yZWFkKCk7XG5cbiAgICBpZiAocmVjb3JkID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyc2VyLmNvdW50IDw9IDEpIHtcbiAgICAgIHRoaXMuaGVhZGVycyA9IHJlY29yZDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oZWFkZXJzLmZvckVhY2goKGNvbHVtbiwgaSkgPT4geyBvYmpbY29sdW1uXSA9IHJlY29yZFtpXTsgfSk7XG4gICAgICB0aGlzLnF1ZXVlcy5wdXNoKCB0aGlzLmtuZXgodGhpcy5vcHRzLnRhYmxlKS5pbnNlcnQob2JqKSApO1xuICAgIH1cbiAgfVxuICBlbmQoKSB7XG4gICAgdGhpcy5lbWl0KCdlbmQnLCBQcm9taXNlLmpvaW4uYXBwbHkoUHJvbWlzZSwgdGhpcy5xdWV1ZXMpKTtcbiAgfVxuICBlcnJvcihlcnIpIHtcbiAgICB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgfVxufVxuIl19