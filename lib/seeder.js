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
//# sourceMappingURL=data:application/json;base64,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VUFBVTtXQWxCUCxZQUFZIiwiZmlsZSI6InNlZWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGFyc2UgZnJvbSAnY3N2LXBhcnNlJztcbmltcG9ydCBpY29udiBmcm9tICdpY29udi1saXRlJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuaW1wb3J0IHsgUHJvbWlzZSB9IGZyb20gJ2JsdWViaXJkJztcblxuZXhwb3J0IGNvbnN0IHNlZWRlciA9IHtcbiAgc2VlZChvcHRpb25zKSB7XG4gICAgcmV0dXJuIChrbmV4LCBQcm9taXNlKSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBLbmV4U2VlZGVyLmZyb21LbmV4Q2xpZW50KGtuZXgpXG4gICAgICAgICAgLm9uKCdlbmQnLCByZXNvbHZlKVxuICAgICAgICAgIC5vbignZXJyb3InLCByZWplY3QpXG4gICAgICAgICAgLmdlbmVyYXRlKG9wdGlvbnMpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgc2VlZGVyLnNlZWQ7XG5cbmNsYXNzIEtuZXhTZWVkZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG4gIGNvbnN0cnVjdG9yKGtuZXgpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMub3B0cyA9IHt9O1xuICAgIHRoaXMua25leCA9IGtuZXg7XG4gICAgdGhpcy5oZWFkZXJzID0gW107XG4gICAgdGhpcy5yZWNvcmRzID0gW107XG4gICAgdGhpcy5wYXJzZXIgPSBudWxsO1xuICB9XG5cbiAgc3RhdGljIGZyb21LbmV4Q2xpZW50KGtuZXgpIHtcbiAgICByZXR1cm4gbmV3IEtuZXhTZWVkZXIoa25leCk7XG4gIH1cblxuICBtZXJnZU9wdGlvbnMob3B0aW9ucykge1xuICAgIGxldCBvcHRzID0gb3B0aW9ucyB8fCB7fTtcbiAgICBsZXQgZGVmYXVsdHMgPSB7XG4gICAgICBmaWxlOiBudWxsLFxuICAgICAgdGFibGU6IG51bGwsXG4gICAgICBlbmNvZGluZzogJ3V0ZjgnLFxuICAgICAgcGFyc2VyOiB7XG4gICAgICAgIGRlbGltaXRlcjogJywnLFxuICAgICAgICBxdW90ZTogJ1wiJyxcbiAgICAgICAgZXNjYXBlOiAnXFxcXCcsXG4gICAgICAgIHNraXBfZW1wdHlfbGluZXM6IHRydWUsXG4gICAgICAgIGF1dG9fcGFyc2U6IHRydWVcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIF8ubWVyZ2Uoe30sIGRlZmF1bHRzLCBvcHRzKTtcbiAgfVxuXG4gIGdlbmVyYXRlKG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdHMgPSB0aGlzLm1lcmdlT3B0aW9ucyhvcHRpb25zKTtcbiAgICB0aGlzLnBhcnNlciA9IHBhcnNlKHRoaXMub3B0cy5wYXJzZXIpO1xuICAgIHRoaXMucGFyc2VyLm9uKCdyZWFkYWJsZScsIHRoaXMucmVhZGFibGUuYmluZCh0aGlzKSApO1xuICAgIHRoaXMucGFyc2VyLm9uKCdlbmQnLCB0aGlzLmVuZC5iaW5kKHRoaXMpICk7XG4gICAgdGhpcy5wYXJzZXIub24oJ2Vycm9yJywgdGhpcy5lcnJvci5iaW5kKHRoaXMpICk7XG5cbiAgICBsZXQgY3N2ID0gZnMuY3JlYXRlUmVhZFN0cmVhbSh0aGlzLm9wdHMuZmlsZSk7XG4gICAgY3N2LnBpcGUoIGljb252LmRlY29kZVN0cmVhbSh0aGlzLm9wdHMuZW5jb2RpbmcpICkucGlwZSh0aGlzLnBhcnNlcik7XG4gIH1cblxuICByZWFkYWJsZSgpIHtcbiAgICBsZXQgb2JqID0ge307XG4gICAgbGV0IHJlY29yZCA9IHRoaXMucGFyc2VyLnJlYWQoKTtcblxuICAgIGlmIChyZWNvcmQgPT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJzZXIuY291bnQgPD0gMSkge1xuICAgICAgdGhpcy5oZWFkZXJzID0gcmVjb3JkO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhlYWRlcnMuZm9yRWFjaCgoY29sdW1uLCBpKSA9PiB7XG4gICAgICAgIGxldCB2YWwgPSByZWNvcmRbaV07XG5cbiAgICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnICYmIHZhbC50b0xvd2VyQ2FzZSgpID09PSAnbnVsbCcpIHtcbiAgICAgICAgICB2YWwgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIG9ialtjb2x1bW5dID0gdmFsO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnJlY29yZHMucHVzaChvYmopO1xuICAgIH1cbiAgfVxuICBlbmQoKSB7XG4gICAgY29uc3QgcXVldWVzID0gW1xuICAgICAgdGhpcy5rbmV4KHRoaXMub3B0cy50YWJsZSkuZGVsKCksXG4gICAgICB0aGlzLmtuZXgodGhpcy5vcHRzLnRhYmxlKS5pbnNlcnQodGhpcy5yZWNvcmRzKVxuICAgIF07XG4gICAgdGhpcy5lbWl0KCdlbmQnLCBQcm9taXNlLmpvaW4uYXBwbHkoUHJvbWlzZSwgcXVldWVzKSk7XG4gIH1cbiAgZXJyb3IoZXJyKSB7XG4gICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycik7XG4gIH1cbn1cbiJdfQ==