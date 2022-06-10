import { TablePagination } from '@mui/material';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { Paging } from '@type/context';
import { FC } from 'react';
import { CustomNoRowsOverlay } from './CustomNoRowsOverlay';

function CustomPagination() {
  // const apiRef = useGridApiContext();
  // const page = useGridSelector(apiRef, gridPageSelector);
  // const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return <></>;
}

interface TableGridProps {
  paging: Paging;
  height?: number;
  rows?: GridRowsProp;
  columns?: GridColDef[];
  loadingData?: boolean;
}

export const TableGrid: FC<TableGridProps> = ({ paging, height = 550, columns = [], rows = [], loadingData }) => {
  const handleChangePage = () => {
    console.log('123123');
  };

  const handleChangeRowsPerPage = () => {
    console.log('handleChangeRowsPerPage');
  };

  const page = (paging.currentPage || 1) - 1;
  const rowsPerPage = paging.pageSize || 10;

  const renderId = (id) => page * rowsPerPage + id + 1;

  return (
    <Box sx={{ height, width: '100%' }}>
      <DataGrid
        pagination
        rows={rows.map((item, id) => ({ ...item, id: renderId(id) }))}
        columns={columns}
        components={{
          Pagination: CustomPagination,
          LoadingOverlay: LinearProgress,
          NoRowsOverlay: CustomNoRowsOverlay,
        }}
        hideFooter
        loading={loadingData}
      />
      <TablePagination
        component="div"
        count={paging.totalCount || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={paging.pageSize || 10}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};
