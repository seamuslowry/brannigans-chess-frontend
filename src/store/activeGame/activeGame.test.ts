import reducer, { ActiveGameState, setGameId, getStatusTopic } from './activeGame';
import { emptyGame, fullGame, testStore } from '../../utils/testData';
import { STOMP_MESSAGE } from '../middleware/stomp/stomp';

test('sets the global game id', () => {
  const result = reducer(undefined, setGameId(1));

  expect(result.id).toEqual(1);
});

test('handles an empty game stomp message on the status topic', () => {
  const stateWithId: ActiveGameState = {
    ...testStore.activeGame,
    id: 1
  };
  const result = reducer(stateWithId, {
    type: STOMP_MESSAGE,
    payload: {
      topic: getStatusTopic(1),
      data: JSON.stringify(emptyGame)
    }
  });

  expect(result.status).toEqual(emptyGame.status);
  expect(result.whitePlayer).toBeNull();
  expect(result.blackPlayer).toBeNull();
});

test('handles an full game stomp message on the status topic', () => {
  const stateWithId: ActiveGameState = {
    ...testStore.activeGame,
    id: 1
  };
  const result = reducer(stateWithId, {
    type: STOMP_MESSAGE,
    payload: {
      topic: getStatusTopic(1),
      data: JSON.stringify(fullGame)
    }
  });

  expect(result.status).toEqual(fullGame.status);
  expect(result.whitePlayer).toEqual(fullGame.whitePlayer);
  expect(result.blackPlayer).toEqual(fullGame.blackPlayer);
});

test('handles a stomp message on an unrelated topic', () => {
  const stateWithId: ActiveGameState = {
    ...testStore.activeGame,
    id: 1
  };
  const result = reducer(stateWithId, {
    type: STOMP_MESSAGE,
    payload: {
      topic: getStatusTopic(-1),
      data: JSON.stringify(emptyGame)
    }
  });

  expect(result).toEqual(stateWithId);
});
