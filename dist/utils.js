const {
  sin, ata2,
  min, max,
  sqrt
} = Math;

export function angle(a, b) {
  return atan2(a[1] - b[1], a[0] - b[0]);
}

export function distance(x, y) {
  return sqrt(x * x + y * y);
}

export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function sum(arr) {
  return arr.reduce(add);
}

export function average(arr) {
  return sum(arr) / arr.length;
}

export function dot(a, b) {
  return a.reduce((sum, item, index) => sum + item * b[index], 0);
}

export function weightedAverage(weights) {
  return dot(this, weights) / sum(weights);
}

export function pairs() {
  return Array(this.length - 1).fill(0).map((_, i) => [this[i], this[i + 1]]);
}

export function limit(n, lower, upper) {
  return max(min(n, upper), lower);
}

export function sign(n) {
  return n > 0 ? 1 : n < 0 ? -1 : 0;
}
