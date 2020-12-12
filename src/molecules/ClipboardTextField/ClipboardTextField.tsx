import React from 'react';
import {
  IconButton,
  makeStyles,
  OutlinedInput,
  OutlinedInputProps,
  Tooltip
} from '@material-ui/core';
import { FileCopy, Check } from '@material-ui/icons';
import useClipboard from 'react-use-clipboard';

interface Props {
  value: string;
}

const useStyles = makeStyles({
  tooltip: {
    margin: 0
  }
});

const ClipboardTextField: React.FC<Props & Omit<OutlinedInputProps, 'endAdornment' | 'value'>> = ({
  value,
  ...rest
}) => {
  const [isCopied, setCopied] = useClipboard(value, { successDuration: 2000 });
  const classes = useStyles();

  return (
    <OutlinedInput
      value={value}
      color="secondary"
      spellCheck={false}
      endAdornment={
        <Tooltip
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title="Copied"
          aria-label="copied"
          open={isCopied}
          placement="top"
          classes={{
            tooltip: classes.tooltip
          }}
        >
          <IconButton
            aria-label={isCopied ? 'Game URL copied' : 'Copy game URL'}
            disabled={isCopied}
            onClick={setCopied}
          >
            {isCopied ? <Check /> : <FileCopy />}
          </IconButton>
        </Tooltip>
      }
      {...rest}
    />
  );
};

export default ClipboardTextField;
