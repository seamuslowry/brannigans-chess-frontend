import SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';
import { StompSubscription } from '@stomp/stompjs';
import GameStompClient, { sockFactory } from './client';

jest.mock('sockjs-client');
const mockedSock = SockJS as jest.Mocked<typeof SockJS>;
jest.mock('@stomp/stompjs');
const mockedStomp = Stomp as jest.Mocked<typeof Stomp>;

beforeEach(() => {
  jest.clearAllMocks();
});

test('gets a sock when asked', () => {
  const url = 'test-url.com';
  sockFactory(url)();
  expect(mockedSock).toHaveBeenCalledWith(url);
});

test('creates a stomp client when constructing the game client', () => {
  const client = new GameStompClient('test-url', jest.fn(), jest.fn(), jest.fn());
  expect(mockedStomp.Client).toHaveBeenCalled();
  expect(client.connected).toBeFalsy();
});

test('activates the client', () => {
  const client = new GameStompClient('test-url', jest.fn(), jest.fn(), jest.fn());
  client.activate();
  expect(client.client.activate).toHaveBeenCalled();
});

test('deactivates the client', () => {
  const client = new GameStompClient('test-url', jest.fn(), jest.fn(), jest.fn());
  client.deactivate();
  expect(client.client.deactivate).toHaveBeenCalled();
});

test('passes the connected prop through', () => {
  const client = new GameStompClient('test-url', jest.fn(), jest.fn(), jest.fn());
  expect(client.connected).toEqual(client.client.connected);
});

test('subscribes to a new topic while disconnected', () => {
  const handlerFactory = jest.fn();
  const topic = 'test-topic';
  const client = new GameStompClient('test-url', handlerFactory, jest.fn(), jest.fn());
  client.subscribe(topic);
  expect(client.client.subscribe).not.toHaveBeenCalled();
  expect(handlerFactory).not.toHaveBeenCalled();
  expect(client.subscriptions[topic]).not.toBeUndefined();
});

test('subscribes to a new topic while connected', () => {
  const handlerFactory = jest.fn();
  const topic = 'test-topic';

  const client = new GameStompClient('test-url', handlerFactory, jest.fn(), jest.fn());
  jest.spyOn(client, 'connected', 'get').mockReturnValue(true);

  client.subscribe(topic);
  expect(client.client.subscribe).toHaveBeenCalled();
  expect(handlerFactory).toHaveBeenCalled();
  expect(client.subscriptions[topic]).not.toBeUndefined();
});

test('subscribes to an existing topic while connected', () => {
  const handlerFactory = jest.fn();
  const topic = 'test-topic';

  const client = new GameStompClient('test-url', handlerFactory, jest.fn(), jest.fn());
  jest.spyOn(client, 'connected', 'get').mockReturnValue(true);

  client.subscribe(topic);
  client.subscribe(topic);
  expect(client.client.subscribe).toHaveBeenCalledTimes(1);
  expect(handlerFactory).toHaveBeenCalledTimes(1);
  expect(client.subscriptions[topic]?.subscribers).toEqual(2);
});

test('resubscribes', () => {
  const topic = 'test-topic';

  const client = new GameStompClient('test-url', jest.fn(), jest.fn(), jest.fn());
  jest.spyOn(client, 'connected', 'get').mockReturnValue(true);

  client.subscribe(topic);
  expect(client.client.subscribe).toHaveBeenCalledTimes(1);

  client.resubscribe();
  expect(client.client.subscribe).toHaveBeenCalledTimes(2);
});

test('unsubscribes from a topic with no subscribers', () => {
  const topic = 'test-topic';

  const client = new GameStompClient('test-url', jest.fn(), jest.fn(), jest.fn());
  jest.spyOn(client, 'connected', 'get').mockReturnValue(true);

  client.unsubscribe(topic);

  expect(client.subscriptions[topic]).toBeUndefined();
});

test('unsubscribes from a topic with one subscriber', () => {
  const topic = 'test-topic';
  const unsubscribeFn = jest.fn();

  const client = new GameStompClient('test-url', jest.fn(), jest.fn(), jest.fn());
  jest.spyOn(client, 'connected', 'get').mockReturnValue(true);
  jest.spyOn(client.client, 'subscribe').mockReturnValue({
    unsubscribe: unsubscribeFn,
    id: 'test'
  } as StompSubscription);

  client.subscribe(topic);

  expect(client.subscriptions[topic]).not.toBeUndefined();

  client.unsubscribe(topic);

  expect(unsubscribeFn).toHaveBeenCalledTimes(1);
  expect(client.subscriptions[topic]).toBeUndefined();
});

test('unsubscribes from a topic with multiple subscribers', () => {
  const topic = 'test-topic';
  const unsubscribeFn = jest.fn();

  const client = new GameStompClient('test-url', jest.fn(), jest.fn(), jest.fn());
  jest.spyOn(client, 'connected', 'get').mockReturnValue(true);
  jest.spyOn(client.client, 'subscribe').mockReturnValue({
    unsubscribe: unsubscribeFn,
    id: 'test'
  } as StompSubscription);

  client.subscribe(topic);
  client.subscribe(topic);

  expect(client.subscriptions[topic]?.subscribers).toEqual(2);

  client.unsubscribe(topic);

  expect(unsubscribeFn).not.toHaveBeenCalled();
  expect(client.subscriptions[topic]).not.toBeUndefined();
});
