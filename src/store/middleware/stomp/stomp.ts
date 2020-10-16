import { Middleware } from 'redux';
import GameStompClient from './gameStompClient';

// should be handled by the middleware alone
const CONNECT_STOMP = 'middleware/stomp/CONNECT';
const DISCONNECT_STOMP = 'middleware/stomp/DISCONNECT';
const SUBSCRIBE_STOMP = 'middleware/stomp/SUBSCRIBE';
const UNSUBSCRIBE_STOMP = 'middleware/stomp/UNSUBSCRIBE';

// shuold be handled outside the middleware
export const STOMP_CONNECTED = 'middleware/stomp/CONNECTED';
export const STOMP_CLOSED = 'middleware/stomp/CLOSED';
export const STOMP_MESSAGE = 'middleware/stomp/MESSAGE';

export interface StompConnected {
  type: typeof STOMP_CONNECTED;
}

export interface StompDisconnected {
  type: typeof STOMP_CLOSED;
}

export interface StompMessage {
  type: typeof STOMP_MESSAGE;
  payload: {
    topic: string;
    data: string;
  };
}

interface ConnectStomp {
  type: typeof CONNECT_STOMP;
}

interface DisconnectStomp {
  type: typeof DISCONNECT_STOMP;
}

interface SubscribeStomp {
  type: typeof SUBSCRIBE_STOMP;
  payload: string;
}

interface UnubscribeStomp {
  type: typeof UNSUBSCRIBE_STOMP;
  payload: string;
}

export const connect = (): ConnectStomp => ({ type: CONNECT_STOMP });
export const disconnect = (): DisconnectStomp => ({ type: DISCONNECT_STOMP });
export const subscribe = (topic: string): SubscribeStomp => ({
  type: SUBSCRIBE_STOMP,
  payload: topic
});
export const unsubscribe = (topic: string): UnubscribeStomp => ({
  type: UNSUBSCRIBE_STOMP,
  payload: topic
});

const connected = (): StompConnected => ({ type: STOMP_CONNECTED });
const disconnected = (): StompDisconnected => ({ type: STOMP_CLOSED });
const message = (topic: string, data: string): StompMessage => ({
  type: STOMP_MESSAGE,
  payload: {
    topic,
    data
  }
});

const createStompMiddleware: (url: string) => Middleware = (url: string) => store => {
  const client = new GameStompClient(
    url,
    topic => d => store.dispatch(message(topic, d.body)),
    () => {
      store.dispatch(connected());
      client.resubscribe();
    },
    () => store.dispatch(disconnected())
  );

  const addSubscription = (topic: string) => {
    client.subscribe(topic);
  };

  const removeSubscription = (topic: string) => {
    client.unsubscribe(topic);
    Object.keys(client.subscriptions).length === 0 && store.dispatch(disconnect());
  };

  return next => action => {
    switch (action.type) {
      case CONNECT_STOMP:
        client.activate();
        break;
      case DISCONNECT_STOMP:
        client.deactivate();
        break;
      case SUBSCRIBE_STOMP:
        client.connected || store.dispatch(connect());
        addSubscription(action.payload);
        break;
      case UNSUBSCRIBE_STOMP:
        removeSubscription(action.payload);
        break;
      default:
        return next(action);
    }

    return next(action);
  };
};

export default createStompMiddleware;
