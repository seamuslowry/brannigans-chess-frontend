import activeGameReducer, { ActiveGameState } from './activeGame/activeGame';
import notificationsReducer, { NotificationsState } from './notifications/notifications';
import socketReducer, { SocketState } from './socket/socket';
import authReducer, { AuthState } from './auth/auth';
import createStompMiddleware from './middleware/stomp/stomp';
import config from '../config';
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import boardsReducer, { BoardState } from './boards/boards';

export interface AppState {
  activeGame: ActiveGameState;
  boards: BoardState;
  auth: AuthState;
  notifications: NotificationsState;
  socket: SocketState;
}

export const store = configureStore({
  reducer: {
    activeGame: activeGameReducer,
    boards: boardsReducer,
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
