import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'

import { Button, FormControl, Input, MenuItem, Select, TextField, InputLabel, Divider }  from '@mui/material';
import { startAction, endAction, showToast } from '../../actions/common'
import { GridActionsCellItem } from '@mui/x-data-grid';
import DataTable from "../../components/DataTable";
import agent from '../../api'
import { logout } from "../../actions/auth";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'

import { useLaravelReactI18n } from 'laravel-react-i18n'

const SettingEdit = () => {
  const { t, tChoice } = useLaravelReactI18n();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [setting, setSetting] = useState({
    id: '',
    name: '',
    value: '',
    type: ''
  });

  let { id } = useParams();
  
  useEffect(()=>{
    getSetting(id);
  }, [id])

  const getSetting = async() => {
    dispatch(startAction())
    try {
      const res = await agent.common.getSetting(id);
      if (res.data.success) 
        setSetting(res.data.data);
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

  const handleChange = (event) => {
    setSetting({...setting, [event.target.name]: event.target.value});
  }

  const settingUpdate = async() => {
    console.log(setting);
    dispatch(startAction())
    try {
      const res = await agent.common.updateSetting(setting.id, setting);
      if (res.data.success) {
        dispatch(showToast('success', t('Successfully created')))
        setSetting(res.data.data);
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

  const goBack = () => {
    navigate('/settings');
  }

  return (
    <>
      <div className="main-body">
        <div className="page-wrapper">
          <div className="row">
            <div className="col">
              <div className="card">
                <div className="card-header" style={{display:'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <h5 className="card-title">{t('Setting Edit')}</h5>
                  <div>
                    <Button color="primary" startIcon={<ArrowBackIcon />} onClick={() => goBack()}>
                      { t('Back') }
                    </Button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                    {
                      setting.type === 'text' &&
                      <FormControl fullWidth margin="normal">
                        <TextField id="outlined-basic" label={t('Field Name')} margin="normal" name="title" value={setting.name} disabled />
                        <TextField id="outlined-basic" label={t('Content')} name="value" value={setting.value} multiline rows={5} onChange={handleChange} />
                      </FormControl>                   
                    }
                    {
                      setting.type === 'color' &&
                      <>
                        <div style={{display: 'flex', marginTop: '10px'}}>
                          <TextField id="outlined-basic" style={{marginRight: '20px'}} label="Title" name="title" value={setting.name} disabled />
                          <input type="color" style={{height: '55px'}} name="value" value={setting.value} onChange={handleChange} />
                        </div>
                      </>
                    }
                    </div>
                  </div>
                  <div className="text-center" style={{marginTop: '10px'}}>
                    <Button variant="outlined" onClick={() => settingUpdate()}>{t('Update')}</Button>
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

export default SettingEdit