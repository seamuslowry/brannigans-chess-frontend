import React from 'react';
import { render, waitFor, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import Notifications from './Notifications';
import { AppState } from '../../store/store';
import { errorAlertInfo, successAlertInfo, testStore } from '../../utils/testData';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
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

test('does not close the alert when clicking away', async () => {
  const notificationStore = mockStore({
    ...testStore,
    notifications: {
      ...testStore.notifications,
      pendingAlerts: [successAlertInfo]
    }
  });

  const { getAllByRole } = render(
    <Provider store={notificationStore}>
      <Notifications />
    </Provider>
  );

  fireEvent.click(document);
  await waitFor(() => getAllByRole('alert'));
});
