define('utils', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
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

  function weightedAverage(arr, weights) {
    return dot(arr, weights) / sum(weights);
  }

  function pairs(arr) {
    return Array(arr.length - 1).fill(0).map(function (_, i) {
      return [arr[i], arr[i + 1]];
    });
  }

  function limit(n, lower, upper) {
    console.log('limit', n, lower, upper);
    return max(min(n, upper), lower);
  }
});