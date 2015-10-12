import Grid from 'grid';
import Field from 'field';
import PointSampler from 'point_sampler';
import Rectangle from 'rectangle';
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
    this.context.globalCompositionOperation = 'overlay';
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
    this.field = new Field(width, height);
    this.element.width  =  width * this.ratio;
    this.element.height = height * this.ratio;
    this.context.scale(this.ratio, this.ratio);
    this.context.strokeStyle = `hsla(${lineHue}, ${lineSaturation * 100}%, ${lineLightness * 100}%, ${lineAlpha})`;;
    this.context.fillStyle = `hsla(${lineHue}, ${lineSaturation * 100}%, ${lineLightness * 100}%, ${lineAlpha})`;
    this.field.grow(this.context);
  }

  brush(x, y, angle) {
    const redraw = brushSize + lineLength;
    const field = redraw + lineLength;
    this.redraw(Rectangle.circle(x, y, redraw), () => {
      this.field.within(Rectangle.circle(x, y, field)).forEach(line => {
        const dist = distance(line.x0 - x, line.y0 - y);
        if(dist < brushSize) {
          const effect = brushProfile(dist / brushSize);
          const dx = cos(angle) * lineLength - line.x1;
          const dy = sin(angle) * lineLength - line.y1;
          line.x1 += dx * effect * brushEffect;
          line.y1 += dy * effect * brushEffect;
        }
        line.draw(this.context);
      });
    });
  }

  redraw(rect, cb) {
    const {context} = this;
    context.clearRect(rect.x, rect.y, rect.width, rect.height);
    context.save();
    context.beginPath();
    context.moveTo(rect.x0, rect.y0);
    context.lineTo(rect.x1, rect.y0);
    context.lineTo(rect.x1, rect.y1);
    context.lineTo(rect.x0, rect.y1);
    context.clip();
    try {
      cb();
    } finally {
      context.restore();
    }
  }

}
