import { Button } from '@common/Button';
import { StatusProject } from '@common/Chip/StatusProject';
import WidgetsIcon from '@mui/icons-material/Widgets';
import { Link } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { openDialogApp } from '@redux/slices/layoutSlice';
import { useAppDispatch } from '@redux/store';
import { ContractService } from '@services/contract';
import Date from '@services/date';
import { Project, ProjectStatus } from '@type/project';
import { useWeb3React } from '@web3-react/core';
import { FC, useCallback, useState } from 'react';

export const CardProject: FC<{
  project: Project;
}> = ({ project: { avatar, name, status, updatedAt, apiKey, encodeABI, _id } }) => {
  const { account, library } = useWeb3React();
  const [loadingTransaction, setLoadingTransaction] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const callbackDeploy = (e, data) => {
    console.log(e, data);
  };

  const handleActiveProject = useCallback(async () => {
    setLoadingTransaction(true);
    try {
      const contractService = new ContractService(library, account as any);
      await contractService.callContractKYC(encodeABI, callbackDeploy);
      setLoadingTransaction(false);
    } catch (e) {
      setLoadingTransaction(false);
    }
  }, [account, library]);

  const activeProject = () => {
    dispatch(
      openDialogApp({
        title: 'Active your Project',
        description: `Are you sure to active ${name}`,
        callbackOk: () => handleActiveProject(),
      })
    );
  };

  return (
    <Card sx={{ display: 'flex' }}>
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image={avatar || 'https://www.leadershipmartialartsct.com/wp-content/uploads/2017/04/default-image-620x600.jpg'}
        alt="Live from space album cover"
      />
      <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Link target="_blank" href={`/project/${_id}`}>
            <Typography component="div" variant="h6">
              {name}
            </Typography>
          </Link>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            {apiKey}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            {Date.toDateHoursStr(updatedAt)}
          </Typography>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
          <StatusProject styleProps={{ marginRight: 10 }} status={status as any} />
          {ProjectStatus.ACTIVE !== status && (
            <Button
              loading={loadingTransaction}
              startIcon={<WidgetsIcon />}
              onClick={activeProject}
              variant="contained"
            >
              Active
            </Button>
          )}
        </Box>
      </Box>
    </Card>
  );
};
