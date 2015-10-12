import Grow from 'field/grow';
import Rectangle from 'rectangle';
import {ndArray} from 'utils';
import {lineSpacing} from 'options';

const {
  ceil, floor,
  min, max
} = Math;

export default class Field {

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.rows = ceil(height / lineSpacing);
    this.columns = ceil(width / lineSpacing);
    this.grid = ndArray(this.columns, this.rows, 0);
  }

  grow(context) {
    new Grow(this, context);
  }

  insert(line) {
    const column = floor(line.x0 / lineSpacing);
    const row = floor(line.y0 / lineSpacing);
    this.grid[column][row].push(line);
  }

  interval(rect) {
    const x0 = max(0, floor(rect.x0 / lineSpacing));
    const y0 = max(0, floor(rect.y0 / lineSpacing));
    const x1 = min(this.columns, ceil(rect.x1 / lineSpacing));
    const y1 = min(this.rows, ceil(rect.y1 / lineSpacing));
    return Rectangle.points(x0, y0, x1, y1);
  }

  forEach(fn) {
    for(let i = 0; i < this.grid.length; i++) {
      const column = this.grid[i]
      for(let j = 0; j < column.length; j++) {
        const cells = column[j];
        for(let k = 0; k < cells.length; k++) {
          fn(cells[k]);
        }
      }
    }
  }

  within(pixelRect) {
    const rect = this.interval(pixelRect);
    const results = [];
    for(let i = rect.x0; i < rect.x1; i++) {
      const column = this.grid[i]
      for(let j = rect.y0; j < rect.y1; j++) {
        const lines = column[j];
        for(let k = 0; k < lines.length; k++) {
          results.push(lines[k]);
        }
      }
    }
    return results;
  }

}
