import React from 'react';
import { PieceColor } from '../../services/ChessService.types';
import JoinGameButton from './JoinGameButton/JoinGameButton';
import LeaveGameButton from './LeaveGameButton/LeaveGameButton';

interface Props {
  gameId: number;
  color: PieceColor;
}

const JoinAndLeaveButton: React.FC<Props> = ({ gameId, color }) => {
  return (
    <>
      <JoinGameButton size="small" color="primary" gameId={gameId} pieceColor={color} />
      <LeaveGameButton size="small" color="secondary" gameId={gameId} pieceColor={color} />
    </>
  );
};

export default JoinAndLeaveButton;
