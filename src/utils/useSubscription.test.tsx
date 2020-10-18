import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { ActionCreator, AnyAction } from 'redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { AppState } from '../store/store';
import { testStore } from './testData';
import useSubscription from './useSubscription';
import { subscribe, unsubscribe } from '../store/middleware/stomp/stomp';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>([thunk]);
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

test('should subscribe on mount and unsubscribe on unmount', async () => {
  const topic = 'test/topic';
  const { unmount } = renderHook(() => useSubscription(topic), {
    wrapper: ({ children }) => <Provider store={mockedStore}>{children}</Provider>
  });

  expect(mockedStore.getActions()).toContainEqual(subscribe(topic));
  expect(mockedStore.getActions()).not.toContainEqual(unsubscribe(topic));

  unmount();

  expect(mockedStore.getActions()).toContainEqual(unsubscribe(topic));
});

test('should return a list of all messages on the topic', async () => {
  const message = {
    topic: 'test/topic',
    data: 'testData'
  };

  const storeWithMessages = mockStore({
    ...testStore,
    socket: {
      ...testStore.socket,
      messages: [
        message,
        {
          topic: `${message.topic}/noMatch`,
          data: 'noMatch'
        }
      ]
    }
  });

  const { result } = renderHook(() => useSubscription(message.topic), {
    wrapper: ({ children }) => <Provider store={storeWithMessages}>{children}</Provider>
  });

  expect(result.current).toHaveLength(1);
  expect(result.current[0]).toEqual(message);
});
