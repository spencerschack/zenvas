export default class Rectangle {

  static circle(cx, cy, r) {
    return new Rectangle(cx - r, cy - r, r * 2, r * 2);
  }

  static points(x0, y0, x1, y1) {
    return new Rectangle(x0, y0, x1 - x0, y1 - y0);
  }

  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  get x0() { return this.x; }
  get y0() { return this.y; }
  get x1() { return this.x + this.width; }
  get y1() { return this.y + this.height; }
  get cx() { return this.x + this.width / 2; }
  get cy() { return this.y + this.height / 2; }

}
