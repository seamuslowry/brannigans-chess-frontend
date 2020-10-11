import React from 'react';
import { Grid } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { clearGame, setGameId } from '../../store/activeGame/activeGame';
import Board from '../Board/Board';
import MoveList from '../MoveList/MoveList';
import TakenPieces from '../TakenPieces/TakenPieces';
import config from '../../config';

interface ExpectedRouteParams {
  id?: string;
}

const ws = new SockJS(`${config.serviceUrl}/game`);
const client = Stomp.over(ws);

client.connect({}, () => {
  console.log('connected');
});

const ActiveGame: React.FC = () => {
  const { id } = useParams<ExpectedRouteParams>();
  const dispatch = useDispatch();

  const [connected, setConnected] = React.useState(false);

  const gameId = Number(id);

  React.useEffect(() => {
    dispatch(setGameId(gameId));

    return () => {
      dispatch(clearGame());
    };
  }, [gameId, dispatch]);

  React.useEffect(() => {
    client.connect({}, () => setConnected(true));

    return () => {
      client.disconnect(() => setConnected(false));
    };
  }, [gameId]);

  React.useEffect(() => {
    const sub = `/topic/gameStatus/${gameId}`;
    connected && client.subscribe(sub, d => console.log(d));

    return () => {
      client.unsubscribe(sub);
    };
  }, [gameId, connected]);

  return (
    <Grid container justify="space-evenly" spacing={2}>
      <Grid item container xs={12} md={8} wrap="nowrap" justify="center">
        <Grid item>
          <TakenPieces gameId={gameId} color="WHITE" />
        </Grid>
        <Grid item>
          <Board gameId={gameId} />
        </Grid>
        <Grid item>
          <TakenPieces gameId={gameId} color="BLACK" />
        </Grid>
      </Grid>
      <Grid item xs={12} md={3}>
        <MoveList gameId={gameId} />
      </Grid>
    </Grid>
  );
};

export default ActiveGame;
