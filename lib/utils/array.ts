export const fillArrayToLength = (
  arr: unknown[],
  targetLength: number = 4,
  fillValue: unknown = undefined,
) => {
  return [
    ...arr,
    ...Array(Math.max(0, targetLength - arr.length)).fill(fillValue),
  ];
};
