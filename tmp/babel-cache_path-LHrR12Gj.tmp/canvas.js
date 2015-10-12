define('canvas', ['exports', 'module', 'grid', 'field', 'point_sampler', 'rectangle', 'options', 'utils'], function (exports, module, _grid, _field, _point_sampler, _rectangle, _options, _utils) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _Grid = _interopRequireDefault(_grid);

  var _Field = _interopRequireDefault(_field);

  var _PointSampler = _interopRequireDefault(_point_sampler);

  var _Rectangle = _interopRequireDefault(_rectangle);

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
      this.context.globalCompositionOperation = 'overlay';
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
        var width = window.innerWidth;
        var height = window.innerHeight;

        this.field = new _Field['default'](width, height);
        this.element.width = width * this.ratio;
        this.element.height = height * this.ratio;
        this.context.scale(this.ratio, this.ratio);
        this.context.strokeStyle = 'hsla(' + _options.lineHue + ', ' + _options.lineSaturation * 100 + '%, ' + _options.lineLightness * 100 + '%, ' + _options.lineAlpha + ')';;
        this.context.fillStyle = 'hsla(' + _options.lineHue + ', ' + _options.lineSaturation * 100 + '%, ' + _options.lineLightness * 100 + '%, ' + _options.lineAlpha + ')';
        this.field.grow(this.context);
      }
    }, {
      key: 'brush',
      value: function brush(x, y, angle) {
        var _this2 = this;

        var redraw = _options.brushSize + _options.lineLength;
        var field = redraw + _options.lineLength;
        this.redraw(_Rectangle['default'].circle(x, y, redraw), function () {
          _this2.field.within(_Rectangle['default'].circle(x, y, field)).forEach(function (line) {
            var dist = (0, _utils.distance)(line.x0 - x, line.y0 - y);
            if (dist < _options.brushSize) {
              var effect = (0, _options.brushProfile)(dist / _options.brushSize);
              var dx = cos(angle) * _options.lineLength - line.x1;
              var dy = sin(angle) * _options.lineLength - line.y1;
              line.x1 += dx * effect * _options.brushEffect;
              line.y1 += dy * effect * _options.brushEffect;
            }
            line.draw(_this2.context);
          });
        });
      }
    }, {
      key: 'redraw',
      value: function redraw(rect, cb) {
        var context = this.context;

        context.clearRect(rect.x, rect.y, rect.width, rect.height);
        context.save();
        context.beginPath();
        context.moveTo(rect.x0, rect.y0);
        context.lineTo(rect.x1, rect.y0);
        context.lineTo(rect.x1, rect.y1);
        context.lineTo(rect.x0, rect.y1);
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