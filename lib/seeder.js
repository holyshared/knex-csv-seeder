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
        auto_parse: true
      });

      var queues = [knex(tableName).del()];

      var headers = [];

      parser.on('readable', function () {
        var obj = {};
        var record = parser.read();

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZWVkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBSXdCLE1BQU07Ozs7Ozs7Ozs7Ozs7Ozs7QUFBZixTQUFTLE1BQU0sQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFxQjtNQUFuQixRQUFRLHlEQUFHLE1BQU07O0FBRW5FLFNBQU8sVUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFLOztBQUV4QixXQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSzs7QUFFdEMsVUFBSSxNQUFNLEdBQUcsd0JBQU07QUFDakIsaUJBQVMsRUFBRSxHQUFHO0FBQ2Qsa0JBQVUsRUFBRSxJQUFJO09BQ2pCLENBQUMsQ0FBQzs7QUFFSCxVQUFJLE1BQU0sR0FBRyxDQUNYLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FDdEIsQ0FBQzs7QUFFRixVQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7O0FBRWpCLFlBQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLFlBQU07QUFDMUIsWUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2IsWUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDOztBQUUzQixZQUFJLE1BQU0sQ0FBQyxLQUFLLElBQUksQ0FBQyxFQUFFO0FBQ3JCLGlCQUFPLEdBQUcsTUFBTSxDQUFDO1NBQ2xCLE1BQU07QUFDTCxpQkFBTyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUs7QUFBRSxlQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1dBQUUsQ0FBQyxDQUFDO0FBQzdELGdCQUFNLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUUsQ0FBQztTQUM1QztPQUNGLENBQUMsQ0FBQzs7QUFFSCxZQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxZQUFNO0FBQ3JCLGVBQU8sQ0FBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUUsQ0FBQztPQUNoRCxDQUFDLENBQUM7O0FBRUgsWUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRTNCLFVBQUksR0FBRyxHQUFHLGFBQUcsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDeEMsU0FBRyxDQUFDLElBQUksQ0FBRSxvQkFBTSxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDdkQsQ0FBQyxDQUFDO0dBQ0osQ0FBQztDQUVIIiwiZmlsZSI6InNlZWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGFyc2UgZnJvbSAnY3N2LXBhcnNlJztcbmltcG9ydCBpY29udiBmcm9tICdpY29udi1saXRlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2VlZGVyKHRhYmxlTmFtZSwgZmlsZVBhdGgsIGVuY29kaW5nID0gJ3V0ZjgnKSB7XG5cbiAgcmV0dXJuIChrbmV4LCBQcm9taXNlKSA9PiB7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICBsZXQgcGFyc2VyID0gcGFyc2Uoe1xuICAgICAgICBkZWxpbWl0ZXI6ICcsJyxcbiAgICAgICAgYXV0b19wYXJzZTogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIGxldCBxdWV1ZXMgPSBbXG4gICAgICAgIGtuZXgodGFibGVOYW1lKS5kZWwoKVxuICAgICAgXTtcblxuICAgICAgbGV0IGhlYWRlcnMgPSBbXTtcblxuICAgICAgcGFyc2VyLm9uKCdyZWFkYWJsZScsICgpID0+IHtcbiAgICAgICAgbGV0IG9iaiA9IHt9O1xuICAgICAgICBsZXQgcmVjb3JkID0gcGFyc2VyLnJlYWQoKTtcblxuICAgICAgICBpZiAocGFyc2VyLmNvdW50IDw9IDEpIHtcbiAgICAgICAgICBoZWFkZXJzID0gcmVjb3JkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGhlYWRlcnMuZm9yRWFjaCgoY29sdW1uLCBpKSA9PiB7IG9ialtjb2x1bW5dID0gcmVjb3JkW2ldOyB9KTtcbiAgICAgICAgICBxdWV1ZXMucHVzaCgga25leCh0YWJsZU5hbWUpLmluc2VydChvYmopICk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBwYXJzZXIub24oJ2VuZCcsICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSggUHJvbWlzZS5qb2luLmFwcGx5KFByb21pc2UsIHF1ZXVlcykgKTtcbiAgICAgIH0pO1xuXG4gICAgICBwYXJzZXIub24oJ2Vycm9yJywgcmVqZWN0KTtcblxuICAgICAgbGV0IGNzdiA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0oZmlsZVBhdGgpO1xuICAgICAgY3N2LnBpcGUoIGljb252LmRlY29kZVN0cmVhbShlbmNvZGluZykgKS5waXBlKHBhcnNlcik7XG4gICAgfSk7XG4gIH07XG5cbn1cbiJdfQ==