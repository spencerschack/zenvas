import Canvas from 'canvas';

export default function main() {
  if(document.readyState === 'complete') {
    new Canvas();
  } else {
    document.addEventListener('DOMContentLoaded', main);
  }
}
