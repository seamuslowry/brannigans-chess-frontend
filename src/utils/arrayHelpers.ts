export const immutableUpdate = <T extends object>(
  array: T[][],
  row: number,
  col: number,
  map: Partial<T>
): T[][] => [
  ...array.slice(0, row),
  [
    ...array[row].slice(0, col),
    {
      ...array[row][col],
      ...map
    },
    ...array[row].slice(col + 1)
  ],
  ...array.slice(row + 1)
];

export const flatten = <T>(array: T[][]): T[] => array.reduce((acc, val) => acc.concat(val), []);
