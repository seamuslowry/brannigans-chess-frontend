import { Grid } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { clearGame, setGameId } from '../../store/activeGame/activeGame';
import Board from '../Board/Board';
import MoveList from '../MoveList/MoveList';
import TakenPieces from '../TakenPieces/TakenPieces';

interface ExpectedRouteParams {
  id?: string;
}

const ActiveGame: React.FC = () => {
  let { id } = useParams<ExpectedRouteParams>();
  const dispatch = useDispatch();

  const gameId = Number(id);

  React.useEffect(() => {
    dispatch(setGameId(gameId));

    return () => {
      dispatch(clearGame());
    };
  }, [gameId, dispatch]);

  return (
    <Grid container justify="space-between">
      <Grid item container xs={12} md={9} wrap="nowrap" justify="center">
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
