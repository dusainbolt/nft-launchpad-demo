import { Tooltip } from '@mui/material';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { FC } from 'react';

interface ButtonIconProps extends IconButtonProps {
  icon: any;
  loading?: boolean;
  onClick?: any;
  helpText?: string;
}

export const ButtonIcon: FC<ButtonIconProps> = ({ icon, helpText, loading, onClick, ...props }) => {
  const button = (
    <IconButton onClick={onClick} disabled={loading} size="small" {...props}>
      {icon}
    </IconButton>
  );
  return helpText ? (
    <Tooltip title={helpText} disableFocusListener disableTouchListener>
      {button}
    </Tooltip>
  ) : (
    button
  );
};
