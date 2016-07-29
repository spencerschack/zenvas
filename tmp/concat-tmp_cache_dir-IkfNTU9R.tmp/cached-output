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

  function strokeColor(line) {
    var saturation = _options.lineSaturation * 100;
    var angle = atan2(line.y1, line.x1) + PI / 4;
    var lightness = (_options.lineLightness + sin(angle) * _options.lineTint) * 100;
    return 'hsla(' + _options.lineHue + ', ' + saturation + '%, ' + lightness + '%, ' + _options.lineAlpha + ')';
  }

  function fillColor() {
    var saturation = _options.lineSaturation * 100;
    var lightness = _options.lineLightness * 100;
    return 'hsla(' + _options.lineHue + ', ' + saturation + '%, ' + lightness + '%, ' + _options.lineAlpha + ')';
  }

  var Line = (function () {
    function Line(x0, y0) {
      var x1 = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
      var y1 = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

      _classCallCheck(this, Line);

      this.x0 = x0;
      this.y0 = y0;
      this.x1 = x1;
      this.y1 = y1;
    }

    _createClass(Line, [{
      key: 'draw',
      value: function draw(context) {
        var x0 = this.x0;
        var y0 = this.y0;
        var x1 = this.x1;
        var y1 = this.y1;

        context.beginPath();
        if ((0, _utils.distance)(x1, y1) <= tolerance) {
          context.arc(x0, y0, 0.3, 0, 2 * PI);
          // context.fillStyle = fillColor();
          context.fill();
        } else {
          context.moveTo(x0, y0);
          context.lineTo(x0 + x1, y0 + y1);
          // context.strokeStyle = strokeColor(this);
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
  var lineSpacing = 3;
  exports.lineSpacing = lineSpacing;
  var lineLength = 50;
  exports.lineLength = lineLength;
  var lineHue = 0;
  exports.lineHue = lineHue;
  var lineSaturation = 0;
  exports.lineSaturation = lineSaturation;
  var lineAlpha = 0.35;
  exports.lineAlpha = lineAlpha;
  var lineTint = 0.15;
  exports.lineTint = lineTint;
  var lineLightness = 1 - lineTint;

  exports.lineLightness = lineLightness;
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
  var brushSize = 30;
  exports.brushSize = brushSize;
  var brushLength = 20;
  exports.brushLength = brushLength;
  var brushEffect = 0.15;
  exports.brushEffect = brushEffect;
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
});