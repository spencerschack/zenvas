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