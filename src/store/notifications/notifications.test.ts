import { errorAlertInfo, successAlertInfo } from '../../utils/testData';
import { clickTile } from '../boards/boards';
import { createGame } from '../games/games';
import { getMoves } from '../moves/moves';
import { getPieces } from '../pieces/pieces';
import reducer, { initialState, sendAlert, AlertInfo, removeAlert } from './notifications';

test('sends an alert', () => {
  const result = reducer(undefined, sendAlert(successAlertInfo.message, successAlertInfo.severity));

  expect(result.pendingAlerts).toContainEqual(successAlertInfo);
});

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
