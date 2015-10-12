define('line', ['exports', 'module', 'utils', 'options'], function (exports, module, _utils, _options) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var abs = Math.abs;
  var atan2 = Math.atan2;
  var PI = Math.PI;
  var sin = Math.sin;

  var tolerance = 0.6;

  function strokeColor() {
    var saturation = _options.lineSaturation * 100;
    var lightness = _options.lineLightness * 100;
    return 'hsla(' + this.hue + ', ' + saturation + '%, ' + lightness + '%, ' + _options.lineAlpha + ')';
  }

  function fillColor() {
    var saturation = _options.lineSaturation * 100;
    var lightness = _options.lineLightness * 100;
    return 'hsla(' + this.hue + ', ' + saturation + '%, ' + lightness + '%, ' + _options.lineAlpha + ')';
  }

  var Line = (function () {
    function Line(x0, y0) {
      var x1 = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
      var y1 = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
      var hue = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];

      _classCallCheck(this, Line);

      this.x0 = x0;
      this.y0 = y0;
      this.x1 = x1;
      this.y1 = y1;
      this.hue = hue;
    }

    _createClass(Line, [{
      key: 'draw',
      value: function draw(context) {
        var x0 = this.x0;
        var y0 = this.y0;
        var x1 = this.x1;
        var y1 = this.y1;

        if ((0, _utils.distance)(x1, y1) <= tolerance) {
          context.fillStyle = fillColor.call(this);
          context.fillRect(x0, y0, 1, 1);
        } else {
          context.beginPath();
          context.moveTo(x0, y0);
          context.lineTo(x0 + x1, y0 + y1);
          context.strokeStyle = strokeColor.call(this);
          context.stroke();
        }
      }
    }]);

    return Line;
  })();

  module.exports = Line;
});