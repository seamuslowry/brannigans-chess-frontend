import React from 'react';
import { IconButton, OutlinedInput, OutlinedInputProps } from '@material-ui/core';
import { FileCopy, Check } from '@material-ui/icons';
import useClipboard from 'react-use-clipboard';

interface Props {
  value: string;
}

const ClipboardTextField: React.FC<Props & Omit<OutlinedInputProps, 'endAdornment' | 'value'>> = ({
  value,
  ...rest
}) => {
  const [isCopied, setCopied] = useClipboard(value, { successDuration: 2000 });

  return (
    <OutlinedInput
      value={value}
      endAdornment={
        <IconButton
          aria-label={isCopied ? 'Game URL copied' : 'Copy game URL'}
          disabled={isCopied}
          onClick={setCopied}
        >
          {isCopied ? <Check /> : <FileCopy />}
        </IconButton>
      }
      {...rest}
    />
  );
};

export default ClipboardTextField;
