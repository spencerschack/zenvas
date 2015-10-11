define('canvas', ['exports', 'module', 'grid', 'point_sampler', 'options', 'utils'], function (exports, module, _grid, _point_sampler, _options, _utils) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _Grid = _interopRequireDefault(_grid);

  var _PointSampler = _interopRequireDefault(_point_sampler);

  var ceil = Math.ceil;
  var floor = Math.floor;
  var cos = Math.cos;
  var sin = Math.sin;
  var max = Math.max;
  var min = Math.min;

  var Canvas = (function () {
    function Canvas() {
      var _this = this;

      _classCallCheck(this, Canvas);

      this.element = document.createElement('canvas');
      this.context = this.element.getContext('2d');
      document.body.appendChild(this.element);
      this.ratio = window.devicePixelRatio || 1;
      window.addEventListener('resize', function () {
        return _this.fitElement();
      });
      this.fitElement();
      var sampler = new _PointSampler['default'](20);
      window.addEventListener('mousemove', function (_ref) {
        var x = _ref.pageX;
        var y = _ref.pageY;

        sampler.push(x, y);
        var angle = sampler.angle();
        _this.brush(x, y, angle);
      });
    }

    _createClass(Canvas, [{
      key: 'fitElement',
      value: function fitElement() {
        var _this2 = this;

        var width = window.innerWidth;
        var height = window.innerHeight;

        this.grid = new _Grid['default'](width, height);
        this.width = width;
        this.height = height;
        this.element.width = width * this.ratio;
        this.element.height = height * this.ratio;
        this.context.scale(this.ratio, this.ratio);
        this.context.strokeStyle = _options.lineColor;
        this.grid.forEach(function (cell) {
          return cell.draw(_this2.context);
        });
      }
    }, {
      key: 'brush',
      value: function brush(x, y, angle) {
        var _this3 = this;

        var radius = _options.brushSize + _options.lineLength;
        var rows = ceil(2 * radius / _options.lineSpacing);
        var columns = ceil(2 * radius / _options.lineSpacing);
        var row = floor((y - radius) / _options.lineSpacing);
        var column = floor((x - radius) / _options.lineSpacing);
        this.redraw(column * _options.lineSpacing, row * _options.lineSpacing, columns * _options.lineSpacing, rows * _options.lineSpacing, function () {
          _this3.grid.view(row - 10, column - 10, rows + 20, columns + 20).forEach(function (cell) {
            var dist = (0, _utils.distance)(cell.x0 - x, cell.y0 - y);
            if (dist < _options.brushSize) {
              var effect = (0, _options.brushProfile)(dist / _options.brushSize);
              var _x = cos(angle) * _options.lineLength;
              var _y = sin(angle) * _options.lineLength;
              cell.x1 += (_x - cell.x1) * effect / 15;
              cell.y1 += (_y - cell.y1) * effect / 15;
            }
            cell.draw(_this3.context);
          });
        });
      }
    }, {
      key: 'redraw',
      value: function redraw(x, y, w, h, cb) {
        var context = this.context;

        context.clearRect(x, y, w, h);
        context.save();
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + w, y);
        context.lineTo(x + w, y + h);
        context.lineTo(x, y + h);
        context.clip();
        try {
          cb();
        } finally {
          context.restore();
        }
      }
    }]);

    return Canvas;
  })();

  module.exports = Canvas;
});