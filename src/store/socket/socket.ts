import { AnyAction, createSlice } from '@reduxjs/toolkit';
import {
  MessagePayload,
  StompConnected,
  StompDisconnected,
  StompMessage,
  STOMP_CLOSED,
  STOMP_CONNECTED,
  STOMP_MESSAGE
} from '../middleware/stomp/stomp';

export interface SocketState {
  messages: MessagePayload[];
  connected: boolean;
}

export const initialState: SocketState = {
  messages: [],
  connected: false
};

const socketSlice = createSlice({
  name: 'chess/socket',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(
        (action: AnyAction): action is StompMessage => action.type === STOMP_MESSAGE,
        (state, action) => {
          state.messages.push(action.payload);
        }
      )
      .addMatcher(
        (action: AnyAction): action is StompConnected => action.type === STOMP_CONNECTED,
        state => {
          state.connected = true;
        }
      )
      .addMatcher(
        (action: AnyAction): action is StompDisconnected => action.type === STOMP_CLOSED,
        state => {
          state.connected = false;
        }
      );
  }
});

export default socketSlice.reducer;
