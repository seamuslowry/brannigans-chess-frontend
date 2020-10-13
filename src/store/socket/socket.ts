import Stomp from 'stompjs';

export const SET_SOCKET = 'chess/sockets/SET_SOCKET';
export const REMOVE_SOCKET = 'chess/sockets/REMOVE_SOCKET';

export interface SocketState {
  current: Stomp.Client | null;
}

export const initialState: SocketState = {
  current: null
};

interface SetSocket {
  type: typeof SET_SOCKET;
  payload: Stomp.Client;
}

interface RemoveSocket {
  type: typeof REMOVE_SOCKET;
}

type SocketAction = SetSocket | RemoveSocket;

export const reducer = (state: SocketState = initialState, action: SocketAction): SocketState => {
  let currentSocket;

  switch (action.type) {
    case SET_SOCKET:
      currentSocket = state.current;
      currentSocket && currentSocket.disconnect(() => {});
      return {
        ...state,
        current: action.payload
      };
    case REMOVE_SOCKET:
      currentSocket = state.current;
      currentSocket && currentSocket.disconnect(() => {});
      return {
        ...state,
        current: null
      };
    default:
      return state;
  }
};

export const setSocket = (socket: Stomp.Client): SetSocket => ({
  type: SET_SOCKET,
  payload: socket
});

export const removeSocket = (): RemoveSocket => ({
  type: REMOVE_SOCKET
});
