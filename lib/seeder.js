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
          var val = record[i];

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
//# sourceMappingURL=data:application/json;base64,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bGUiOiJzZWVkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhcnNlIGZyb20gJ2Nzdi1wYXJzZSc7XG5pbXBvcnQgaWNvbnYgZnJvbSAnaWNvbnYtbGl0ZSc7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuaW1wb3J0IHsgUHJvbWlzZSB9IGZyb20gJ2JsdWViaXJkJztcblxuZXhwb3J0IGNvbnN0IHNlZWRlciA9IHtcbiAgc2VlZChvcHRpb25zKSB7XG4gICAgcmV0dXJuIChrbmV4LCBQcm9taXNlKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBLbmV4U2VlZGVyLmZyb21LbmV4Q2xpZW50KGtuZXgpXG4gICAgICAgICAgLm9uKCdlbmQnLCByZXNvbHZlKVxuICAgICAgICAgIC5vbignZXJyb3InLCByZWplY3QpXG4gICAgICAgICAgLmdlbmVyYXRlKG9wdGlvbnMpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgc2VlZGVyLnNlZWQ7XG5cbmNsYXNzIEtuZXhTZWVkZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG4gIGNvbnN0cnVjdG9yKGtuZXgpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMub3B0cyA9IHt9O1xuICAgIHRoaXMua25leCA9IGtuZXg7XG4gICAgdGhpcy5oZWFkZXJzID0gW107XG4gICAgdGhpcy5yZWNvcmRzID0gW107XG4gICAgdGhpcy5wYXJzZXIgPSBwYXJzZSh7XG4gICAgICBkZWxpbWl0ZXI6ICcsJyxcbiAgICAgIHNraXBfZW1wdHlfbGluZXM6IHRydWUsXG4gICAgICBhdXRvX3BhcnNlOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgZnJvbUtuZXhDbGllbnQoa25leCkge1xuICAgIHJldHVybiBuZXcgS25leFNlZWRlcihrbmV4KTtcbiAgfVxuXG4gIG1lcmdlT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgbGV0IG9wdHMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGxldCBkZWZhdWx0cyA9IHtcbiAgICAgIGZpbGU6IG51bGwsXG4gICAgICB0YWJsZTogbnVsbCxcbiAgICAgIGVuY29kaW5nOiAndXRmOCdcbiAgICB9O1xuXG4gICAgZm9yIChsZXQgayBvZiBPYmplY3Qua2V5cyhvcHRzKSkge1xuICAgICAgZGVmYXVsdHNba10gPSBvcHRzW2tdO1xuICAgIH1cblxuICAgIHJldHVybiBkZWZhdWx0cztcbiAgfVxuXG4gIGdlbmVyYXRlKG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdHMgPSB0aGlzLm1lcmdlT3B0aW9ucyhvcHRpb25zKTtcbiAgICB0aGlzLnBhcnNlci5vbigncmVhZGFibGUnLCB0aGlzLnJlYWRhYmxlLmJpbmQodGhpcykgKTtcbiAgICB0aGlzLnBhcnNlci5vbignZW5kJywgdGhpcy5lbmQuYmluZCh0aGlzKSApO1xuICAgIHRoaXMucGFyc2VyLm9uKCdlcnJvcicsIHRoaXMuZXJyb3IuYmluZCh0aGlzKSApO1xuXG4gICAgbGV0IGNzdiA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0odGhpcy5vcHRzLmZpbGUpO1xuICAgIGNzdi5waXBlKCBpY29udi5kZWNvZGVTdHJlYW0odGhpcy5vcHRzLmVuY29kaW5nKSApLnBpcGUodGhpcy5wYXJzZXIpO1xuICB9XG5cbiAgcmVhZGFibGUoKSB7XG4gICAgbGV0IG9iaiA9IHt9O1xuICAgIGxldCByZWNvcmQgPSB0aGlzLnBhcnNlci5yZWFkKCk7XG5cbiAgICBpZiAocmVjb3JkID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyc2VyLmNvdW50IDw9IDEpIHtcbiAgICAgIHRoaXMuaGVhZGVycyA9IHJlY29yZDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oZWFkZXJzLmZvckVhY2goKGNvbHVtbiwgaSkgPT4ge1xuICAgICAgICBsZXQgdmFsID0gcmVjb3JkW2ldO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJyAmJiB2YWwudG9Mb3dlckNhc2UoKSA9PT0gJ251bGwnKSB7XG4gICAgICAgICAgdmFsID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBvYmpbY29sdW1uXSA9IHZhbDtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5yZWNvcmRzLnB1c2gob2JqKTtcbiAgICB9XG4gIH1cbiAgZW5kKCkge1xuICAgIGNvbnN0IHF1ZXVlcyA9IFtcbiAgICAgIHRoaXMua25leCh0aGlzLm9wdHMudGFibGUpLmRlbCgpLFxuICAgICAgdGhpcy5rbmV4KHRoaXMub3B0cy50YWJsZSkuaW5zZXJ0KHRoaXMucmVjb3JkcylcbiAgICBdO1xuICAgIHRoaXMuZW1pdCgnZW5kJywgUHJvbWlzZS5qb2luLmFwcGx5KFByb21pc2UsIHF1ZXVlcykpO1xuICB9XG4gIGVycm9yKGVycikge1xuICAgIHRoaXMuZW1pdCgnZXJyb3InLCBlcnIpO1xuICB9XG59XG4iXX0=