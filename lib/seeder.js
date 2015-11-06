'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = seeder;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _csvParse = require('csv-parse');

var _csvParse2 = _interopRequireDefault(_csvParse);

var _iconvLite = require('iconv-lite');

var _iconvLite2 = _interopRequireDefault(_iconvLite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function seeder(tableName, filePath) {
  var encoding = arguments.length <= 2 || arguments[2] === undefined ? 'utf8' : arguments[2];

  return function (knex, Promise) {

    return new Promise(function (resolve, reject) {

      var parser = (0, _csvParse2.default)({
        delimiter: ',',
        skip_empty_lines: true,
        auto_parse: true
      });

      var queues = [knex(tableName).del()];

      var headers = [];

      parser.on('readable', function () {
        var obj = {};
        var record = parser.read();

        if (record === null) {
          return;
        }

        if (parser.count <= 1) {
          headers = record;
        } else {
          headers.forEach(function (column, i) {
            obj[column] = record[i];
          });
          queues.push(knex(tableName).insert(obj));
        }
      });

      parser.on('end', function () {
        resolve(Promise.join.apply(Promise, queues));
      });

      parser.on('error', reject);

      var csv = _fs2.default.createReadStream(filePath);
      csv.pipe(_iconvLite2.default.decodeStream(encoding)).pipe(parser);
    });
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZWVkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBSXdCLE1BQU07Ozs7Ozs7Ozs7Ozs7Ozs7QUFBZixTQUFTLE1BQU0sQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFxQjtNQUFuQixRQUFRLHlEQUFHLE1BQU07O0FBRW5FLFNBQU8sVUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFLOztBQUV4QixXQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSzs7QUFFdEMsVUFBSSxNQUFNLEdBQUcsd0JBQU07QUFDakIsaUJBQVMsRUFBRSxHQUFHO0FBQ2Qsd0JBQWdCLEVBQUUsSUFBSTtBQUN0QixrQkFBVSxFQUFFLElBQUk7T0FDakIsQ0FBQyxDQUFDOztBQUVILFVBQUksTUFBTSxHQUFHLENBQ1gsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUN0QixDQUFDOztBQUVGLFVBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQzs7QUFFakIsWUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsWUFBTTtBQUMxQixZQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDYixZQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRTNCLFlBQUksTUFBTSxLQUFLLElBQUksRUFBRTtBQUNuQixpQkFBTztTQUNSOztBQUVELFlBQUksTUFBTSxDQUFDLEtBQUssSUFBSSxDQUFDLEVBQUU7QUFDckIsaUJBQU8sR0FBRyxNQUFNLENBQUM7U0FDbEIsTUFBTTtBQUNMLGlCQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTSxFQUFFLENBQUMsRUFBSztBQUFFLGVBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7V0FBRSxDQUFDLENBQUM7QUFDN0QsZ0JBQU0sQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBRSxDQUFDO1NBQzVDO09BQ0YsQ0FBQyxDQUFDOztBQUVILFlBQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLFlBQU07QUFDckIsZUFBTyxDQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBRSxDQUFDO09BQ2hELENBQUMsQ0FBQzs7QUFFSCxZQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFM0IsVUFBSSxHQUFHLEdBQUcsYUFBRyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN4QyxTQUFHLENBQUMsSUFBSSxDQUFFLG9CQUFNLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN2RCxDQUFDLENBQUM7R0FDSixDQUFDO0NBRUgiLCJmaWxlIjoic2VlZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXJzZSBmcm9tICdjc3YtcGFyc2UnO1xuaW1wb3J0IGljb252IGZyb20gJ2ljb252LWxpdGUnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzZWVkZXIodGFibGVOYW1lLCBmaWxlUGF0aCwgZW5jb2RpbmcgPSAndXRmOCcpIHtcblxuICByZXR1cm4gKGtuZXgsIFByb21pc2UpID0+IHtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgIGxldCBwYXJzZXIgPSBwYXJzZSh7XG4gICAgICAgIGRlbGltaXRlcjogJywnLFxuICAgICAgICBza2lwX2VtcHR5X2xpbmVzOiB0cnVlLFxuICAgICAgICBhdXRvX3BhcnNlOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgbGV0IHF1ZXVlcyA9IFtcbiAgICAgICAga25leCh0YWJsZU5hbWUpLmRlbCgpXG4gICAgICBdO1xuXG4gICAgICBsZXQgaGVhZGVycyA9IFtdO1xuXG4gICAgICBwYXJzZXIub24oJ3JlYWRhYmxlJywgKCkgPT4ge1xuICAgICAgICBsZXQgb2JqID0ge307XG4gICAgICAgIGxldCByZWNvcmQgPSBwYXJzZXIucmVhZCgpO1xuXG4gICAgICAgIGlmIChyZWNvcmQgPT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyc2VyLmNvdW50IDw9IDEpIHtcbiAgICAgICAgICBoZWFkZXJzID0gcmVjb3JkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGhlYWRlcnMuZm9yRWFjaCgoY29sdW1uLCBpKSA9PiB7IG9ialtjb2x1bW5dID0gcmVjb3JkW2ldOyB9KTtcbiAgICAgICAgICBxdWV1ZXMucHVzaCgga25leCh0YWJsZU5hbWUpLmluc2VydChvYmopICk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBwYXJzZXIub24oJ2VuZCcsICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSggUHJvbWlzZS5qb2luLmFwcGx5KFByb21pc2UsIHF1ZXVlcykgKTtcbiAgICAgIH0pO1xuXG4gICAgICBwYXJzZXIub24oJ2Vycm9yJywgcmVqZWN0KTtcblxuICAgICAgbGV0IGNzdiA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0oZmlsZVBhdGgpO1xuICAgICAgY3N2LnBpcGUoIGljb252LmRlY29kZVN0cmVhbShlbmNvZGluZykgKS5waXBlKHBhcnNlcik7XG4gICAgfSk7XG4gIH07XG5cbn1cbiJdfQ==