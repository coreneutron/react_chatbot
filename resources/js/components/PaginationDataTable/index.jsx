import React, {useState} from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';

import './PaginationDataTable.scss'

import { useLaravelReactI18n } from 'laravel-react-i18n'

export default function PaginationDataTable(props) {
  const { t, tChoice } = useLaravelReactI18n();
  const { columns, data, pageSize, rowsPerPageOptions, totalCount, paginationMode, selectionModel } = props;

  const onPageChange = (newPage) => {
    props.onPageChange(newPage);
  };

  const onPageSizeChange = (newPageSize) => {
    props.onPageSizeChange(newPageSize);
  }

  const onAddClick = () => {
    props.onAddClick();
  }
  const onDeleteClick = () => {
    props.onDeleteClick();
  }

  const onSelectionModelChange = (newSelectionModel) => {
    props.onSelectionModelChange(newSelectionModel);
  }

  const EditToolbar = () => {
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={onAddClick}>
          レコードを追加
        </Button>
        <Button color="primary" startIcon={<DeleteIcon />} onClick={onDeleteClick} disabled = {selectionModel.length > 0 ? false : true}>
          { t('Selected Item Delete!') }
        </Button>
      </GridToolbarContainer>
    );
  }

   return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        rowsPerPageOptions={rowsPerPageOptions}
        paginationMode = {paginationMode}
        onPageChange={onPageChange}
        onAddClick={onAddClick}
        onDeleteClick={onDeleteClick}
        rowCount={totalCount}
        components={{
          Toolbar: EditToolbar,
        }}
        checkboxSelection
        disableSelectionOnClick
        onSelectionModelChange={onSelectionModelChange}
        selectionModel={selectionModel}
      />
    </div>
  );
}