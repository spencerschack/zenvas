import Line from 'line';
import {lineSpacing} from 'options';

const {
  ceil,
  min, max
} = Math;

class View {

  constructor(grid, row, column, rows, columns) {
    this.grid = grid;
    this.row0 = max(row, 0);
    this.column0 = max(column, 0);
    this.row1 = min(row + rows, grid.rows);
    this.column1 = min(column + columns, grid.columns);
  }

  forEach(fn) {
    for(let row = this.row0; row < this.row1; row++) {
      for(let column = this.column0; column < this.column1; column++) {
        fn(this.grid.array[row * this.grid.columns + column]);
      }
    }
  }

}

export default class Grid {

  constructor(width, height) {
    this.columns = ceil(width / lineSpacing);
    this.rows = ceil(height / lineSpacing);
    this.array = new Array(this.columns * this.rows);
    for(let row = 0; row < this.rows; row++) {
      for(let column = 0; column < this.columns; column++) {
        const x = (column + 0.5) * lineSpacing;
        const y = (row + 0.5) * lineSpacing;
        this.array[row * this.columns + column] = new Line(x, y, 0, 0);
      }
    }
  }

  view(row, column, rows, columns) {
    return new View(this, row, column, rows, columns);
  }

  forEach(fn) {
    for(let i = 0, length = this.array.length; i < length; i++) {
      fn(this.array[i]);
    }
  }

}
