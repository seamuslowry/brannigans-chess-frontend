import notificationsReducer, { NotificationsState } from './notifications/notifications';
import socketReducer, { SocketState } from './socket/socket';
import authReducer, { AuthState } from './auth/auth';
import createStompMiddleware from './middleware/stomp/stomp';
import config from '../config';
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import boardsReducer, { BoardState } from './boards/boards';
import piecesReducer, { PieceState } from './pieces/pieces';
import movesReducer, { MoveState } from './moves/moves';
import gamesReducer, { GameState } from './games/games';

export interface AppState {
  games: GameState;
  boards: BoardState;
  pieces: PieceState;
  moves: MoveState;
  auth: AuthState;
  notifications: NotificationsState;
  socket: SocketState;
}

export const store = configureStore({
  reducer: {
    games: gamesReducer,
    boards: boardsReducer,
    pieces: piecesReducer,
    moves: movesReducer,
    auth: authReducer,
    notifications: notificationsReducer,
    socket: socketReducer
  },
  devTools: config.reduxDevtools,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(createStompMiddleware(`${config.serviceUrl}/ws`))
});

type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
