import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import config from '../config';
import { addSocket, removeSocket } from '../store/sockets/sockets';
import { AppState } from '../store/store';

const MAX_CONNECTION_ATTEMPTS = 10;
const RECONNECT_INTERVAL_MS = 3000;

let processingIds: number[] = [];
const useGameSocket = (gameId: number): [Stomp.Client | null, number] => {
  const [connectionAttempts, setConnectionAttempts] = React.useState(0);
  const existingSocket = useSelector<AppState, Stomp.Client | null>(
    state => state.sockets.sockets[gameId]
  );
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (connectionAttempts > MAX_CONNECTION_ATTEMPTS) return () => {};
    if (existingSocket || processingIds.includes(gameId)) return () => {};

    processingIds = [...processingIds, gameId];

    const ws = new SockJS(`${config.serviceUrl}/ws`);
    const client = Stomp.over(ws);

    client.connect(
      {},
      () => {
        dispatch(addSocket(gameId, client));
        setConnectionAttempts(0);
        processingIds = processingIds.filter(n => n !== gameId);
      },
      () => {
        dispatch(removeSocket(gameId));
        setTimeout(() => setConnectionAttempts(ca => ca + 1), RECONNECT_INTERVAL_MS);
        processingIds = processingIds.filter(n => n !== gameId);
      }
    );

    return () => {};
  }, [gameId, connectionAttempts, dispatch, existingSocket]);

  return [existingSocket, connectionAttempts];
};

export default useGameSocket;
