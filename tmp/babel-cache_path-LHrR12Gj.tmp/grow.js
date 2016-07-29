define('grow', ['exports', 'module', 'colony', 'options', 'utils'], function (exports, module, _colony, _options, _utils) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _Colony = _interopRequireDefault(_colony);

  var random = Math.random;
  var round = Math.round;

  var Grow = (function () {
    function Grow(context, width, height) {
      _classCallCheck(this, Grow);

      this.colonies = [];

      this.context = context;
      this.width = width;
      this.height = height;
      this.grid = (0, _utils.ndArray)(width, height);
      this.seed();
      this.grow();
    }

    _createClass(Grow, [{
      key: 'seed',
      value: function seed() {
        var width = this.width;
        var height = this.height;

        var count = _options.growColonyCount;
        while (count--) {
          var x = round(random() * width);
          var y = round(random() * height);
          var color = random();
          var colony = new _Colony['default'](this, x, y, color);
          this.colonies.push(colony);
        }
      }
    }, {
      key: 'grow',
      value: function grow() {
        var _this = this;

        this.colonies.forEach(function (colony) {
          return colony.grow();
        });
        requestAnimationFrame(function () {
          return _this.grow();
        });
      }
    }]);

    return Grow;
  })();

  module.exports = Grow;
});