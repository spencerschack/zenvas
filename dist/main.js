import Canvas from 'canvas';

export default function main() {
  if(document.readyState !== 'loading') {
    new Canvas();
  } else {
    document.addEventListener('DOMContentLoaded', main);
  }
}
