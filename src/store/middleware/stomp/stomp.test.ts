import GameStompClient from './gameStompClient';
import createStompMiddleware, {
  connect,
  disconnect,
  STOMP_CLOSED,
  STOMP_CONNECTED,
  subscribe,
  unsubscribe
} from './stomp';

let connectHandler: VoidFunction;
let disconnectHandler: VoidFunction;

const fakeStore = {
  dispatch: jest.fn(),
  getState: jest.fn()
};

const mockedClient = {
  activate: jest.fn(),
  deactivate: jest.fn(),
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
  resubscribe: jest.fn(),
  connected: false,
  subscriptions: {}
};

jest.mock('./gameStompClient', () => {
  return jest
    .fn()
    .mockImplementation(
      (url: string, factory: Function, onConnect: VoidFunction, onDisconnect: VoidFunction) => {
        connectHandler = onConnect;
        disconnectHandler = onDisconnect;
        return mockedClient;
      }
    );
});
const url = 'test-url.com';

beforeEach(() => {
  jest.clearAllMocks();
});

test('creates a client on invocation', () => {
  createStompMiddleware(url)(fakeStore);
  expect(GameStompClient).toHaveBeenCalled();
});

test('notifies the store of connection and resubscribes', () => {
  createStompMiddleware(url);

  connectHandler && connectHandler();

  expect(fakeStore.dispatch).toHaveBeenCalledWith(
    expect.objectContaining({
      type: STOMP_CONNECTED
    })
  );
  expect(mockedClient.resubscribe).toHaveBeenCalled();
});

test('notifies the store of disconnection', () => {
  createStompMiddleware(url);

  disconnectHandler && disconnectHandler();

  expect(fakeStore.dispatch).toHaveBeenCalledWith(
    expect.objectContaining({
      type: STOMP_CLOSED
    })
  );
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
