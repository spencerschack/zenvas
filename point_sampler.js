import {weightedAverage} from 'utils';

const {atan2} = Math;

export default class PointSampler {

  constructor(n) {
    this.weights = Array(n).fill(0).map((_, i) => {
      return -Math.pow(i / n, 2) + 1;
    });
    this.vectors = Array(n).fill([0, 0]);
  }

  push(x, y) {
    if(this.lastX && this.lastY) {
      this.vectors.pop();
      this.vectors.unshift([x - this.lastX, y - this.lastY]);
    }
    this.lastX = x;
    this.lastY = y;
  }

  angle() {
    return atan2(
      this.vectors.map(v => v[1])::weightedAverage(this.weights),
      this.vectors.map(v => v[0])::weightedAverage(this.weights));
  }

}
