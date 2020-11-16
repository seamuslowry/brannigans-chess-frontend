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

const rows = {
  WHITE: Array.from(Array(8).keys()),
  BLACK: Array.from(Array(8).keys()).reverse()
};

const cols = Array.from(Array(8).keys());

const Board: React.FC<Props> = ({ gameId }) => {
  const dispatch = useAppDispatch();
  const pieceSize = usePieceSize();
  const colors = useGameColors(gameId);
  const classes = useStyles();

  React.useEffect(() => {
    dispatch(getPieces({ gameId, colors }));
  }, [gameId, colors, dispatch]);

  const tileTemplate = `repeat(8, ${pieceSize})`;

  const renderRows = rows[colors[0] || 'WHITE'];

  return (
    <>
      <PawnPromotion color="WHITE" gameId={gameId} />
      <PawnPromotion color="BLACK" gameId={gameId} />
      <Box
        display="grid"
        gridTemplateColumns={`2rem ${tileTemplate} 2rem`}
        gridTemplateRows={`2rem ${tileTemplate} 2rem`}
      >
        {renderRows.map((r, index) => (
          <React.Fragment key={`row-markers-${gameId}-${r}`}>
            <Marker gridRow={index + 2} gridColumn={1}>
              {displayRow(r)}
            </Marker>
            <Marker gridRow={index + 2} gridColumn={10}>
              {displayRow(r)}
            </Marker>
          </React.Fragment>
        ))}
        {cols.map(c => (
          <React.Fragment key={`col-markers-${gameId}-${c}`}>
            <Marker gridRow={1} gridColumn={c + 2}>
              {displayCol(c)}
            </Marker>
            <Marker gridRow={10} gridColumn={c + 2}>
              {displayCol(c)}
            </Marker>
          </React.Fragment>
        ))}
        <Box
          display="grid"
          gridRow="2/10"
          gridColumn="2/10"
          gridTemplateColumns={tileTemplate}
          gridTemplateRows={tileTemplate}
          className={classes.borderRadius}
        >
          {renderRows.map(row =>
            cols.map(col => (
              <Tile key={`tile-${gameId}-${row}-${col}`} gameId={gameId} row={row} col={col} />
            ))
          )}
        </Box>
      </Box>
    </>
  );
};

export default Board;
