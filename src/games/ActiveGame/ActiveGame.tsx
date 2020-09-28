import React from 'react';
import { useParams } from 'react-router-dom';
import Board from '../Board/Board';

interface ExpectedRouteParams {
  id?: string;
}

const ActiveGame: React.FC = () => {
  let { id } = useParams<ExpectedRouteParams>();

  return <Board gameId={Number(id)} />;
};

export default ActiveGame;
