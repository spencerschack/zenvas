import Grow from 'grow';

export default class Canvas {

  constructor() {
    this.element = document.createElement('canvas');
    this.context = this.element.getContext('2d');
    this.context.globalCompositionOperation = 'overlay';
    document.body.appendChild(this.element);
    this.ratio = window.devicePixelRatio || 1;
    window.addEventListener('resize', () => this.fitElement());
    this.fitElement();
  }

  fitElement() {
    const { innerWidth: width, innerHeight: height } = window;
    this.element.width  =  width * this.ratio;
    this.element.height = height * this.ratio;
    this.context.scale(this.ratio, this.ratio);
    new Grow(this.context, width, height);
  }

}
