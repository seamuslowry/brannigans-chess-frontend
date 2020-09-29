import { errorAlertInfo, successAlertInfo } from '../../utils/testData';
import { reducer, initialState, sendAlert, AlertInfo, removeAlert } from './snackbars';

test('sends an alert', () => {
  const result = reducer(undefined, sendAlert(successAlertInfo.message, successAlertInfo.severity));

  expect(result.alerts).toContainEqual(successAlertInfo);
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
      alerts
    },
    removeAlert(errorAlertInfo)
  );

  expect(result.alerts).toHaveLength(alerts.length - 1);
  expect(result.alerts).not.toContainEqual(errorAlertInfo);
});
