define('options', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  var pow = Math.pow;
  var sqrt = Math.sqrt;
  var lineSpacing = 4;
  exports.lineSpacing = lineSpacing;
  var lineLength = 50;
  exports.lineLength = lineLength;
  var lineColor = 'rgba(255, 255, 255, 0.35)';

  exports.lineColor = lineColor;
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
  var brushProfile = brushProfiles.round;
  exports.brushProfile = brushProfile;
  var brushSize = 30;

  exports.brushSize = brushSize;
  exports['default'] = {
    lineSpacing: lineSpacing,
    lineLength: lineLength,
    lineColor: lineColor,
    brushSize: brushSize
  };
});