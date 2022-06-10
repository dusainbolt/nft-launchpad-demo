import { ProfileStatus, ProfileStatusData } from '@type/user';
import { FC, CSSProperties } from 'react';
import { ChipStatus } from './ChipStatus';

export const StatusKYC: FC<{ status: ProfileStatus; styleProps?: CSSProperties }> = ({
  status = ProfileStatus.EDIT,
  styleProps = {},
}) => {
  const statusData = ProfileStatusData[status];

  return <ChipStatus styleProps={styleProps} label={statusData?.text} colorStyle={statusData?.color} />;
};
