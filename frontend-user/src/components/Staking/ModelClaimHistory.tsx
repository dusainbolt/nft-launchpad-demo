/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { TokenIcon } from '@asset/icon/TokenIcon';
import { DialogModal } from '@common/Dialog/DialogModal';
import { TableGrid } from '@common/TableGrid';
import useFetchClaim from '@hooks/useFetchClaim';
import { Stack } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import Date from '@services/date';
import Helper from '@services/helper';
import { FC } from 'react';

export const ModalClaimHistory: FC<{
  open: boolean;
  toggleModal: any;
}> = ({ open, toggleModal }) => {
  const { listClaim, loadingFetchClaim } = useFetchClaim();
  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Time',
      flex: 1,
      minWidth: 50,
      renderCell: ({ value: createdAt }) => <div>{Date.toDateHoursStr(createdAt)}</div>,
    },
    {
      field: 'amount',
      headerName: 'Name',
      flex: 1,
      minWidth: 150,
      renderCell: ({ value: amount }) => (
        <Stack direction="row" alignItems="center">
          <TokenIcon size={30} />
          <div style={{ fontWeight: 700, fontSize: 14, color: '#dc6a00', marginLeft: 3 }}>{amount}</div>
          <span style={{ fontSize: 14, marginLeft: 5, display: 'block', color: '#dc6a00' }}>LHD</span>
        </Stack>
      ),
    },

    {
      field: 'transactionHash',
      headerName: 'transactionHash',
      flex: 1,
      minWidth: 150,
      renderCell: ({ value: transactionHash }) => (
        <a
          style={{ color: 'blue', textDecoration: 'underline' }}
          target="_blank"
          rel="noreferrer"
          href={Helper.getEtherUrl(transactionHash)}
        >
          View transaction
        </a>
      ),
    },
  ];
  return (
    <DialogModal
      onCloseModal={toggleModal}
      width={1000}
      id="modal-claim-history"
      open={open}
      title="Claim History"
      content={
        <div>
          <div style={{ height: 550, width: '100%' }}>
            <TableGrid
              columns={columns}
              loadingData={loadingFetchClaim}
              rows={listClaim.map((item, index) => ({ ...item, id: index + 1 }))}
            />
          </div>
        </div>
      }
    />
  );
};
