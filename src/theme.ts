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
      // bender's darker grey
      selected: '#7ca0b8'
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
