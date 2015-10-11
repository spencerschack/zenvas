define('point_sampler', ['exports', 'module', 'utils'], function (exports, module, _utils) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var PointSampler = (function () {
    function PointSampler(n) {
      _classCallCheck(this, PointSampler);

      this.weights = Array(n).fill(0).map(function (_, i) {
        return -Math.pow(i / n, 2) + 1;
      });
      this.xSamples = Array(n).fill(0);
      this.ySamples = Array(n).fill(0);
    }

    _createClass(PointSampler, [{
      key: 'push',
      value: function push(x, y) {
        this.xSamples.pop();
        this.xSamples.unshift(x);
        this.ySamples.pop();
        this.ySamples.unshift(y);
      }
    }, {
      key: 'angle',
      value: function angle() {
        return Math.atan2((0, _utils.weightedAverage)((0, _utils.pairs)(this.ySamples).map(function (s) {
          return s[0] - s[1];
        }), this.weights), (0, _utils.weightedAverage)((0, _utils.pairs)(this.xSamples).map(function (s) {
          return s[0] - s[1];
        }), this.weights));
      }
    }]);

    return PointSampler;
  })();

  module.exports = PointSampler;
});