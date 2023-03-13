import React, { useState, useEffect } from "react";
import { useLaravelReactI18n } from 'laravel-react-i18n';

import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
  randomId,
} from '@mui/x-data-grid-generator';

import './DataGridTable.scss'

const initialRows = [
];

function EditToolbar(props) {
  const { setRows, setRowModesModel, addColumns } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, ...addColumns}]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        レコードを追加
      </Button>
    </GridToolbarContainer>
  );
}

EditToolbar.propTypes = {
  setRowModesModel: PropTypes.func.isRequired,
  setRows: PropTypes.func.isRequired,
};

const DataGridTable = (props) => {
  const { title } = props;
  const { t, tChoice } = useLaravelReactI18n();
  const [rows, setRows] = useState(initialRows);
  const [rowModesModel, setRowModesModel] = useState({});

  useEffect(() => {
    setRows([...props.data])
  }, [props.data])

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id) => () => {
    props.clickEditBtn();
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    props.clickDeleteBtn(id);
    // setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    props.clickCancelBtn();
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    props.clickSaveBtn(newRow)
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const columns = [
    ...props.column,
    {
      field: 'actions',
      type: 'actions',
      headerName: '操作',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];


  return (
    <>
    <div className="page-header">
      <div className="page-block">
        <div className="row align-items-center">
          <div className="col-md-12">
            <div className="page-header-title">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="main-body">
      <div className="page-wrapper">
        <div className="row"> 
          <div className="col">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">{ title }</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="table_container">
                      <Box
                        sx={{
                          height: 500,
                          width: '100%',
                          '& .actions': {
                            color: 'text.secondary',
                          },
                          '& .textPrimary': {
                            color: 'text.primary',
                          },
                        }}
                      >
                        <DataGrid
                          rows={rows}
                          columns={columns}
                          editMode="row"
                          rowModesModel={rowModesModel}
                          onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
                          onRowEditStart={handleRowEditStart}
                          onRowEditStop={handleRowEditStop}
                          processRowUpdate={processRowUpdate}
                          components={{
                            Toolbar: EditToolbar,
                          }}
                          componentsProps={{
                            toolbar: { setRows, setRowModesModel },
                          }}
                          experimentalFeatures={{ newEditingApi: true }}
                        />
                      </Box>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}

export default DataGridTable;