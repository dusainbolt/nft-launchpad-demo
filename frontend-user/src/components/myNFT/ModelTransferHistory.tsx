/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { DialogModal } from '@common/Dialog/DialogModal';
import { TableGrid } from '@common/TableGrid';
import useFetchTransferNFT from '@hooks/useFetchTransferNFT';
import { Chip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import Helper from '@services/helper';
import { NFTTransfer } from '@type/nft';
import { FC } from 'react';

export const ModalTransferHistory: FC<{
  open: boolean;
  toggleModal: any;
}> = ({ open, toggleModal }) => {
  const { listTransfer, loadingFetchTransfer } = useFetchTransferNFT();
  const columns: GridColDef[] = [
    {
      field: 'tokenId',
      headerName: 'Token Id',
      flex: 1,
      minWidth: 50,
      renderCell: ({ row }) => <div>{row?.nftId?.tokenId}</div>,
    },
    {
      field: 'nftId',
      headerName: 'Name',
      flex: 1,
      minWidth: 150,
      renderCell: ({ value: nft }) => <div>{nft?.name}</div>,
    },

    {
      field: 'from',
      headerName: 'From',
      flex: 1,
      minWidth: 150,
      renderCell: ({ value: from }) => <div>{Helper.splitString(from, 10, 6)}</div>,
    },
    {
      field: 'to',
      headerName: 'To',
      flex: 1,
      minWidth: 150,
      renderCell: ({ value: to }) => <div>{Helper.splitString(to, 10, 6)}</div>,
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 1,
      minWidth: 50,
      renderCell: ({ value: type }) => (
        <div>
          {type === NFTTransfer.STAKE && <Chip label="Stake" color="primary" />}
          {type === NFTTransfer.BUY && <Chip label="Buy" color="success" />}
          {type === NFTTransfer.UNSTAKE && <Chip label="Unstake" color="primary" variant="outlined" />}
        </div>
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
      id="modal-transfer-nft-history"
      open={open}
      title="NFT Transfer History"
      content={
        <div>
          <div style={{ height: 550, width: '100%' }}>
            <TableGrid
              columns={columns}
              loadingData={loadingFetchTransfer}
              rows={listTransfer.map((item, index) => ({ ...item, id: index + 1 }))}
            />
          </div>
        </div>
      }
    />
  );
};
