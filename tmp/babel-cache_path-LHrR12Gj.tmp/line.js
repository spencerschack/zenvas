define("line", ["exports", "module"], function (exports, module) {
  "use strict";

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var Line = (function () {
    function Line(x0, y0, x1, y1) {
      _classCallCheck(this, Line);

      this.x0 = x0;
      this.y0 = y0;
      this.x1 = x1;
      this.y1 = y1;
    }

    _createClass(Line, [{
      key: "draw",
      value: function draw(context) {
        var x0 = this.x0;
        var y0 = this.y0;
        var x1 = this.x1;
        var y1 = this.y1;

        if (x1 !== 0 || y1 !== 0) {
          context.beginPath();
          context.moveTo(x0, y0);
          context.lineTo(x0 + x1, y0 + y1);
          context.stroke();
        }
      }
    }]);

    return Line;
  })();

  module.exports = Line;
});