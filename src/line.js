import {distance} from 'utils';
import {
  lineWidth,
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

function strokeColor() {
  const saturation = lineSaturation * 100;
  const lightness = lineLightness * 100;
  return `hsla(${this.hue}, ${saturation}%, ${lightness}%, ${lineAlpha})`;
}

function fillColor() {
  const saturation = lineSaturation * 100;
  const lightness = lineLightness * 100;
  return `hsla(${this.hue}, ${saturation}%, ${lightness}%, ${lineAlpha})`;
}

export default class Line {

  constructor(x0, y0, x1 = 0, y1 = 0, hue = 0) {
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;
    this.hue = hue;
  }

  draw(context) {
    const {x0, y0, x1, y1} = this;
    if(distance(x1, y1) <= tolerance) {
      context.fillStyle = this::fillColor();
      context.fillRect(x0, y0, 1, 1);
    } else {
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x0 + x1, y0 + y1);
      context.strokeStyle = this::strokeColor();
      context.stroke();
    }
  }

}
