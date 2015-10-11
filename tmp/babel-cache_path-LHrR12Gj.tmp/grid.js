define('grid', ['exports', 'module', 'line', 'options'], function (exports, module, _line, _options) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _Line = _interopRequireDefault(_line);

  var ceil = Math.ceil;
  var min = Math.min;
  var max = Math.max;

  var View = (function () {
    function View(grid, row, column, rows, columns) {
      _classCallCheck(this, View);

      this.grid = grid;
      this.row0 = max(row, 0);
      this.column0 = max(column, 0);
      this.row1 = min(row + rows, grid.rows);
      this.column1 = min(column + columns, grid.columns);
    }

    _createClass(View, [{
      key: 'forEach',
      value: function forEach(fn) {
        for (var row = this.row0; row < this.row1; row++) {
          for (var column = this.column0; column < this.column1; column++) {
            fn(this.grid.array[row * this.grid.columns + column]);
          }
        }
      }
    }]);

    return View;
  })();

  var Grid = (function () {
    function Grid(width, height) {
      _classCallCheck(this, Grid);

      this.columns = ceil(width / _options.lineSpacing);
      this.rows = ceil(height / _options.lineSpacing);
      this.array = new Array(this.columns * this.rows);
      for (var row = 0; row < this.rows; row++) {
        for (var column = 0; column < this.columns; column++) {
          var x = (column + 0.5) * _options.lineSpacing;
          var y = (row + 0.5) * _options.lineSpacing;
          this.array[row * this.columns + column] = new _Line['default'](x, y, 0, 0);
        }
      }
    }

    _createClass(Grid, [{
      key: 'view',
      value: function view(row, column, rows, columns) {
        return new View(this, row, column, rows, columns);
      }
    }, {
      key: 'forEach',
      value: function forEach(fn) {
        for (var i = 0, _length = this.array.length; i < _length; i++) {
          fn(this.array[i]);
        }
      }
    }]);

    return Grid;
  })();

  module.exports = Grid;
});