import { blackMove, whiteMove, whiteTake } from '../../utils/testData';
import { clickTile } from '../boards/boards';
import { STOMP_MESSAGE } from '../middleware/stomp/stomp';
import reducer, { addMoves, getSharedMovesTopic, initialState } from './moves';

test('records a move', () => {
  const result = reducer(undefined, addMoves([whiteMove]));

  expect(result.ids).toContainEqual(whiteMove.id);
});

test('records moves', () => {
  const result = reducer(undefined, addMoves([whiteMove]));

  expect(result.ids).toContainEqual(whiteMove.id);
});

test('sorts moves by id', () => {
  const firstMove = {
    ...whiteMove,
    id: 10
  };
  const secondMove = {
    ...blackMove,
    id: 11
  };

  const firstAdd = reducer(undefined, addMoves([secondMove]));
  const result = reducer(firstAdd, addMoves([firstMove]));

  expect(result.ids).not.toEqual([secondMove.id, firstMove.id]);
  expect(result.ids).toEqual([firstMove.id, secondMove.id]);
});

test('moves a piece', async () => {
  const request = { row: whiteMove.dstRow, col: whiteMove.dstCol, gameId: 0 };
  const result = reducer(undefined, clickTile.fulfilled(whiteMove, '', request));

  expect(result.ids).toContainEqual(whiteMove.id);
});

test('unrelated click request - reducer', async () => {
  const request = { row: whiteMove.dstRow, col: whiteMove.dstCol, gameId: 0 };
  const result = reducer(undefined, clickTile.fulfilled(true, '', request));

  expect(result).toEqual(initialState);
});

test('handles a shared move on the move topic', () => {
  const result = reducer(undefined, {
    type: STOMP_MESSAGE,
    payload: {
      topic: getSharedMovesTopic(1),
      data: JSON.stringify(whiteTake)
    }
  });

  expect(result.ids).toContain(whiteTake.id);
});

test('handles a stomp message on an unrelated topic', () => {
  const result = reducer(undefined, {
    type: STOMP_MESSAGE,
    payload: {
      topic: 'not-a-topic',
      data: 'test'
    }
  });

  expect(result).toEqual(initialState);
});
