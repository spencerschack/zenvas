import {distance} from 'utils';
import {
  lineHue,
  lineSaturation,
  lineLightness,
  lineAlpha,
  lineTint
} from 'options';

const {
  abs,
  atan2,
  PI,
  sin
} = Math;

const tolerance = 0.6;

function strokeColor(line) {
  const saturation = lineSaturation * 100;
  const angle = atan2(line.y1, line.x1) + PI / 4;
  const lightness = (lineLightness + sin(angle) * lineTint) * 100;
  return `hsla(${lineHue}, ${saturation}%, ${lightness}%, ${lineAlpha})`;
}

function fillColor() {
  const saturation = lineSaturation * 100;
  const lightness = lineLightness * 100;
  return `hsla(${lineHue}, ${saturation}%, ${lightness}%, ${lineAlpha})`;
}

export default class Line {

  constructor(x0, y0, x1 = 0, y1 = 0) {
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;
  }

  draw(context) {
    const {x0, y0, x1, y1} = this;
    context.beginPath();
    if(distance(x1, y1) > tolerance) {
      context.moveTo(x0, y0);
      context.lineTo(x0 + x1, y0 + y1);
      context.stroke();
    }
  }

}
