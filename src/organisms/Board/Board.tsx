import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import Tile from '../../molecules/Tile/Tile';
import usePieceSize from '../../utils/usePieceSize';
import PawnPromotion from '../PawnPromotion/PawnPromotion';
import { useAppDispatch } from '../../store/store';
import useGameColors from '../../utils/useGameColor';
import { getPieces } from '../../store/pieces/pieces';
import Marker from '../../atoms/Marker/Marker';
import { displayCol, displayRow } from '../../utils/markerHelper';

const useStyles = makeStyles({
  borderRadius: {
    borderRadius: '0.5em',
    overflow: 'hidden'
  }
});

interface Props {
  gameId: number;
}

const order = {
  WHITE: Array.from(Array(8).keys()),
  BLACK: Array.from(Array(8).keys()).reverse()
};

const Board: React.FC<Props> = ({ gameId }) => {
  const dispatch = useAppDispatch();
  const pieceSize = usePieceSize();
  const colors = useGameColors(gameId);
  const classes = useStyles();

  React.useEffect(() => {
    dispatch(getPieces({ gameId, colors }));
  }, [gameId, colors, dispatch]);

  const tileTemplate = `repeat(8, ${pieceSize})`;

  const renderOrder = order[colors[0] || 'WHITE'];

  return (
    <>
      <PawnPromotion color="WHITE" gameId={gameId} />
      <PawnPromotion color="BLACK" gameId={gameId} />
      <Box
        display="grid"
        gridTemplateColumns={`2rem ${tileTemplate}`}
        gridTemplateRows={`${tileTemplate} 2rem`}
      >
        {renderOrder.map((o, index) => (
          <React.Fragment key={`row-markers-${gameId}-${o}`}>
            <Marker gridRow={index + 1} gridColumn={1}>
              {displayRow(o)}
            </Marker>
            <Marker gridRow={9} gridColumn={index + 2}>
              {displayCol(o)}
            </Marker>
          </React.Fragment>
        ))}
        <Box
          display="grid"
          gridRow="1/9"
          gridColumn="2/10"
          gridTemplateColumns={tileTemplate}
          gridTemplateRows={tileTemplate}
          className={classes.borderRadius}
        >
          {renderOrder.map(row =>
            renderOrder.map(col => (
              <Tile key={`tile-${gameId}-${row}-${col}`} gameId={gameId} row={row} col={col} />
            ))
          )}
        </Box>
      </Box>
    </>
  );
};

export default Board;
