import { errorAlertInfo, successAlertInfo } from '../../utils/testData';
import { reducer, initialState, sendAlert, AlertInfo, removeAlert } from './notifications';

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
    removeAlert(errorAlertInfo)
  );

  expect(result.pendingAlerts).toHaveLength(alerts.length - 1);
  expect(result.pendingAlerts).not.toContainEqual(errorAlertInfo);
});
