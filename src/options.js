const {
  pow,
  sqrt
} = Math;

export const lineSpacing = 4;
export const lineLength = 50;
export const lineColor = 'rgba(255, 255, 255, 0.35)';

const brushProfiles = {
  flat: () => 1,
  sharp: x => 1 - x,
  round: x => sqrt(1 - pow(x, 2)),
  point: x => 1 - sqrt(1 - pow(x - 1, 2))
};
export const brushProfile = brushProfiles.round;
export const brushSize = 30;

export default {
  lineSpacing,
  lineLength,
  lineColor,
  brushSize
};
