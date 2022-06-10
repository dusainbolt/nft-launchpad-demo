import { LoadingButton, LoadingButtonProps } from '@mui/lab';
import { Tooltip } from '@mui/material';
import { FC } from 'react';

interface ButtonProps extends LoadingButtonProps {
  helpText?: string;
}

export const Button: FC<ButtonProps> = ({ children, helpText = '', ...props }) => {
  const button = (
    <LoadingButton {...props}>
      <span
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {children}
      </span>
    </LoadingButton>
  );

  return helpText ? (
    <Tooltip title={helpText} disableFocusListener disableTouchListener>
      {button}
    </Tooltip>
  ) : (
    button
  );
};
