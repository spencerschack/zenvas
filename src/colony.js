import {
  growBranchProbability,
  growSpreadProbability,
  growBackProbability,
  growEdgeLimit,
  growSpreadLimit,
  growRadius,
  growColorBase,
  growColorIncrement,
  growEdgeSlice,
  growColor
} from 'options';

import {shuffle} from 'utils';

const {random} = Math;

export default class Colony {

  edges = [];

  constructor(grow, x, y, color) {
    this.context = grow.context;
    this.width = grow.width;
    this.height = grow.height;
    this.grid = grow.grid;
    this.plant(x, y, color);
  }

  plant(x, y, color) {
    if(this.edges.length < growEdgeLimit) {
      this.context.fillStyle = growColor(color);
      this.context.fillRect(x, y, 1, 1);
      this.grid[x][y] = true;
      this.edges.push([x, y, color]);
    }
  }

  grow() {
    const currentEdges = growEdgeSlice(this.edges);
    currentEdges.forEach(edge => this.spread(edge[0], edge[1], edge[2]));
  }

  neighbors(x, y) {
    const [top, bottom] = [x > 0, x < this.width - 1];
    const [left, right] = [y > 0, y < this.height - 1];
    return [
      top             && [-1,  0],
      bottom          && [+1,  0],
      top    && left  && [-1, -1],
      top    && right && [-1, +1],
      bottom && left  && [+1, -1],
      bottom && right && [+1, +1],
                left  && [ 0, -1],
                right && [ 0, +1]]
      .filter(n => n)
      .map   (n => [x + n[0], y + n[1]])
      .filter(n => !this.grid[n[0]][n[1]] || random() < growBackProbability);
  }

  spread(x, y, color) {
    const neighbors = this.neighbors(x, y)::shuffle();
    for(let i = 0; i < neighbors.length; i++) {
      const [nx, ny] = neighbors[i];
      color = (color + growColorIncrement) % 1;
      this.plant(nx, ny, color);
      const chance = random();
      if(chance < growSpreadProbability) {
        this.spread(nx, ny, color);
        return;
      } else if(1 - chance < growBranchProbability) {
        return;
      }
    }
  }

}
