import { Chip, ChipProps } from '@mui/material';
import { FC, CSSProperties } from 'react';

interface ChipStatusProps extends ChipProps {
  colorStyle?: string;
  styleProps?: CSSProperties;
}

export const ChipStatus: FC<ChipStatusProps> = ({ colorStyle = '', styleProps, ...props }) => {
  return <Chip style={{ color: colorStyle, borderColor: colorStyle, ...styleProps }} variant="outlined" {...props} />;
};
