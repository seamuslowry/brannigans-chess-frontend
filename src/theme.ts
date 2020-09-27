import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  props: {
    MuiButton: {
      variant: 'contained'
    }
  },
  palette: {
    type: 'dark',
    primary: {
      main: '#9c003b'
    },
    secondary: {
      main: '#dcb153'
    }
  }
});

export default theme;
