const {
  pow,
  sqrt
} = Math;

export const lineSpacing = 3;
export const lineLength = 50;
export const lineHue = 0;
export const lineSaturation = 0;
export const lineAlpha = 0.35;
export const lineTint = 0.15;
export const lineLightness = 1 - lineTint;

const brushProfiles = {
  flat: () => 1,
  sharp: x => 1 - x,
  round: x => sqrt(1 - pow(x, 2)),
  point: x => 1 - sqrt(1 - pow(x - 1, 2))
};
export const brushProfile = brushProfiles.sharp;
export const brushSize = 30;
export const brushLength = 20;
export const brushEffect = 0.15;
