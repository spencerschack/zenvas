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