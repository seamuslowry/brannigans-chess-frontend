import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { ActionCreator, AnyAction } from 'redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import GameStatus from './GameStatus';
import { testStore } from '../../utils/testData';
import { AppState } from '../../store/store';
import { subscribe, unsubscribe } from '../../store/middleware/stomp/stomp';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>([thunk]);
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

test('subscribes on mount; unsubscribes on unmount', async () => {
  const { unmount } = render(
    <Provider store={mockedStore}>
      <GameStatus gameId={1} />
    </Provider>
  );

  expect(mockedStore.getActions()).toContainEqual(subscribe('/game/status/1'));
  expect(mockedStore.getActions()).not.toContainEqual(unsubscribe('/game/status/1'));

  unmount();

  expect(mockedStore.getActions()).toContainEqual(unsubscribe('/game/status/1'));
});

test('shows the most recent status of the game when available', async () => {
  const storeWithStatusMessage = mockStore({
    ...testStore,
    socket: {
      ...testStore.socket,
      messages: [
        {
          topic: '/game/status/1',
          data: 'TEST_STATUS'
        }
      ]
    }
  });

  const { getByText } = render(
    <Provider store={storeWithStatusMessage}>
      <GameStatus gameId={1} />
    </Provider>
  );

  const status = await waitFor(() => getByText('Test Status'));

  expect(status).toBeInTheDocument();
});
