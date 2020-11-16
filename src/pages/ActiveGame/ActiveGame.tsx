import React from 'react';
import { Grid } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import Board from '../../organisms/Board/Board';
import MoveList from '../../organisms/MoveList/MoveList';
import TakenPieces from '../../organisms/TakenPieces/TakenPieces';
import GameStatus from '../../organisms/GameStatus/GameStatus';

interface ExpectedRouteParams {
  id?: string;
}

const ActiveGame: React.FC = () => {
  const { id } = useParams<ExpectedRouteParams>();

  const gameId = Number(id);

  return (
    <Grid container justify="space-evenly" spacing={2}>
      <Grid item container xs={12} md={8} wrap="nowrap" justify="center" spacing={1}>
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
      <Grid item container xs={12} md={3} spacing={2} alignContent="flex-start">
        <Grid item xs={12}>
          <GameStatus gameId={gameId} />
        </Grid>
        <Grid item xs={12}>
          <MoveList gameId={gameId} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ActiveGame;
