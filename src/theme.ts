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
      // brannigan's suit red
      main: '#9c003b'
    },
    secondary: {
      // brannigan's suit gold
      main: '#dcb153'
    },
    action: {
      // kif's green
      focus: '#bbd58c',
      // color of the nimbus
      selected: '#b0ac90'
    }
  },
  overrides: {
    MuiDialogTitle: {
      root: {
        textAlign: 'center'
      }
    }
  }
});

export default theme;
