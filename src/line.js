export default class Line {

  constructor(x0, y0, x1, y1) {
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;
  }

  draw(context) {
    const {x0, y0, x1, y1} = this;
    if(x1 !== 0 || y1 !== 0) {
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x0 + x1, y0 + y1);
      context.stroke();
    }
  }

}
