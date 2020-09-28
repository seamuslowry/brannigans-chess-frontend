import { Game } from '../services/ChessService';
import { flatten, immutableUpdate } from './arrayHelpers';
import { emptyGame } from './testData';

test('updates a specific row / column in a 2D array of objects', () => {
  const array: Game[][] = [[emptyGame, emptyGame]];

  const result = immutableUpdate(array, 0, 1, 'uuid', 'updated');

  const expectedArray: Game[][] = [
    [
      emptyGame,
      {
        ...emptyGame,
        uuid: 'updated'
      }
    ]
  ];

  expect(result).toMatchObject(expectedArray);
});

test('flattens an array', () => {
  const array: Game[][] = [[emptyGame, emptyGame]];

  const result = flatten(array);

  const expectedArray: Game[] = [emptyGame, emptyGame];
  expect(result).toMatchObject(expectedArray);
});
