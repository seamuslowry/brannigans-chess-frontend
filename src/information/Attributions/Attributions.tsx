import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  footer: {
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '20%',
    fontSize: '.75rem',
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper
  }
}));

const Attributions: React.FC = () => {
  const classes = useStyles();

  return (
    <Typography className={classes.footer}>
      Icons by en:User:Cburnett - Own work This W3C-unspecified vector image was created with
      Inkscape., CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=1499810
    </Typography>
  );
};

export default Attributions;
