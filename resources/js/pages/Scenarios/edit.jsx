import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'

import { Button, FormControl, Input, MenuItem, Select, TextField, InputLabel }  from '@mui/material';
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

const ScenarioEdit = () => {
  const { t, tChoice } = useLaravelReactI18n();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputField = useRef(null);

  const [preview, setPreview] = useState({
    src: '',
    alt: ''
  });

  const [scenario, setScenario] = useState({
    title : '',
    message : '',
    question_id : 0,
    image: ''
  });

  const [file, setFile] = useState();

  let { id } = useParams();
  
  useEffect(()=>{
      getScenario(id)
  }, [id])

  const getScenario = async(id) => {
    try {
      const res = await agent.common.getScenario(id)
      if (res.data.success) {
        setScenario(res.data.data);
        setPreview({...preview, src:'/upload/' + res.data.data.image})
      }
    } catch (error) {
      if (error.response.status >= 400 && error.response.status <= 500) {
        dispatch(showToast('error', error.response.data.message))
        if (error.response.data.message == 'Unauthorized') {
          localStorage.removeItem('token')
          dispatch(logout())
          navigate('/')
        }
      }
    }
  }

  const fileHandler = event => {
    const { files } = event.target;
    setFile(files[0]);
    setPreview(
      files.length
        ? 
        {
          src: URL.createObjectURL(files[0]),
          alt: files[0].name
        }
        : 
        {
          src: '',
          alt: ''
        }
    );
  };

  const handleChange = (event) => {
    setScenario({...scenario, [event.target.name]: event.target.value});
  }

  const uploadImage = () => {
    fileInputField.current.click();
  }

  const goBack = () => {
    navigate('/scenarios');
  }

  
  const scenarioUpdate = async() => {
    const formData = new FormData();
    formData.append("title", scenario.title);
    formData.append("message", scenario.message);
    formData.append("question_id", scenario.routing);
    if(file)
      formData.append("file", file);

    dispatch(startAction())
    try {
      const res = await agent.common.createScenario(formData);
      if (res.data.success) {
        dispatch(showToast('success', t('Successfully created')))
        setScenario(res.data.data);
      }
      dispatch(endAction());
    } catch (error) {
      if (error.response.status >= 400 && error.response.status <= 500) {
        dispatch(endAction());
        dispatch(showToast('error', t(error.response.data.message)));
        if (error.response.data.message == 'Unauthorized') {
          localStorage.removeItem('token');
          dispatch(logout());
          navigate('/');
        }
      }
    }
  }

  return (
    <>
      <div className="main-body">
        <div className="page-wrapper">
          <div className="row">
            <div className="col">
              <div className="card">
                <div className="card-header" style={{display:'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <h5 className="card-title">Scenario Edit</h5>
                  <div>
                    <Button color="primary" startIcon={<ArrowBackIcon />} onClick={() => goBack()}>
                      { t('Back') }
                    </Button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <FormControl fullWidth margin="normal">
                        <TextField id="outlined-basic" label="title" name="title" value={scenario.title} onChange={handleChange} />
                      </FormControl>
                      <FormControl fullWidth margin="normal">
                        <TextField id="outlined-basic" label="message" name="message"  multiline rows={5} value={scenario.message} onChange={handleChange} />
                      </FormControl>
                      <FormControl fullWidth margin="normal">
                        <InputLabel id="demo-simple-select-label">Question ID</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          name="question_id"
                          label="question_id"
                          value=""
                          onChange={handleChange}
                        >
                          {
                              <MenuItem value='' key=''></MenuItem>
                          }
                        </Select>
                      </FormControl>
                      <FormControl fullWidth margin="normal">
                        <div className="cursor-pointer" onClick={()=>uploadImage()} >
                          <FileUploadIcon />File Upload
                        </div>
                        <input className="d-none" accept="image/*" ref={fileInputField} type="file" onChange={fileHandler} />
                        <img className="preview" src={preview.src} alt={preview.alt} style={{width: '200px', height: '200px'}} onClick={()=>uploadImage()}/>
                      </FormControl>
                    </div>
                    
                  </div>
                  <div className="text-center">
                    <Button variant="outlined" onClick={() => scenarioUpdate()}>Scenario Update</Button>
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

export default ScenarioEdit