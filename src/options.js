const {abs} = Math;

const growEdgeSlices = {
  first(arr) {
    return arr.splice(0, growSpreadLimit);
  },
  last(arr) {
    return arr.splice(arr.length - growSpreadLimit, growSpreadLimit);
  }
}
const growColors = {
  rainbow(n) {
    return `hsl(${n * 360}, 65%, 65%`;
  },
  clouds(n) {
    n = 2 * abs(n - 0.5);
    return `hsl(${n * 100 + 150}, ${65 + n * 15}%, ${50 + n * 10}%`;
  }
};
export const growEdgeSlice = growEdgeSlices.last;
export const growColor = growColors.rainbow;
export const growBranchProbability = 0.05;
export const growSpreadProbability = 0.5;
export const growBackProbability = 0.05;
export const growEdgeLimit = 100000;
export const growSpreadLimit = 100;
export const growColorIncrement = 0.0001;
export const growColonyCount = 20;
