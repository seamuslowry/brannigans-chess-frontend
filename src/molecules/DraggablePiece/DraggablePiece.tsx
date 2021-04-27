import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import Piece from '../../atoms/Piece/Piece';
import { Piece as PieceEntity } from '../../services/ChessService.types';

interface Props {
  piece: PieceEntity;
  disabled?: boolean;
}

const useStyles = makeStyles({
  dragging: {
    opacity: 0.1
  }
});

const DraggablePiece: React.FC<Props> = ({ piece, disabled, ...rest }) => {
  const classes = useStyles();
  const [{ isDragging }, drag, preview] = useDrag({
    item: piece,
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    }),
    canDrag: () => !disabled
  });

  React.useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return (
    <Piece
      ref={!disabled ? drag : undefined}
      type={piece.type}
      color={piece.color}
      className={clsx(isDragging && classes.dragging)}
      draggable={!disabled}
      {...rest}
    />
  );
};

export default DraggablePiece;
