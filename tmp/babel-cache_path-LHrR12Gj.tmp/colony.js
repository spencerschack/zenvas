define('colony', ['exports', 'module', 'options', 'utils'], function (exports, module, _options, _utils) {
  'use strict';

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var random = Math.random;

  var Colony = (function () {
    function Colony(grow, x, y, color) {
      _classCallCheck(this, Colony);

      this.edges = [];

      this.context = grow.context;
      this.width = grow.width;
      this.height = grow.height;
      this.grid = grow.grid;
      this.plant(x, y, color);
    }

    _createClass(Colony, [{
      key: 'plant',
      value: function plant(x, y, color) {
        if (this.edges.length < _options.growEdgeLimit) {
          this.context.fillStyle = (0, _options.growColor)(color);
          this.context.fillRect(x, y, 1, 1);
          this.grid[x][y] = true;
          this.edges.push([x, y, color]);
        }
      }
    }, {
      key: 'grow',
      value: function grow() {
        var _this = this;

        var currentEdges = (0, _options.growEdgeSlice)(this.edges);
        currentEdges.forEach(function (edge) {
          return _this.spread(edge[0], edge[1], edge[2]);
        });
      }
    }, {
      key: 'neighbors',
      value: function neighbors(x, y) {
        var _this2 = this;

        var top = x > 0;
        var bottom = x < this.width - 1;
        var left = y > 0;
        var right = y < this.height - 1;

        return [top && [-1, 0], bottom && [+1, 0], top && left && [-1, -1], top && right && [-1, +1], bottom && left && [+1, -1], bottom && right && [+1, +1], left && [0, -1], right && [0, +1]].filter(function (n) {
          return n;
        }).map(function (n) {
          return [x + n[0], y + n[1]];
        }).filter(function (n) {
          return !_this2.grid[n[0]][n[1]] || random() < _options.growBackProbability;
        });
      }
    }, {
      key: 'spread',
      value: function spread(x, y, color) {
        var _context;

        var neighbors = (_context = this.neighbors(x, y), _utils.shuffle).call(_context);
        for (var i = 0; i < neighbors.length; i++) {
          var _neighbors$i = _slicedToArray(neighbors[i], 2);

          var nx = _neighbors$i[0];
          var ny = _neighbors$i[1];

          color = (color + _options.growColorIncrement) % 1;
          this.plant(nx, ny, color);
          var chance = random();
          if (chance < _options.growSpreadProbability) {
            this.spread(nx, ny, color);
            return;
          } else if (1 - chance < _options.growBranchProbability) {
            return;
          }
        }
      }
    }]);

    return Colony;
  })();

  module.exports = Colony;
});