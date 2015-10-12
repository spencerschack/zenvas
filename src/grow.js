import Colony from 'colony';
import {growColonyCount} from 'options';
import {ndArray} from 'utils';

const {
  random,
  round
} = Math;

export default class Grow {

  colonies = [];

  constructor(context, width, height) {
    this.context = context;
    this.width = width;
    this.height = height;
    this.grid = ndArray(width, height);
    this.seed();
    this.grow();
  }

  seed() {
    const {width, height} = this;
    let count = growColonyCount;
    while(count--) {
      const x = round(random() * width);
      const y = round(random() * height);
      const color = random();
      const colony = new Colony(this, x, y, color);
      this.colonies.push(colony);
    }
  }

  grow() {
    this.colonies.forEach(colony => colony.grow());
    requestAnimationFrame(() => this.grow());
  }

}
