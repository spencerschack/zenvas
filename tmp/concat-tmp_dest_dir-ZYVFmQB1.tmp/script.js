define('canvas', ['exports', 'module', 'grow'], function (exports, module, _grow) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _Grow = _interopRequireDefault(_grow);

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
    }

    _createClass(Canvas, [{
      key: 'fitElement',
      value: function fitElement() {
        var width = window.innerWidth;
        var height = window.innerHeight;

        this.element.width = width * this.ratio;
        this.element.height = height * this.ratio;
        this.context.scale(this.ratio, this.ratio);
        new _Grow['default'](this.context, width, height);
      }
    }]);

    return Canvas;
  })();

  module.exports = Canvas;
});
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
define('main', ['exports', 'module', 'canvas'], function (exports, module, _canvas) {
  'use strict';

  module.exports = main;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Canvas = _interopRequireDefault(_canvas);

  function main() {
    var canvas = new _Canvas['default']();
  }
});
define("options", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var abs = Math.abs;

  var growEdgeSlices = {
    first: function first(arr) {
      return arr.splice(0, growSpreadLimit);
    },
    last: function last(arr) {
      return arr.splice(arr.length - growSpreadLimit, growSpreadLimit);
    }
  };
  var growColors = {
    rainbow: function rainbow(n) {
      return "hsl(" + n * 360 + ", 65%, 65%";
    },
    clouds: function clouds(n) {
      n = 2 * abs(n - 0.5);
      return "hsl(" + (n * 100 + 150) + ", " + (65 + n * 15) + "%, " + (50 + n * 10) + "%";
    }
  };
  var growEdgeSlice = growEdgeSlices.last;
  exports.growEdgeSlice = growEdgeSlice;
  var growColor = growColors.rainbow;
  exports.growColor = growColor;
  var growBranchProbability = 0.05;
  exports.growBranchProbability = growBranchProbability;
  var growSpreadProbability = 0.5;
  exports.growSpreadProbability = growSpreadProbability;
  var growBackProbability = 0.05;
  exports.growBackProbability = growBackProbability;
  var growEdgeLimit = 100000;
  exports.growEdgeLimit = growEdgeLimit;
  var growSpreadLimit = 100;
  exports.growSpreadLimit = growSpreadLimit;
  var growColorIncrement = 0.0001;
  exports.growColorIncrement = growColorIncrement;
  var growColonyCount = 50;
  exports.growColonyCount = growColonyCount;
});
define("utils", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.angle = angle;
  exports.distance = distance;
  exports.add = add;
  exports.subtract = subtract;
  exports.sum = sum;
  exports.average = average;
  exports.dot = dot;
  exports.weightedAverage = weightedAverage;
  exports.pairs = pairs;
  exports.limit = limit;
  exports.sign = sign;
  exports.ndArray = ndArray;
  exports.slicedEach = slicedEach;
  exports.shuffle = shuffle;
  var sin = Math.sin;
  var ata2 = Math.ata2;
  var min = Math.min;
  var max = Math.max;
  var sqrt = Math.sqrt;
  var floor = Math.floor;
  var random = Math.random;

  function angle(a, b) {
    return atan2(a[1] - b[1], a[0] - b[0]);
  }

  function distance(x, y) {
    return sqrt(x * x + y * y);
  }

  function add(a, b) {
    return a + b;
  }

  function subtract(a, b) {
    return a - b;
  }

  function sum(arr) {
    return arr.reduce(add);
  }

  function average(arr) {
    return sum(arr) / arr.length;
  }

  function dot(a, b) {
    return a.reduce(function (sum, item, index) {
      return sum + item * b[index];
    }, 0);
  }

  function weightedAverage(weights) {
    return dot(this, weights) / sum(weights);
  }

  function pairs() {
    var _this = this;

    return Array(this.length - 1).fill(0).map(function (_, i) {
      return [_this[i], _this[i + 1]];
    });
  }

  function limit(n, lower, upper) {
    return max(min(n, upper), lower);
  }

  function sign(n) {
    return n > 0 ? 1 : n < 0 ? -1 : 0;
  }

  function ndArray(dimension) {
    for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }

    if (dimension === undefined) return;
    return Array(dimension).fill(0).map(function () {
      return ndArray.apply(undefined, rest);
    });
  }

  function slicedEach(min, max, fn) {
    for (var i = min; i < max; i++) {
      fn(this[i]);
    }
  }

  function shuffle() {
    for (var i = this.length - 1; i > 0; i--) {
      var index = floor(random() * i);
      var _ref = [this[index], this[i]];
      this[i] = _ref[0];
      this[index] = _ref[1];
    }
    return this;
  }
});