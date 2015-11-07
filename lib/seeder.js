'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CSVSeeder = undefined;
exports.default = seeder;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _csvParse = require('csv-parse');

var _csvParse2 = _interopRequireDefault(_csvParse);

var _iconvLite = require('iconv-lite');

var _iconvLite2 = _interopRequireDefault(_iconvLite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function seeder(tableName, filePath) {
  var encoding = arguments.length <= 2 || arguments[2] === undefined ? 'utf8' : arguments[2];

  return function (knex, Promise) {
    var seeder = new CSVSeeder(knex);

    return seeder.createFrom({
      file: filePath,
      table: tableName,
      encoding: encoding
    });
  };
}

var CSVSeeder = exports.CSVSeeder = (function () {
  function CSVSeeder(knex) {
    _classCallCheck(this, CSVSeeder);

    this.knex = knex;
    this.headers = [];
    this.queues = [];
    this.opts = {};
    this.parser = (0, _csvParse2.default)({
      delimiter: ',',
      skip_empty_lines: true,
      auto_parse: true
    });
  }

  _createClass(CSVSeeder, [{
    key: 'createFrom',
    value: function createFrom(options) {
      var _this = this;

      var callback = function callback(resolve, reject) {
        _this.opts = options || {};
        _this.finish = resolve;
        _this.error = reject;
        _this.parser.on('readable', _this.readable.bind(_this));
        _this.parser.on('end', _this.end.bind(_this));
        _this.parser.on('error', _this.error.bind(_this));
        _this.queues.push(_this.knex(_this.opts.table).del());

        var csv = _fs2.default.createReadStream(_this.opts.file);
        csv.pipe(_iconvLite2.default.decodeStream(_this.opts.encoding)).pipe(_this.parser);
      };

      return new Promise(callback.bind(this));
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
      this.finish(Promise.join.apply(Promise, this.queues));
    }
  }]);

  return CSVSeeder;
})();

;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZWVkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7a0JBSXdCLE1BQU07Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFmLFNBQVMsTUFBTSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQXFCO01BQW5CLFFBQVEseURBQUcsTUFBTTs7QUFFbkUsU0FBTyxVQUFDLElBQUksRUFBRSxPQUFPLEVBQUs7QUFDeEIsUUFBSSxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWpDLFdBQU8sTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUN2QixVQUFJLEVBQUUsUUFBUTtBQUNkLFdBQUssRUFBRSxTQUFTO0FBQ2hCLGNBQVEsRUFBRSxRQUFRO0tBQ25CLENBQUMsQ0FBQztHQUNKLENBQUM7Q0FFSDs7SUFFWSxTQUFTLFdBQVQsU0FBUztBQUNwQixXQURXLFNBQVMsQ0FDUixJQUFJLEVBQUU7MEJBRFAsU0FBUzs7QUFFbEIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDbEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsUUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDZixRQUFJLENBQUMsTUFBTSxHQUFHLHdCQUFNO0FBQ2xCLGVBQVMsRUFBRSxHQUFHO0FBQ2Qsc0JBQWdCLEVBQUUsSUFBSTtBQUN0QixnQkFBVSxFQUFFLElBQUk7S0FDakIsQ0FBQyxDQUFDO0dBQ0o7O2VBWFUsU0FBUzs7K0JBWVQsT0FBTyxFQUFFOzs7QUFDbEIsVUFBSSxRQUFRLEdBQUcsU0FBWCxRQUFRLENBQUksT0FBTyxFQUFFLE1BQU0sRUFBSztBQUNsQyxjQUFLLElBQUksR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO0FBQzFCLGNBQUssTUFBTSxHQUFHLE9BQU8sQ0FBQztBQUN0QixjQUFLLEtBQUssR0FBRyxNQUFNLENBQUM7QUFDcEIsY0FBSyxNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxNQUFLLFFBQVEsQ0FBQyxJQUFJLE9BQU0sQ0FBRSxDQUFDO0FBQ3RELGNBQUssTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBSyxHQUFHLENBQUMsSUFBSSxPQUFNLENBQUUsQ0FBQztBQUM1QyxjQUFLLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQUssS0FBSyxDQUFDLElBQUksT0FBTSxDQUFFLENBQUM7QUFDaEQsY0FBSyxNQUFNLENBQUMsSUFBSSxDQUFFLE1BQUssSUFBSSxDQUFDLE1BQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFFLENBQUM7O0FBRXJELFlBQUksR0FBRyxHQUFHLGFBQUcsZ0JBQWdCLENBQUMsTUFBSyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUMsV0FBRyxDQUFDLElBQUksQ0FBRSxvQkFBTSxZQUFZLENBQUMsTUFBSyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUUsQ0FBQyxJQUFJLENBQUMsTUFBSyxNQUFNLENBQUMsQ0FBQztPQUN0RSxDQUFDOztBQUVGLGFBQU8sSUFBSSxPQUFPLENBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBRSxDQUFDO0tBQzNDOzs7K0JBRVU7QUFDVCxVQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDYixVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVoQyxVQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUU7QUFDbkIsZUFBTztPQUNSOztBQUVELFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksQ0FBQyxFQUFFO0FBQzFCLFlBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO09BQ3ZCLE1BQU07QUFDTCxZQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUs7QUFBRSxhQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQUUsQ0FBQyxDQUFDO0FBQ2xFLFlBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUUsQ0FBQztPQUM1RDtLQUNGOzs7MEJBRUs7QUFDSixVQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUN2RDs7O1NBL0NVLFNBQVM7OztBQWlEckIsQ0FBQyIsImZpbGUiOiJzZWVkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhcnNlIGZyb20gJ2Nzdi1wYXJzZSc7XG5pbXBvcnQgaWNvbnYgZnJvbSAnaWNvbnYtbGl0ZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNlZWRlcih0YWJsZU5hbWUsIGZpbGVQYXRoLCBlbmNvZGluZyA9ICd1dGY4Jykge1xuXG4gIHJldHVybiAoa25leCwgUHJvbWlzZSkgPT4ge1xuICAgIGxldCBzZWVkZXIgPSBuZXcgQ1NWU2VlZGVyKGtuZXgpO1xuXG4gICAgcmV0dXJuIHNlZWRlci5jcmVhdGVGcm9tKHtcbiAgICAgIGZpbGU6IGZpbGVQYXRoLFxuICAgICAgdGFibGU6IHRhYmxlTmFtZSxcbiAgICAgIGVuY29kaW5nOiBlbmNvZGluZ1xuICAgIH0pO1xuICB9O1xuXG59XG5cbmV4cG9ydCBjbGFzcyBDU1ZTZWVkZXIge1xuICBjb25zdHJ1Y3RvcihrbmV4KSB7XG4gICAgdGhpcy5rbmV4ID0ga25leDtcbiAgICB0aGlzLmhlYWRlcnMgPSBbXTtcbiAgICB0aGlzLnF1ZXVlcyA9IFtdO1xuICAgIHRoaXMub3B0cyA9IHt9OyBcbiAgICB0aGlzLnBhcnNlciA9IHBhcnNlKHtcbiAgICAgIGRlbGltaXRlcjogJywnLFxuICAgICAgc2tpcF9lbXB0eV9saW5lczogdHJ1ZSxcbiAgICAgIGF1dG9fcGFyc2U6IHRydWVcbiAgICB9KTtcbiAgfVxuICBjcmVhdGVGcm9tKG9wdGlvbnMpIHtcbiAgICBsZXQgY2FsbGJhY2sgPSAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLm9wdHMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgdGhpcy5maW5pc2ggPSByZXNvbHZlO1xuICAgICAgdGhpcy5lcnJvciA9IHJlamVjdDtcbiAgICAgIHRoaXMucGFyc2VyLm9uKCdyZWFkYWJsZScsIHRoaXMucmVhZGFibGUuYmluZCh0aGlzKSApO1xuICAgICAgdGhpcy5wYXJzZXIub24oJ2VuZCcsIHRoaXMuZW5kLmJpbmQodGhpcykgKTtcbiAgICAgIHRoaXMucGFyc2VyLm9uKCdlcnJvcicsIHRoaXMuZXJyb3IuYmluZCh0aGlzKSApO1xuICAgICAgdGhpcy5xdWV1ZXMucHVzaCggdGhpcy5rbmV4KHRoaXMub3B0cy50YWJsZSkuZGVsKCkgKTtcblxuICAgICAgbGV0IGNzdiA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0odGhpcy5vcHRzLmZpbGUpO1xuICAgICAgY3N2LnBpcGUoIGljb252LmRlY29kZVN0cmVhbSh0aGlzLm9wdHMuZW5jb2RpbmcpICkucGlwZSh0aGlzLnBhcnNlcik7XG4gICAgfTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSggY2FsbGJhY2suYmluZCh0aGlzKSApO1xuICB9XG5cbiAgcmVhZGFibGUoKSB7XG4gICAgbGV0IG9iaiA9IHt9O1xuICAgIGxldCByZWNvcmQgPSB0aGlzLnBhcnNlci5yZWFkKCk7XG5cbiAgICBpZiAocmVjb3JkID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyc2VyLmNvdW50IDw9IDEpIHtcbiAgICAgIHRoaXMuaGVhZGVycyA9IHJlY29yZDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oZWFkZXJzLmZvckVhY2goKGNvbHVtbiwgaSkgPT4geyBvYmpbY29sdW1uXSA9IHJlY29yZFtpXTsgfSk7XG4gICAgICB0aGlzLnF1ZXVlcy5wdXNoKCB0aGlzLmtuZXgodGhpcy5vcHRzLnRhYmxlKS5pbnNlcnQob2JqKSApO1xuICAgIH1cbiAgfVxuXG4gIGVuZCgpIHtcbiAgICB0aGlzLmZpbmlzaChQcm9taXNlLmpvaW4uYXBwbHkoUHJvbWlzZSwgdGhpcy5xdWV1ZXMpKTtcbiAgfVxuXG59O1xuIl19