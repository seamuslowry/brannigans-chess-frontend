export const immutableUpdate = <T extends object, TKey extends keyof T>(
  array: T[][],
  row: number,
  col: number,
  key: TKey,
  value: T[TKey]
): T[][] => [
  ...array.slice(0, row),
  [
    ...array[row].slice(0, col),
    {
      ...array[row][col],
      [key]: value
    },
    ...array[row].slice(col + 1)
  ],
  ...array.slice(row + 1)
];
