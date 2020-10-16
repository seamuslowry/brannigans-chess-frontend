import { Client, StompSubscription, messageCallbackType } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const sockFactory = (url: string) => () => new SockJS(url);

class GameStompClient {
  client: Client;

  subscriptions: {
    [topic: string]: { subscription?: StompSubscription; subscribers: number } | undefined;
  };

  messageHandlerFactory: (topic: string) => messageCallbackType;

  constructor(
    url: string,
    handlerFactory: (topic: string) => messageCallbackType,
    connectHandler: VoidFunction,
    disconnectHandler: VoidFunction
  ) {
    this.messageHandlerFactory = handlerFactory;
    this.subscriptions = {};
    this.client = new Client({
      webSocketFactory: sockFactory(url),
      reconnectDelay: 3000,
      onConnect: connectHandler,
      onDisconnect: disconnectHandler,
      onWebSocketClose: disconnectHandler
    });
  }

  private trySubscribe(topic: string) {
    return this.connected
      ? this.client.subscribe(topic, this.messageHandlerFactory(topic))
      : undefined;
  }

  resubscribe() {
    Object.keys(this.subscriptions).forEach(key => {
      const existingSub = this.subscriptions[key];
      existingSub && (existingSub.subscription = this.trySubscribe(key));
    });
  }

  subscribe(topic: string) {
    const existingSub = this.subscriptions[topic];
    if (existingSub) {
      this.subscriptions[topic] = {
        ...existingSub,
        subscribers: existingSub.subscribers + 1
      };
    } else {
      this.subscriptions[topic] = {
        subscription: this.trySubscribe(topic),
        subscribers: 1
      };
    }
  }

  unsubscribe(topic: string) {
    const existingSub = this.subscriptions[topic];
    if (!existingSub) return;
    if (existingSub && existingSub.subscribers <= 1) {
      existingSub.subscription && existingSub.subscription.unsubscribe();
      this.subscriptions[topic] = undefined;
    } else {
      this.subscriptions[topic] = {
        ...existingSub,
        subscribers: existingSub.subscribers - 1
      };
    }
  }

  activate() {
    this.client.activate();
  }

  deactivate() {
    this.client.deactivate();
  }

  get connected() {
    return this.client.connected;
  }
}

export default GameStompClient;
