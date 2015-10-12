define('field/grow', ['exports', 'module', 'rectangle', 'line', 'utils', 'options'], function (exports, module, _rectangle, _line, _utils, _options) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _Rectangle = _interopRequireDefault(_rectangle);

  var _Line = _interopRequireDefault(_line);

  var random = Math.random;

  var Colony = (function () {
    function Colony(field, context, x, y, hue) {
      _classCallCheck(this, Colony);

      this.edges = [];

      this.field = field;
      this.context = context;
      this.hue = hue;
      this.plant(x, y);
    }

    _createClass(Colony, [{
      key: 'plant',
      value: function plant(x, y) {
        if (this.edges.length < _options.growEdgeLimit) {
          var line = new _Line['default'](x, y, 0, 0, this.hue);
          this.hue = (this.hue + _options.growColorIncrement) % 360;
          line.draw(this.context);
          this.field.insert(line);
          this.edges.push([x, y]);
        }
      }
    }, {
      key: 'grow',
      value: function grow() {
        var _this = this;

        var currentEdges = this.edges.splice(0, _options.growSpreadLimit);
        currentEdges.forEach(function (edge) {
          return _this.spread(edge[0], edge[1]);
        });
      }
    }, {
      key: 'spread',
      value: function spread(x, y) {
        var _this2 = this;

        var neighbors = this.field.within(_Rectangle['default'].circle(x, y, _options.growRadius));
        var attempts = _options.growAttempts;

        var _loop = function () {
          var newX = x + (random() * 2 - 1) * _options.growRadius;
          var newY = y + (random() * 2 - 1) * _options.growRadius;
          if (newX > 0 && newY > 0 && newX < _this2.field.width && newY < _this2.field.height) {
            if (neighbors.every(function (neighbor) {
              return (0, _utils.distance)(neighbor.x0 - newX, neighbor.y0 - newY) >= _options.lineSpacing;
            })) {
              _this2.plant(newX, newY);
              var chance = random();
              if (chance < _options.growSpreadProbability) {
                _this2.spread(newX, newY);
                return {
                  v: undefined
                };
              } else if (1 - chance < _options.growBranchProbability) {
                return {
                  v: undefined
                };
              }
            }
          }
        };

        while (attempts--) {
          var _ret = _loop();

          if (typeof _ret === 'object') return _ret.v;
        }
      }
    }]);

    return Colony;
  })();

  var Grow = (function () {
    function Grow(field, context) {
      _classCallCheck(this, Grow);

      this.colonies = [];

      this.field = field;
      this.context = context;
      this.hue = 0;
      this.seed();
      this.grow();
    }

    _createClass(Grow, [{
      key: 'seed',
      value: function seed() {
        var _field = this.field;
        var width = _field.width;
        var height = _field.height;

        var count = _options.growColonyCount;
        while (count--) {
          var x = random() * width;
          var y = random() * height;
          var hue = random() * 360;
          var colony = new Colony(this.field, this.context, x, y, hue);
          this.colonies.push(colony);
        }
      }
    }, {
      key: 'grow',
      value: function grow() {
        var _this3 = this;

        this.colonies.forEach(function (colony) {
          return colony.grow();
        });
        requestAnimationFrame(function () {
          return _this3.grow();
        });
      }
    }]);

    return Grow;
  })();

  module.exports = Grow;
});