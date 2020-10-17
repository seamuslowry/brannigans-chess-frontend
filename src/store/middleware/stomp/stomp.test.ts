import GameStompClient from './gameStompClient';
import createStompMiddleware, { connect, disconnect, subscribe, unsubscribe } from './stomp';

const fakeStore = {
  dispatch: jest.fn(),
  getState: jest.fn()
};

const mockedClient = {
  activate: jest.fn(),
  deactivate: jest.fn(),
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
  connected: false,
  subscriptions: {}
};

jest.mock('./gameStompClient', () => {
  return jest.fn().mockImplementation(() => mockedClient);
});
const url = 'test-url.com';

beforeEach(() => {
  jest.clearAllMocks();
});

test('creates a client on invocation', () => {
  createStompMiddleware(url)(fakeStore);
  expect(GameStompClient).toHaveBeenCalled();
});

test('connects the client when asked', () => {
  const actionHandler = createStompMiddleware(url)(fakeStore)(fakeStore.dispatch);
  actionHandler(connect());

  expect(mockedClient.activate).toHaveBeenCalled();
});

test('disconnects the client when asked', () => {
  const actionHandler = createStompMiddleware(url)(fakeStore)(fakeStore.dispatch);
  actionHandler(disconnect());

  expect(mockedClient.deactivate).toHaveBeenCalled();
});

test('connects the client and subscribes', () => {
  const actionHandler = createStompMiddleware(url)(fakeStore)(fakeStore.dispatch);
  actionHandler(subscribe('test-topic'));

  expect(fakeStore.dispatch).toHaveBeenCalledWith(connect());
  expect(mockedClient.subscribe).toHaveBeenCalled();
});

test('unsubscribes and disconnects', () => {
  const actionHandler = createStompMiddleware(url)(fakeStore)(fakeStore.dispatch);
  actionHandler(unsubscribe('test-topic'));

  expect(fakeStore.dispatch).toHaveBeenCalledWith(disconnect());
  expect(mockedClient.unsubscribe).toHaveBeenCalled();
});
