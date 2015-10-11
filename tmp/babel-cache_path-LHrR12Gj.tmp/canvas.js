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
      var sampler = new _PointSampler['default'](_options.brushLength);
      window.addEventListener('mousemove', function (_ref) {
        var x = _ref.pageX;
        var y = _ref.pageY;
        var shiftKey = _ref.shiftKey;

        if (!shiftKey) {
          sampler.push(x, y);
          var angle = sampler.angle();
          _this.brush(x, y, angle);
        }
      });
    }

    _createClass(Canvas, [{
      key: 'fitElement',
      value: function fitElement() {
        var _this2 = this;

        var width = window.innerWidth;
        var height = window.innerHeight;

        this.grid = new _Grid['default'](width, height);
        this.element.width = width * this.ratio;
        this.element.height = height * this.ratio;
        this.context.scale(this.ratio, this.ratio);
        this.context.strokeStyle = 'hsla(' + _options.lineHue + ', ' + _options.lineSaturation * 100 + '%, ' + _options.lineLightness * 100 + '%, ' + _options.lineAlpha + ')';;
        this.context.fillStyle = 'hsla(' + _options.lineHue + ', ' + _options.lineSaturation * 100 + '%, ' + _options.lineLightness * 100 + '%, ' + _options.lineAlpha + ')';
        this.grid.forEach(function (cell) {
          return cell.draw(_this2.context);
        });
      }
    }, {
      key: 'brush',
      value: function brush(x, y, angle) {
        var _this3 = this;

        var inner = _options.brushSize + _options.lineLength;
        var outer = inner + _options.lineLength;
        var row = floor((y - outer) / _options.lineSpacing);
        var column = floor((x - outer) / _options.lineSpacing);
        var intervals = ceil(2 * outer / _options.lineSpacing);
        this.redraw(x - inner, y - inner, 2 * inner, 2 * inner, function () {
          _this3.grid.view(row, column, intervals, intervals).forEach(function (cell) {
            var dist = (0, _utils.distance)(cell.x0 - x, cell.y0 - y);
            if (dist < _options.brushSize) {
              var effect = (0, _options.brushProfile)(dist / _options.brushSize);
              var dx = cos(angle) * _options.lineLength - cell.x1;
              var dy = sin(angle) * _options.lineLength - cell.y1;
              cell.x1 += dx * effect * _options.brushEffect;
              cell.y1 += dy * effect * _options.brushEffect;
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