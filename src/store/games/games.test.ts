import { emptyGame } from '../../utils/testData';
import reducer, { getStatusTopic, initialState } from '../games/games';
import { STOMP_MESSAGE } from '../middleware/stomp/stomp';

test('handles an message on the status topic', () => {
  const result = reducer(undefined, {
    type: STOMP_MESSAGE,
    payload: {
      topic: getStatusTopic(1),
      data: JSON.stringify(emptyGame)
    }
  });

  expect(result.ids).toContain(emptyGame.id);
});

test('handles a stomp message on an unrelated topic', () => {
  const result = reducer(undefined, {
    type: STOMP_MESSAGE,
    payload: {
      topic: 'not-a-match',
      data: 'test'
    }
  });

  expect(result).toEqual(initialState);
});
