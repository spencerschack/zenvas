define('field', ['exports', 'module', 'field/grow', 'rectangle', 'utils', 'options'], function (exports, module, _fieldGrow, _rectangle, _utils, _options) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _Grow = _interopRequireDefault(_fieldGrow);

  var _Rectangle = _interopRequireDefault(_rectangle);

  var ceil = Math.ceil;
  var floor = Math.floor;
  var min = Math.min;
  var max = Math.max;

  var Field = (function () {
    function Field(width, height) {
      _classCallCheck(this, Field);

      this.width = width;
      this.height = height;
      this.rows = ceil(height / _options.lineSpacing);
      this.columns = ceil(width / _options.lineSpacing);
      this.grid = (0, _utils.ndArray)(this.columns, this.rows, 0);
    }

    _createClass(Field, [{
      key: 'grow',
      value: function grow(context) {
        new _Grow['default'](this, context);
      }
    }, {
      key: 'insert',
      value: function insert(line) {
        var column = floor(line.x0 / _options.lineSpacing);
        var row = floor(line.y0 / _options.lineSpacing);
        this.grid[column][row].push(line);
      }
    }, {
      key: 'interval',
      value: function interval(rect) {
        var x0 = max(0, floor(rect.x0 / _options.lineSpacing));
        var y0 = max(0, floor(rect.y0 / _options.lineSpacing));
        var x1 = min(this.columns, ceil(rect.x1 / _options.lineSpacing));
        var y1 = min(this.rows, ceil(rect.y1 / _options.lineSpacing));
        return _Rectangle['default'].points(x0, y0, x1, y1);
      }
    }, {
      key: 'forEach',
      value: function forEach(fn) {
        for (var i = 0; i < this.grid.length; i++) {
          var column = this.grid[i];
          for (var j = 0; j < column.length; j++) {
            var cells = column[j];
            for (var k = 0; k < cells.length; k++) {
              fn(cells[k]);
            }
          }
        }
      }
    }, {
      key: 'within',
      value: function within(pixelRect) {
        var rect = this.interval(pixelRect);
        var results = [];
        for (var i = rect.x0; i < rect.x1; i++) {
          var column = this.grid[i];
          for (var j = rect.y0; j < rect.y1; j++) {
            var lines = column[j];
            for (var k = 0; k < lines.length; k++) {
              results.push(lines[k]);
            }
          }
        }
        return results;
      }
    }]);

    return Field;
  })();

  module.exports = Field;
});