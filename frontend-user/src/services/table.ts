import { DataGridProps } from '@mui/x-data-grid/models/props/DataGridProps';
import { Paging, querySearchDefault } from '@type/context';

export class TableHelper {
  static rowsPerPageOptions = [10, 20, 30, 50, 100];

  static pagingDefault: Paging = {
    currentPage: 1,
    pageSize: 1000,
    totalCount: 0,
  };

  static queryDefault: querySearchDefault = {
    page: TableHelper.pagingDefault.currentPage as number,
    pageSize: TableHelper.pagingDefault.pageSize as number,
  };

  static recoverIndex = (id: number, currentPage: number, pageSize: number) => id - (currentPage - 1) * pageSize - 1;

  static propsParamsTable = (
    { currentPage, pageSize, totalCount }: Paging,
    rowsPerPageOptions = null
  ): DataGridProps | any => {
    return {
      pagination: true,
      rowCount: totalCount,
      pageSize: pageSize || TableHelper.pagingDefault.pageSize,
      paginationMode: 'server',
      page: currentPage || TableHelper.pagingDefault.currentPage,
      rowsPerPageOptions: rowsPerPageOptions || TableHelper.rowsPerPageOptions,
    };
  };
}
