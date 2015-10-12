const {
  pow,
  sqrt
} = Math;

export const lineSpacing = 2.5;
export const lineLength = 70;
export const lineWidth = 1;
export const lineHue = 0;
export const lineSaturation = 0.25;
export const lineLightness = 0.5;
export const lineAlpha = 0.75;
export const lineTint = 0.15;

const brushProfiles = {
  flat: () => 1,
  sharp: x => 1 - x,
  round: x => sqrt(1 - pow(x, 2)),
  point: x => 1 - sqrt(1 - pow(x - 1, 2))
};
export const brushProfile = brushProfiles.sharp;
export const brushSize = 20;
export const brushLength = 10;
export const brushEffect = 0.15;

export const growAttempts = 10;
export const growBranchProbability = 0.05;
export const growSpreadProbability = 0.05;
export const growEdgeLimit = 1000;
export const growSpreadLimit = 300;
export const growRadius = 10;
export const growColorIncrement = 0.001;
export const growColonyCount = 10;
