define('point_sampler', ['exports', 'module', 'utils'], function (exports, module, _utils) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var atan2 = Math.atan2;

  var PointSampler = (function () {
    function PointSampler(n) {
      _classCallCheck(this, PointSampler);

      this.weights = Array(n).fill(0).map(function (_, i) {
        return -Math.pow(i / n, 2) + 1;
      });
      this.vectors = Array(n).fill([0, 0]);
    }

    _createClass(PointSampler, [{
      key: 'push',
      value: function push(x, y) {
        if (this.lastX && this.lastY) {
          this.vectors.pop();
          this.vectors.unshift([x - this.lastX, y - this.lastY]);
        }
        this.lastX = x;
        this.lastY = y;
      }
    }, {
      key: 'angle',
      value: function angle() {
        var _context;

        return atan2((_context = this.vectors.map(function (v) {
          return v[1];
        }), _utils.weightedAverage).call(_context, this.weights), (_context = this.vectors.map(function (v) {
          return v[0];
        }), _utils.weightedAverage).call(_context, this.weights));
      }
    }]);

    return PointSampler;
  })();

  module.exports = PointSampler;
});