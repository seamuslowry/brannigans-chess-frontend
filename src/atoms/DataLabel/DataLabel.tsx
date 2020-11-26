import React from 'react';
import { makeStyles, Typography, TypographyProps } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  margin: {
    marginRight: theme.spacing(1)
  }
}));

const DataLabel: React.FC<TypographyProps> = props => {
  const classes = useStyles();

  return <Typography display="inline" color="secondary" className={classes.margin} {...props} />;
};

export default DataLabel;
