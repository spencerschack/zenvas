export default class Point {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  subtract(point) {
    return new Vector(this.x - point.x, this.y - point.y);
  }

  distance(point) {
    return this.subtract(point).length;
  }

}
