import {
  StompConnected,
  StompDisconnected,
  StompMessage,
  STOMP_CLOSED,
  STOMP_CONNECTED,
  STOMP_MESSAGE
} from '../middleware/stomp/stomp';

export interface Message {
  topic: string;
  data: string;
}

export interface SocketState {
  messages: Message[];
  connected: boolean;
}

export const initialState: SocketState = {
  messages: [],
  connected: false
};

type SocketAction = StompConnected | StompDisconnected | StompMessage;

export const reducer = (state: SocketState = initialState, action: SocketAction): SocketState => {
  switch (action.type) {
    case STOMP_CONNECTED:
      return {
        ...state,
        connected: true
      };
    case STOMP_CLOSED:
      return {
        ...state,
        connected: false
      };
    case STOMP_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    default:
      return state;
  }
};
