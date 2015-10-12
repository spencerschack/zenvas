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
define('field', ['exports', 'module', 'field/grow', 'rectangle', 'utils', 'options'], function (exports, module, _fieldGrow, _rectangle, _utils, _options) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _Grow = _interopRequireDefault(_fieldGrow);

  var _Rectangle = _interopRequireDefault(_rectangle);

  var ceil = Math.ceil;
  var floor = Math.floor;
  var min = Math.min;
  var max = Math.max;

  var Field = (function () {
    function Field(width, height) {
      _classCallCheck(this, Field);

      this.width = width;
      this.height = height;
      this.rows = ceil(height / _options.lineSpacing);
      this.columns = ceil(width / _options.lineSpacing);
      this.grid = (0, _utils.ndArray)(this.columns, this.rows, 0);
    }

    _createClass(Field, [{
      key: 'grow',
      value: function grow(context) {
        new _Grow['default'](this, context);
      }
    }, {
      key: 'insert',
      value: function insert(line) {
        var column = floor(line.x0 / _options.lineSpacing);
        var row = floor(line.y0 / _options.lineSpacing);
        this.grid[column][row].push(line);
      }
    }, {
      key: 'interval',
      value: function interval(rect) {
        var x0 = max(0, floor(rect.x0 / _options.lineSpacing));
        var y0 = max(0, floor(rect.y0 / _options.lineSpacing));
        var x1 = min(this.columns, ceil(rect.x1 / _options.lineSpacing));
        var y1 = min(this.rows, ceil(rect.y1 / _options.lineSpacing));
        return _Rectangle['default'].points(x0, y0, x1, y1);
      }
    }, {
      key: 'forEach',
      value: function forEach(fn) {
        for (var i = 0; i < this.grid.length; i++) {
          var column = this.grid[i];
          for (var j = 0; j < column.length; j++) {
            var cells = column[j];
            for (var k = 0; k < cells.length; k++) {
              fn(cells[k]);
            }
          }
        }
      }
    }, {
      key: 'within',
      value: function within(pixelRect) {
        var rect = this.interval(pixelRect);
        var results = [];
        for (var i = rect.x0; i < rect.x1; i++) {
          var column = this.grid[i];
          for (var j = rect.y0; j < rect.y1; j++) {
            var lines = column[j];
            for (var k = 0; k < lines.length; k++) {
              results.push(lines[k]);
            }
          }
        }
        return results;
      }
    }]);

    return Field;
  })();

  module.exports = Field;
});
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
define('grid', ['exports', 'module', 'line', 'options'], function (exports, module, _line, _options) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _Line = _interopRequireDefault(_line);

  var ceil = Math.ceil;
  var min = Math.min;
  var max = Math.max;

  var View = (function () {
    function View(grid, row, column, rows, columns) {
      _classCallCheck(this, View);

      this.grid = grid;
      this.row0 = max(row, 0);
      this.column0 = max(column, 0);
      this.row1 = min(row + rows, grid.rows);
      this.column1 = min(column + columns, grid.columns);
    }

    _createClass(View, [{
      key: 'forEach',
      value: function forEach(fn) {
        for (var row = this.row0; row < this.row1; row++) {
          for (var column = this.column0; column < this.column1; column++) {
            fn(this.grid.array[row * this.grid.columns + column]);
          }
        }
      }
    }]);

    return View;
  })();

  var Grid = (function () {
    function Grid(width, height) {
      _classCallCheck(this, Grid);

      this.columns = ceil(width / _options.lineSpacing);
      this.rows = ceil(height / _options.lineSpacing);
      this.array = new Array(this.columns * this.rows);
      for (var row = 0; row < this.rows; row++) {
        for (var column = 0; column < this.columns; column++) {
          var x = (column + 0.5) * _options.lineSpacing;
          var y = (row + 0.5) * _options.lineSpacing;
          this.array[row * this.columns + column] = new _Line['default'](x, y);
        }
      }
    }

    _createClass(Grid, [{
      key: 'view',
      value: function view(row, column, rows, columns) {
        return new View(this, row, column, rows, columns);
      }
    }, {
      key: 'forEach',
      value: function forEach(fn) {
        for (var i = 0, _length = this.array.length; i < _length; i++) {
          fn(this.array[i]);
        }
      }
    }]);

    return Grid;
  })();

  module.exports = Grid;
});
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
  var pow = Math.pow;
  var sqrt = Math.sqrt;
  var lineSpacing = 2.5;
  exports.lineSpacing = lineSpacing;
  var lineLength = 70;
  exports.lineLength = lineLength;
  var lineWidth = 1;
  exports.lineWidth = lineWidth;
  var lineHue = 0;
  exports.lineHue = lineHue;
  var lineSaturation = 0.25;
  exports.lineSaturation = lineSaturation;
  var lineLightness = 0.5;
  exports.lineLightness = lineLightness;
  var lineAlpha = 0.75;
  exports.lineAlpha = lineAlpha;
  var lineTint = 0.15;

  exports.lineTint = lineTint;
  var brushProfiles = {
    flat: function flat() {
      return 1;
    },
    sharp: function sharp(x) {
      return 1 - x;
    },
    round: function round(x) {
      return sqrt(1 - pow(x, 2));
    },
    point: function point(x) {
      return 1 - sqrt(1 - pow(x - 1, 2));
    }
  };
  var brushProfile = brushProfiles.sharp;
  exports.brushProfile = brushProfile;
  var brushSize = 20;
  exports.brushSize = brushSize;
  var brushLength = 10;
  exports.brushLength = brushLength;
  var brushEffect = 0.15;

  exports.brushEffect = brushEffect;
  var growAttempts = 10;
  exports.growAttempts = growAttempts;
  var growBranchProbability = 0.05;
  exports.growBranchProbability = growBranchProbability;
  var growSpreadProbability = 0.05;
  exports.growSpreadProbability = growSpreadProbability;
  var growEdgeLimit = 1000;
  exports.growEdgeLimit = growEdgeLimit;
  var growSpreadLimit = 300;
  exports.growSpreadLimit = growSpreadLimit;
  var growRadius = 10;
  exports.growRadius = growRadius;
  var growColorIncrement = 0.001;
  exports.growColorIncrement = growColorIncrement;
  var growColonyCount = 10;
  exports.growColonyCount = growColonyCount;
});
define("point", ["exports", "module"], function (exports, module) {
  "use strict";

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var Point = (function () {
    function Point(x, y) {
      _classCallCheck(this, Point);

      this.x = x;
      this.y = y;
    }

    _createClass(Point, [{
      key: "subtract",
      value: function subtract(point) {
        return new Vector(this.x - point.x, this.y - point.y);
      }
    }, {
      key: "distance",
      value: function distance(point) {
        return this.subtract(point).length;
      }
    }]);

    return Point;
  })();

  module.exports = Point;
});
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
define("rectangle", ["exports", "module"], function (exports, module) {
  "use strict";

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var Rectangle = (function () {
    _createClass(Rectangle, null, [{
      key: "circle",
      value: function circle(cx, cy, r) {
        return new Rectangle(cx - r, cy - r, r * 2, r * 2);
      }
    }, {
      key: "points",
      value: function points(x0, y0, x1, y1) {
        return new Rectangle(x0, y0, x1 - x0, y1 - y0);
      }
    }]);

    function Rectangle(x, y, width, height) {
      _classCallCheck(this, Rectangle);

      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }

    _createClass(Rectangle, [{
      key: "x0",
      get: function get() {
        return this.x;
      }
    }, {
      key: "y0",
      get: function get() {
        return this.y;
      }
    }, {
      key: "x1",
      get: function get() {
        return this.x + this.width;
      }
    }, {
      key: "y1",
      get: function get() {
        return this.y + this.height;
      }
    }, {
      key: "cx",
      get: function get() {
        return this.x + this.width / 2;
      }
    }, {
      key: "cy",
      get: function get() {
        return this.y + this.height / 2;
      }
    }]);

    return Rectangle;
  })();

  module.exports = Rectangle;
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
  var sin = Math.sin;
  var ata2 = Math.ata2;
  var min = Math.min;
  var max = Math.max;
  var sqrt = Math.sqrt;

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
});