import Grid from 'grid';
import PointSampler from 'point_sampler';
import { 
  lineSpacing,
  lineLength,
  lineColor,
  brushSize,
  brushProfile
} from 'options';
import {distance} from 'utils';

const {
  ceil, floor,
  cos, sin,
  max, min
} = Math;

export default class Canvas {

  constructor() {
    this.element = document.createElement('canvas');
    this.context = this.element.getContext('2d');
    document.body.appendChild(this.element);
    this.ratio = window.devicePixelRatio || 1;
    window.addEventListener('resize', () => this.fitElement());
    this.fitElement();
    const sampler = new PointSampler(20);
    window.addEventListener('mousemove', ({pageX: x, pageY: y}) => {
      sampler.push(x, y);
      const angle = sampler.angle();
      this.brush(x, y, angle);
    });
  }

  fitElement() {
    const { innerWidth: width, innerHeight: height } = window;
    this.grid = new Grid(width, height);
    this.width = width;
    this.height = height;
    this.element.width  =  width * this.ratio;
    this.element.height = height * this.ratio;
    this.context.scale(this.ratio, this.ratio);
    this.context.strokeStyle = lineColor;
    this.grid.forEach(cell => cell.draw(this.context));
  }

  brush(x, y, angle) {
    const radius = brushSize + lineLength;
    const rows = ceil(2 * radius / lineSpacing);
    const columns = ceil(2 * radius / lineSpacing);
    const row = floor((y - radius) / lineSpacing);
    const column = floor((x - radius) / lineSpacing);
    this.redraw(column * lineSpacing, row * lineSpacing, columns * lineSpacing, rows * lineSpacing, () => {
      this.grid.view(row - 10, column - 10, rows + 20, columns + 20).forEach(cell => {
        const dist = distance(cell.x0 - x, cell.y0 - y);
        if(dist < brushSize) {
          const effect = brushProfile(dist / brushSize);
          const x = cos(angle) * lineLength;
          const y = sin(angle) * lineLength;
          cell.x1 += (x - cell.x1) * effect / 15;
          cell.y1 += (y - cell.y1) * effect / 15;
        }
        cell.draw(this.context);
      });
    });
  }

  redraw(x, y, w, h, cb) {
    const {context} = this;
    context.clearRect(x, y, w, h);
    context.save();
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + w, y);
    context.lineTo(x + w, y + h);
    context.lineTo(x, y + h);
    context.clip();
    try {
      cb();
    } finally {
      context.restore();
    }
  }

}
