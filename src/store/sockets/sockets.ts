import Stomp from 'stompjs';

export const PREP_SOCKET = 'chess/sockets/PREP_SOCKET';
export const ADD_SOCKET = 'chess/sockets/ADD_SOCKET';
export const REMOVE_SOCKET = 'chess/sockets/REMOVE_SOCKET';

export interface SocketsState {
  sockets: { [key: number]: Stomp.Client | null };
}

export const initialState: SocketsState = {
  sockets: {}
};

interface AddSocket {
  type: typeof ADD_SOCKET;
  payload: {
    gameId: number;
    socket: Stomp.Client;
  };
}

interface RemoveSocket {
  type: typeof REMOVE_SOCKET;
  payload: {
    gameId: number;
  };
}

type SocketsAction = AddSocket | RemoveSocket;

export const reducer = (
  state: SocketsState = initialState,
  action: SocketsAction
): SocketsState => {
  let currentSocket;

  switch (action.type) {
    case ADD_SOCKET:
      currentSocket = state.sockets[action.payload.gameId];
      currentSocket && currentSocket.disconnect(() => {});
      return {
        ...state,
        sockets: {
          ...state.sockets,
          [action.payload.gameId]: action.payload.socket
        }
      };
    case REMOVE_SOCKET:
      currentSocket = state.sockets[action.payload.gameId];
      currentSocket && currentSocket.disconnect(() => {});
      return {
        ...state,
        sockets: {
          ...state.sockets,
          [action.payload.gameId]: null
        }
      };
    default:
      return state;
  }
};

export const addSocket = (gameId: number, socket: Stomp.Client): AddSocket => ({
  type: ADD_SOCKET,
  payload: {
    gameId,
    socket
  }
});

export const removeSocket = (gameId: number): RemoveSocket => ({
  type: REMOVE_SOCKET,
  payload: { gameId }
});
