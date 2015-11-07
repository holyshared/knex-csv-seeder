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
    key: 'generate',
    value: function generate(options) {
      this.opts = options || {};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZWVkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtPLElBQU0sTUFBTSxXQUFOLE1BQU0sR0FBRztBQUNwQixNQUFJLGdCQUFDLE9BQU8sRUFBRTtBQUNaLFdBQU8sVUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFLO0FBQ3hCLGFBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ3RDLGtCQUFVLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUM1QixFQUFFLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUNsQixFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUNuQixRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7T0FDdEIsQ0FBQyxDQUFDO0tBQ0osQ0FBQztHQUNIO0NBQ0YsQ0FBQzs7a0JBRWEsTUFBTSxDQUFDLElBQUk7O0lBRXBCLFVBQVU7WUFBVixVQUFVOztBQUVkLFdBRkksVUFBVSxDQUVGLElBQUksRUFBRTswQkFGZCxVQUFVOzt1RUFBVixVQUFVOztBQUlaLFVBQUssSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixVQUFLLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDbEIsVUFBSyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLFVBQUssSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNmLFVBQUssTUFBTSxHQUFHLHdCQUFNO0FBQ2xCLGVBQVMsRUFBRSxHQUFHO0FBQ2Qsc0JBQWdCLEVBQUUsSUFBSTtBQUN0QixnQkFBVSxFQUFFLElBQUk7S0FDakIsQ0FBQyxDQUFDOztHQUNKOztlQWJHLFVBQVU7OzZCQW1CTCxPQUFPLEVBQUU7QUFDaEIsVUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO0FBQzFCLFVBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBRSxDQUFDO0FBQ3RELFVBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBRSxDQUFDO0FBQzVDLFVBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBRSxDQUFDO0FBQ2hELFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBRSxDQUFDOztBQUVyRCxVQUFJLEdBQUcsR0FBRyxhQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUMsU0FBRyxDQUFDLElBQUksQ0FBRSxvQkFBTSxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDdEU7OzsrQkFFVTtBQUNULFVBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNiLFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRWhDLFVBQUksTUFBTSxLQUFLLElBQUksRUFBRTtBQUNuQixlQUFPO09BQ1I7O0FBRUQsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxDQUFDLEVBQUU7QUFDMUIsWUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7T0FDdkIsTUFBTTtBQUNMLFlBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTSxFQUFFLENBQUMsRUFBSztBQUFFLGFBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FBRSxDQUFDLENBQUM7QUFDbEUsWUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBRSxDQUFDO09BQzVEO0tBQ0Y7OzswQkFDSztBQUNKLFVBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUM1RDs7OzBCQUNLLEdBQUcsRUFBRTtBQUNULFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ3pCOzs7bUNBbkNxQixJQUFJLEVBQUU7QUFDMUIsYUFBTyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM3Qjs7O1NBakJHLFVBQVU7V0FqQlAsWUFBWSIsImZpbGUiOiJzZWVkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhcnNlIGZyb20gJ2Nzdi1wYXJzZSc7XG5pbXBvcnQgaWNvbnYgZnJvbSAnaWNvbnYtbGl0ZSc7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG5leHBvcnQgY29uc3Qgc2VlZGVyID0ge1xuICBzZWVkKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gKGtuZXgsIFByb21pc2UpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIEtuZXhTZWVkZXIuZnJvbUtuZXhDbGllbnQoa25leClcbiAgICAgICAgICAub24oJ2VuZCcsIHJlc29sdmUpXG4gICAgICAgICAgLm9uKCdlcnJvcicsIHJlamVjdClcbiAgICAgICAgICAuZ2VuZXJhdGUob3B0aW9ucyk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzZWVkZXIuc2VlZDtcblxuY2xhc3MgS25leFNlZWRlciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cbiAgY29uc3RydWN0b3Ioa25leCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5rbmV4ID0ga25leDtcbiAgICB0aGlzLmhlYWRlcnMgPSBbXTtcbiAgICB0aGlzLnF1ZXVlcyA9IFtdO1xuICAgIHRoaXMub3B0cyA9IHt9OyBcbiAgICB0aGlzLnBhcnNlciA9IHBhcnNlKHtcbiAgICAgIGRlbGltaXRlcjogJywnLFxuICAgICAgc2tpcF9lbXB0eV9saW5lczogdHJ1ZSxcbiAgICAgIGF1dG9fcGFyc2U6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tS25leENsaWVudChrbmV4KSB7XG4gICAgcmV0dXJuIG5ldyBLbmV4U2VlZGVyKGtuZXgpO1xuICB9XG5cbiAgZ2VuZXJhdGUob3B0aW9ucykge1xuICAgIHRoaXMub3B0cyA9IG9wdGlvbnMgfHwge307XG4gICAgdGhpcy5wYXJzZXIub24oJ3JlYWRhYmxlJywgdGhpcy5yZWFkYWJsZS5iaW5kKHRoaXMpICk7XG4gICAgdGhpcy5wYXJzZXIub24oJ2VuZCcsIHRoaXMuZW5kLmJpbmQodGhpcykgKTtcbiAgICB0aGlzLnBhcnNlci5vbignZXJyb3InLCB0aGlzLmVycm9yLmJpbmQodGhpcykgKTtcbiAgICB0aGlzLnF1ZXVlcy5wdXNoKCB0aGlzLmtuZXgodGhpcy5vcHRzLnRhYmxlKS5kZWwoKSApO1xuXG4gICAgbGV0IGNzdiA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0odGhpcy5vcHRzLmZpbGUpO1xuICAgIGNzdi5waXBlKCBpY29udi5kZWNvZGVTdHJlYW0odGhpcy5vcHRzLmVuY29kaW5nKSApLnBpcGUodGhpcy5wYXJzZXIpO1xuICB9XG5cbiAgcmVhZGFibGUoKSB7XG4gICAgbGV0IG9iaiA9IHt9O1xuICAgIGxldCByZWNvcmQgPSB0aGlzLnBhcnNlci5yZWFkKCk7XG5cbiAgICBpZiAocmVjb3JkID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyc2VyLmNvdW50IDw9IDEpIHtcbiAgICAgIHRoaXMuaGVhZGVycyA9IHJlY29yZDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oZWFkZXJzLmZvckVhY2goKGNvbHVtbiwgaSkgPT4geyBvYmpbY29sdW1uXSA9IHJlY29yZFtpXTsgfSk7XG4gICAgICB0aGlzLnF1ZXVlcy5wdXNoKCB0aGlzLmtuZXgodGhpcy5vcHRzLnRhYmxlKS5pbnNlcnQob2JqKSApO1xuICAgIH1cbiAgfVxuICBlbmQoKSB7XG4gICAgdGhpcy5lbWl0KCdlbmQnLCBQcm9taXNlLmpvaW4uYXBwbHkoUHJvbWlzZSwgdGhpcy5xdWV1ZXMpKTtcbiAgfVxuICBlcnJvcihlcnIpIHtcbiAgICB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgfVxufVxuIl19