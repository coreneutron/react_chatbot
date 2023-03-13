import React, {useState} from 'react';
import { DataGrid } from '@mui/x-data-grid';

import './DataTable.scss'

export default function DataTable(props) {
  const { columns, data } = props;

  const [pageSize, setPageSize] = useState(25);

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[25, 50, 100]}
        disableSelectionOnClick
      />
    </div>
  );
}