import Grid from 'grid';
import PointSampler from 'point_sampler';
import { 
  lineSpacing,
  lineLength,
  lineHue,
  lineSaturation,
  lineLightness,
  lineAlpha,
  brushSize,
  brushProfile,
  brushLength,
  brushEffect
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
    const sampler = new PointSampler(brushLength);
    window.addEventListener('mousemove', ({pageX: x, pageY: y, shiftKey}) => {
      if(!shiftKey) {
        sampler.push(x, y);
        const angle = sampler.angle();
        this.brush(x, y, angle);
      }
    });
  }

  fitElement() {
    const { innerWidth: width, innerHeight: height } = window;
    this.grid = new Grid(width, height);
    this.element.width  =  width * this.ratio;
    this.element.height = height * this.ratio;
    this.context.scale(this.ratio, this.ratio);
    this.context.strokeStyle = `hsla(${lineHue}, ${lineSaturation * 100}%, ${lineLightness * 100}%, ${lineAlpha})`;;
    this.context.fillStyle = `hsla(${lineHue}, ${lineSaturation * 100}%, ${lineLightness * 100}%, ${lineAlpha})`;
    this.grid.forEach(cell => cell.draw(this.context));
  }

  brush(x, y, angle) {
    const inner = brushSize + lineLength;
    const outer = inner + lineLength;
    const row = floor((y - outer) / lineSpacing);
    const column = floor((x - outer) / lineSpacing);
    const intervals = ceil(2 * outer / lineSpacing);
    this.redraw(x - inner, y - inner, 2 * inner, 2 * inner, () => {
      this.grid.view(row, column, intervals, intervals).forEach(cell => {
        const dist = distance(cell.x0 - x, cell.y0 - y);
        if(dist < brushSize) {
          const effect = brushProfile(dist / brushSize);
          const dx = cos(angle) * lineLength - cell.x1;
          const dy = sin(angle) * lineLength - cell.y1;
          cell.x1 += dx * effect * brushEffect;
          cell.y1 += dy * effect * brushEffect;
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
