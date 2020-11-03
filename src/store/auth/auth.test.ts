import reducer, { updateToken, updatePlayer } from './auth';
import { playerOne } from '../../utils/testData';

test('updates the access token', () => {
  const token = 'new-token';
  const result = reducer(undefined, updateToken(token));

  expect(result.token).toEqual(token);
});

test('updates the player', () => {
  const result = reducer(undefined, updatePlayer(playerOne));

  expect(result.player).toEqual(playerOne);
});
