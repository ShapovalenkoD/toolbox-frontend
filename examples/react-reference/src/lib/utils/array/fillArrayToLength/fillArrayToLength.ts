export function fillArrayToLength<Item>(
  array: readonly Item[],
  targetLength?: number,
): (Item | undefined)[];
export function fillArrayToLength<Item, Fill>(
  array: readonly Item[],
  targetLength: number,
  fillValue: Fill,
): (Item | Fill)[];
export function fillArrayToLength<Item, Fill>(
  array: readonly Item[],
  targetLength = 4,
  fillValue?: Fill,
): (Item | Fill | undefined)[] {
  if (!Number.isSafeInteger(targetLength) || targetLength < 0) {
    throw new RangeError("Длина массива должна быть неотрицательным целым числом.");
  }

  return [...array, ...Array(Math.max(0, targetLength - array.length)).fill(fillValue)];
}
