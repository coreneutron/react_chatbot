import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

import { Button, FormControl, Input, MenuItem, Select, FormControlLabel, Radio }  from '@mui/material';
import { startAction, endAction, showToast } from '../../actions/common'
import DataTable from "../../components/DataTable";
import agent from '../../api'
import { logout } from "../../actions/auth";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'

import { useLaravelReactI18n } from 'laravel-react-i18n'

const Scenarios = () => {
  const { t, tChoice } = useLaravelReactI18n();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [scenarios, setScenarios] =  useState([]);
  const scenarioColumns = [
    {
      field: 'status',
      headerName: t('Status'),
      maxWidth: 100,
      renderCell: (params) => {
        return <Radio
          checked={params.row.status === 1}
          onChange={()=>handleStatusChange(params.row.id, params.row.status)}
          value={params.row.status}
          name="radio-buttons"
          inputProps={{ 'aria-label': 'A' }}
        />
      }
    }, 
    {
      field: 'title',
      headerName: t('Title'),
      maxWidth: 300,
      editable: false
    }, 
    {
      field: 'message',
      headerName: t('Content'),
      flex: 1,
      editable: false
    }, 
    {
      field: 'actions',
      headerName: '操作',
      minWidth: 100,
      renderCell: ( params ) => {
        if(params.row.role != 1){
          return  <div>
            <RemoveRedEyeIcon onClick={()=>goEditPage(params.row.id)} style={{cursor: 'pointer', fontSize: '1.25rem', marginRight: '10px'}} />
            <DeleteIcon onClick={()=>scenarioDelete(params.row.id)} style={{cursor: 'pointer', fontSize: '1.25rem'}} />
          </div>
        } 
        else 
          return <div key={params.row.id}></div>;
      },
    },
  ]

  useEffect(() => {
    getScenarios()
  }, [])

  const getScenarios = async () => {
    dispatch(startAction())
    try {
      const res = await agent.common.getScenarios();
      if (res.data.success) {
        setScenarios(res.data.data);
      }
      dispatch(endAction());
    } catch (error) {
      if (error.response.status >= 400 && error.response.status <= 500) {
        dispatch(endAction());
        dispatch(showToast('error', t(error.response.data.message)));
        if (error.response.data.message == 'Unauthorized') {
          localStorage.removeItem('token');
          dispatch(logout());
          navigate('/login');
        }
      }
    }
  }

  const handleStatusChange = async (id, status) => {
    dispatch(startAction())
    try {
      const res = await agent.common.updateScenarioStatus(id, status);
      if (res.data.success) {
        setScenarios(res.data.data);
      }
      dispatch(endAction());
    } catch (error) {
      if (error.response.status >= 400 && error.response.status <= 500) {
        dispatch(endAction());
        dispatch(showToast('error', t(error.response.data.message)));
        if (error.response.data.message == 'Unauthorized') {
          localStorage.removeItem('token');
          dispatch(logout());
          navigate('/login');
        }
      }
    }
  }

  const scenarioDelete = async(id) => {
    dispatch(startAction())
    try {
      const res = await agent.common.deleteScenario(id);
      if (res.data.success) {
        setScenarios(res.data.data);
      }
      dispatch(endAction());
    } catch (error) {
      if (error.response.status >= 400 && error.response.status <= 500) {
        dispatch(endAction());
        dispatch(showToast('error', t(error.response.data.message)));
        if (error.response.data.message == 'Unauthorized') {
          localStorage.removeItem('token');
          dispatch(logout());
          navigate('/login');
        }
      }
    }
  }

  const goCreatePage = () => {
    navigate('/scenario/create');
  }

  const goEditPage = (id) => {
    navigate(`/scenario/edit/${id}`);
  }

  return (
    <>
      <div className="main-body">
        <div className="page-wrapper">
          <div className="row">
            <div className="col">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">{t('Scenario List')}</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="table_container">
                        <Button color="primary" startIcon={<AddIcon />} onClick={() => goCreatePage()}>{t('Create')}</Button>
                        <DataTable 
                          data={scenarios}
                          columns={scenarioColumns}
                        />
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

export default Scenarios