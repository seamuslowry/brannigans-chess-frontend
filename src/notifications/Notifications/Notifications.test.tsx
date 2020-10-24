import React from 'react';
import { render, waitFor, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import { ActionCreator, AnyAction } from 'redux';
import thunk from 'redux-thunk';
import Notifications from './Notifications';
import { AppState } from '../../store/store';
import { errorAlertInfo, successAlertInfo, testStore } from '../../utils/testData';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>([thunk]);
const mockedStore = mockStore(testStore);

test('renders no notifications by default', async () => {
  const { queryAllByRole } = render(
    <Provider store={mockedStore}>
      <Notifications />
    </Provider>
  );

  const nodes = queryAllByRole('alert');

  expect(nodes).toHaveLength(0);
});

test('renders one notification when only one provided', async () => {
  const notificationStore = mockStore({
    ...testStore,
    notifications: {
      ...testStore.notifications,
      pendingAlerts: [errorAlertInfo]
    }
  });

  const { getAllByRole, getByText } = render(
    <Provider store={notificationStore}>
      <Notifications />
    </Provider>
  );

  const nodes = await waitFor(() => getAllByRole('alert'));
  const alert = await waitFor(() => getByText(errorAlertInfo.message));

  expect(nodes).toHaveLength(1);
  expect(alert).toBeInTheDocument();
});

test('renders one notification when multiple are provided', async () => {
  const notificationStore = mockStore({
    ...testStore,
    notifications: {
      ...testStore.notifications,
      pendingAlerts: [errorAlertInfo, successAlertInfo]
    }
  });

  const { getAllByRole, getByText } = render(
    <Provider store={notificationStore}>
      <Notifications />
    </Provider>
  );

  const nodes = await waitFor(() => getAllByRole('alert'));
  const alert = await waitFor(() => getByText(errorAlertInfo.message));

  expect(nodes).toHaveLength(1);
  expect(alert).toBeInTheDocument();
});

test('closes the alert', async () => {
  const notificationStore = mockStore({
    ...testStore,
    notifications: {
      ...testStore.notifications,
      pendingAlerts: [successAlertInfo]
    }
  });

  const { queryAllByRole, getByTitle } = render(
    <Provider store={notificationStore}>
      <Notifications />
    </Provider>
  );

  const close = await waitFor(() => getByTitle('Close'));
  fireEvent.click(close);
  // this test will fail if the element is not removed
  await waitForElementToBeRemoved(() => queryAllByRole('alert'));
});

test('does not close the alert when clicking awai', async () => {
  const notificationStore = mockStore({
    ...testStore,
    notifications: {
      ...testStore.notifications,
      pendingAlerts: [successAlertInfo]
    }
  });

  const { getAllByRole, getByTitle } = render(
    <Provider store={notificationStore}>
      <Notifications />
    </Provider>
  );

  fireEvent.click(document);
  await waitFor(() => getAllByRole('alert'));
});
