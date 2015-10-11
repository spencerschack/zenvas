import {
  weightedAverage,
  pairs,
  subtract
} from 'utils';

export default class PointSampler {

  constructor(n) {
    this.weights = Array(n).fill(0).map((_, i) => {
      return -Math.pow(i / n, 2) + 1;
    });
    this.xSamples = Array(n).fill(0);
    this.ySamples = Array(n).fill(0);
  }

  push(x, y) {
    this.xSamples.pop();
    this.xSamples.unshift(x);
    this.ySamples.pop();
    this.ySamples.unshift(y);
  }

  angle() {
    return Math.atan2(
      weightedAverage(pairs(this.ySamples).map(s => s[0] - s[1]), this.weights),
      weightedAverage(pairs(this.xSamples).map(s => s[0] - s[1]), this.weights));
  }

}
