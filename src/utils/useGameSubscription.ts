import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import config from '../config';
import { clearGame } from '../store/activeGame/activeGame';
import { sendAlert } from '../store/notifications/notifications';
import { setSocket, removeSocket } from '../store/socket/socket';
import { AppState } from '../store/store';

const MAX_CONNECTION_ATTEMPTS = 10;
const RECONNECT_INTERVAL_MS = 3000;

let connecting = false;
const useGameSocket = (): [Stomp.Client | null, number] => {
  const [connectionAttempts, setConnectionAttempts] = React.useState(0);
  const existingSocket = useSelector<AppState, Stomp.Client | null>(state => state.socket.current);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (connectionAttempts > MAX_CONNECTION_ATTEMPTS) {
      dispatch(sendAlert('Failed to establish connection to server. Please try again later.'));
      dispatch(clearGame());
      return;
    }
    if (existingSocket || connecting) return;

    connecting = true;

    const ws = new SockJS(`${config.serviceUrl}/ws`);
    const client = Stomp.over(ws);

    client.connect(
      {},
      () => {
        dispatch(setSocket(client));
        setConnectionAttempts(0);
        connecting = false;
      },
      () => {
        dispatch(removeSocket());
        setTimeout(() => setConnectionAttempts(ca => ca + 1), RECONNECT_INTERVAL_MS);
        connecting = false;
      }
    );
  }, [connectionAttempts, dispatch, existingSocket]);

  return [existingSocket, connectionAttempts];
};

const useGameSubscription = (subscription: string, onMessage: (m: Stomp.Message) => void) => {
  const [socket] = useGameSocket();

  React.useEffect(() => {
    socket && socket.subscribe(subscription, onMessage);

    return () => {
      socket && socket.unsubscribe(subscription);
    };
  }, [socket, subscription, onMessage]);
};

export default useGameSubscription;
