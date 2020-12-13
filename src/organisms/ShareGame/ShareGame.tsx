import React from 'react';
import { FormControl, InputLabel } from '@material-ui/core';
import ClipboardTextField from '../../molecules/ClipboardTextField/ClipboardTextField';

interface Props {
  gameId: number;
}

const ShareGame: React.FC<Props> = ({ gameId }) => {
  return (
    <FormControl fullWidth margin="none" variant="outlined">
      <InputLabel color="secondary" htmlFor={`share-game-${gameId}`}>
        Copy URL to Share
      </InputLabel>
      <ClipboardTextField
        id={`share-game-${gameId}`}
        color="secondary"
        fullWidth
        value={`${window.location.origin}/game/${gameId}`}
        label="Copy URL to Share"
        margin="dense"
      />
    </FormControl>
  );
};

export default ShareGame;
