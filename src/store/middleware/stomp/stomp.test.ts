import { messageCallbackType } from '@stomp/stompjs';
import GameStompClient from './gameStompClient';
import createStompMiddleware, {
  connect,
  disconnect,
  STOMP_CLOSED,
  STOMP_CONNECTED,
  STOMP_MESSAGE,
  subscribe,
  unsubscribe
} from './stomp';

let connectHandler: VoidFunction;
let disconnectHandler: VoidFunction;
let messageHandler: messageCallbackType;

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
      (
        url: string,
        factory: (topic: string) => messageCallbackType,
        onConnect: VoidFunction,
        onDisconnect: VoidFunction
      ) => {
        messageHandler = factory('test');
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

test('notifies the store of a message', () => {
  createStompMiddleware(url);

  messageHandler &&
    messageHandler({
      ack: jest.fn(),
      nack: jest.fn(),
      command: '',
      isBinaryBody: false,
      body: 'message',
      headers: {},
      binaryBody: {} as Uint8Array
    });

  expect(fakeStore.dispatch).toHaveBeenCalledWith(
    expect.objectContaining({
      type: STOMP_MESSAGE
    })
  );
});

test('handles an unrelated action', () => {
  const actionHandler = createStompMiddleware(url)(fakeStore)(fakeStore.dispatch);
  actionHandler({ type: 'NOT_RELATED' });

  expect(mockedClient.activate).not.toHaveBeenCalled();
  expect(mockedClient.deactivate).not.toHaveBeenCalled();
  expect(mockedClient.subscribe).not.toHaveBeenCalled();
  expect(mockedClient.unsubscribe).not.toHaveBeenCalled();
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
