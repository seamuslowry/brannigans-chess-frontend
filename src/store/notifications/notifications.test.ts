import { errorAlertInfo, successAlertInfo } from '../../utils/testData';
import { authenticatePlayer, updateDisplayName } from '../auth/auth';
import { clickTile } from '../boards/boards';
import { createGame, getAllGameData, joinGame, leaveGame } from '../games/games';
import { getMoves } from '../moves/moves';
import { getPieces, promotePawn } from '../pieces/pieces';
import reducer, { initialState, AlertInfo, removeAlert } from './notifications';

test('removes an alert', () => {
  const alerts: AlertInfo[] = [
    successAlertInfo,
    errorAlertInfo,
    {
      ...errorAlertInfo,
      severity: 'info'
    },
    {
      ...errorAlertInfo,
      message: 'mismatched message'
    }
  ];
  const result = reducer(
    {
      ...initialState,
      pendingAlerts: alerts
    },
    removeAlert(errorAlertInfo.message)
  );

  expect(result.pendingAlerts).toHaveLength(alerts.length - 1);
  expect(result.pendingAlerts).not.toContainEqual(errorAlertInfo);
});

test('shows a notification on piece retrieval failure', async () => {
  const message = 'test message';
  const result = reducer(
    undefined,
    getPieces.rejected(new Error(message), '', { gameId: 0, colors: [] })
  );

  expect(result.pendingAlerts).toContainEqual(
    expect.objectContaining({
      message: expect.stringContaining(message)
    })
  );
});

test('shows a notification on move retrieval failure', async () => {
  const message = 'test message';
  const result = reducer(
    undefined,
    getMoves.rejected(new Error(message), '', { gameId: 0, colors: [] })
  );

  expect(result.pendingAlerts).toContainEqual(
    expect.objectContaining({
      message: expect.stringContaining(message)
    })
  );
});

test('shows a notification on an attempted move failure', async () => {
  const message = 'test message';
  const result = reducer(
    undefined,
    clickTile.rejected(new Error(message), '', { gameId: 0, row: 0, col: 0 })
  );

  expect(result.pendingAlerts).toContainEqual(
    expect.objectContaining({
      message: expect.stringContaining(message)
    })
  );
});

test('shows a notification on a game creation failure', async () => {
  const message = 'test message';
  const result = reducer(undefined, createGame.rejected(new Error(message), '', undefined));

  expect(result.pendingAlerts).toContainEqual(
    expect.objectContaining({
      message: expect.stringContaining(message)
    })
  );
});

test('shows a notification on a al game data retrieval failure', async () => {
  const message = 'test message';
  const result = reducer(undefined, getAllGameData.rejected(new Error(message), '', 0));

  expect(result.pendingAlerts).toContainEqual(
    expect.objectContaining({
      message: expect.stringContaining(message)
    })
  );
});

test('shows a notification on pawn promotion failure', async () => {
  const message = 'test message';
  const result = reducer(
    undefined,
    promotePawn.rejected(new Error(message), '', { pieceId: 0, type: 'BISHOP' })
  );

  expect(result.pendingAlerts).toContainEqual(
    expect.objectContaining({
      message: expect.stringContaining(message)
    })
  );
});

test('shows a notification on join game failure', async () => {
  const message = 'test message';
  const result = reducer(
    undefined,
    joinGame.rejected(new Error(message), '', { gameId: 0, pieceColor: 'WHITE' })
  );

  expect(result.pendingAlerts).toContainEqual(
    expect.objectContaining({
      message: expect.stringContaining(message)
    })
  );
});

test('shows a notification on leave game failure', async () => {
  const message = 'test message';
  const result = reducer(undefined, leaveGame.rejected(new Error(message), '', 0));

  expect(result.pendingAlerts).toContainEqual(
    expect.objectContaining({
      message: expect.stringContaining(message)
    })
  );
});

test('shows a notification on player authenticate failure', async () => {
  const message = 'test message';
  const result = reducer(
    undefined,
    authenticatePlayer.rejected(new Error(message), '', {
      getAccessToken: jest.fn(),
      playerInfo: { name: 'test', imageUrl: 'test' }
    })
  );

  expect(result.pendingAlerts).toContainEqual(
    expect.objectContaining({
      message: expect.stringContaining(message)
    })
  );
});

test('shows a notification on name update failure', async () => {
  const message = 'test message';
  const result = reducer(undefined, updateDisplayName.rejected(new Error(message), '', 'test'));

  expect(result.pendingAlerts).toContainEqual(
    expect.objectContaining({
      message: expect.stringContaining(message)
    })
  );
});
