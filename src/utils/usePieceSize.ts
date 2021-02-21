import { useMediaQuery, useTheme } from '@material-ui/core';

const usePieceSize = () => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down('sm'));

  return sm ? '7vw' : '5vw';
};

export default usePieceSize;
