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