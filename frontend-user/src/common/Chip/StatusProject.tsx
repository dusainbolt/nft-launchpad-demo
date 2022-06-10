import { ProjectStatus, ProjectStatusData } from '@type/project';
import { CSSProperties, FC } from 'react';
import { ChipStatus } from './ChipStatus';

export const StatusProject: FC<{ status: ProjectStatus; styleProps?: CSSProperties }> = ({
  status = ProjectStatus.INACTIVE,
  styleProps = {},
}) => {
  const statusData = ProjectStatusData[status];

  return <ChipStatus styleProps={styleProps} label={statusData?.text} colorStyle={statusData?.color} />;
};
