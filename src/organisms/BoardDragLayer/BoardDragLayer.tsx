import { Box, makeStyles } from '@material-ui/core';
import React from 'react';
import { XYCoord, useDragLayer } from 'react-dnd';
import Piece from '../../atoms/Piece/Piece';
import usePieceSize from '../../utils/usePieceSize';

const useStyles = makeStyles({
  container: {
    pointerEvents: 'none'
  }
});

const getItemOffset = (currentOffset: XYCoord) => {
  let { x, y } = currentOffset;

  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform
  };
};

const BoardDragLayer: React.FC = () => {
  const classes = useStyles();

  const { item, offset } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    offset: monitor.getSourceClientOffset()
  }));

  const size = usePieceSize();

  if (!(item && offset)) {
    return null;
  }
  return (
    <Box
      className={classes.container}
      position="fixed"
      height="100%"
      width="100%"
      top={0}
      left={0}
      zIndex={100}
      data-testid="board-drag-layer"
    >
      <Box style={getItemOffset(offset)} height={size} width={size}>
        <Piece type={item.type} color={item.color} />
      </Box>
    </Box>
  );
};

export default BoardDragLayer;
