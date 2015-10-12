import Rectangle from 'rectangle';
import Line from 'line';
import {distance} from 'utils';
import {
  lineSpacing,
  growAttempts,
  growBranchProbability,
  growSpreadProbability,
  growEdgeLimit,
  growSpreadLimit,
  growRadius,
  growColorBase,
  growColorIncrement,
  growColonyCount
} from 'options';

const {random} = Math;

class Colony {

  edges = [];

  constructor(field, context, x, y, hue) {
    this.field = field;
    this.context = context;
    this.hue = hue;
    this.plant(x, y);
  }

  plant(x, y) {
    if(this.edges.length < growEdgeLimit) {
      const line = new Line(x, y, 0, 0, this.hue);
      this.hue = (this.hue + growColorIncrement) % 360;
      line.draw(this.context);
      this.field.insert(line);
      this.edges.push([x, y]);
    }
  }

  grow() {
    const currentEdges = this.edges.splice(0, growSpreadLimit);
    currentEdges.forEach(edge => this.spread(edge[0], edge[1]));
  }

  spread(x, y) {
    const neighbors = this.field.within(Rectangle.circle(x, y, growRadius));
    let attempts = growAttempts;
    while(attempts--) {
      let newX = x + (random() * 2 - 1) * growRadius;
      let newY = y + (random() * 2 - 1) * growRadius;
      if(newX > 0 && newY > 0 && newX < this.field.width && newY < this.field.height) {
        if(neighbors.every(neighbor => {
          return distance(neighbor.x0 - newX, neighbor.y0 - newY) >= lineSpacing;
        })) {
          this.plant(newX, newY);
          const chance = random();
          if(chance < growSpreadProbability) {
            this.spread(newX, newY);
            return;
          } else if(1 - chance < growBranchProbability) {
            return;
          }
        }
      }
    }
  }

}

export default class Grow {

  colonies = [];

  constructor(field, context) {
    this.field = field;
    this.context = context;
    this.hue = 0;
    this.seed();
    this.grow();
  }

  seed() {
    const {width, height} = this.field;
    let count = growColonyCount;
    while(count--) {
      const x = random() * width;
      const y = random() * height;
      const hue = random() * 360;
      const colony = new Colony(this.field, this.context, x, y, hue);
      this.colonies.push(colony);
    }
  }

  grow() {
    this.colonies.forEach(colony => colony.grow());
    requestAnimationFrame(() => this.grow());
  }

}
