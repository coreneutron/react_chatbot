import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

import { Button, FormControl, Input, MenuItem, Select, FormControlLabel, Radio, InputLabel }  from '@mui/material';
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

const Question = () => {
  const { t, tChoice } = useLaravelReactI18n();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [scenarios, setScenarios] =  useState([]);
  const [scenario, setScenario] = useState({
    scenario_id: '',
    title: '',
    message: ''
  });

  const [questions, setQuestions] =  useState([]);

  const columns = [
    {
      field: 'id',
      headerName: 'Id',
      maxWidth: 100,
      editable: false
    }, 
    {
      field: 'scenario_id',
      headerName: t('Scenario Id'),
      maxWidth: 100,
      editable: false
    }, 
    {
      field: 'type',
      headerName: t('Type'),
      maxWidth: 300,
      editable: false
    }, 
    {
      field: 'content',
      headerName: t('Content'),
      flex: 1,
      editable: false
    }, 
    {
      field: 'next_question_id',
      headerName: t('Next Question Id'),
      flex: 1,
      editable: false
    },
    {
      field: 'actions',
      headerName: '操作',
      minWidth: 100,
      renderCell: ( params ) => {
          return  <div>
            <RemoveRedEyeIcon onClick={()=>goEditPage(params.row.id)} style={{cursor: 'pointer', fontSize: '1.25rem', marginRight: '10px'}} />
            <DeleteIcon onClick={()=>questionDelete(params.row.id)} style={{cursor: 'pointer', fontSize: '1.25rem'}} />
          </div>
      },
    },
  ]

  useEffect(() => {
    getScenarios();
    getQuestions();
  }, [scenario])

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

  const handleScenarioChange = (event) => {
    setScenario({...scenario, [event.target.name]: event.target.value });
  }

  const getQuestions = async () => {
    dispatch(startAction())
    try {
      let res = [];
      if(scenario.scenario_id){
        res = await agent.common.getQuestionsById(scenario.scenario_id);
      } else {
        res = await agent.common.getQuestions();
      }
      if (res.data.success) {
        setQuestions(res.data.data);
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

  const questionDelete = async(id) => {
    dispatch(startAction())
    try {
      const res = await agent.common.deleteQuestion(id);
      if (res.data.success) {
        setQuestions(res.data.data);
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

  const goCreatePage = (id) => {
    if(id)
      navigate(`/question/create/${id}`);
    else
      dispatch(showToast('error', t('Please select scenario')));
  }

  const goEditPage = (id) => {
    navigate(`/question/edit/${id}`);
  }

  return (
    <>
      <div className="main-body">
        <div className="page-wrapper">
          <div className="row">
            <div className="col">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">{t('Question List')}</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div>
                        <FormControl fullWidth margin="normal">
                          <InputLabel id="demo-simple-select-label">{t('Please select scenario')}</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name="scenario_id"
                            label="scenario_id"
                            value={scenario.scenario_id}
                            onChange={handleScenarioChange}
                          >
                            {
                              scenarios.map((item, index )=> {
                                return (
                                  <MenuItem value={item.id} key={index}>{item.title}</MenuItem>
                                )
                              })
                            }
                          </Select>
                        </FormControl>
                      </div>
                      <div className="table_container">
                        {
                          <>
                            <Button color="primary" startIcon={<AddIcon />} onClick={() => goCreatePage(scenario.scenario_id)}>新規追加</Button>
                            <DataTable 
                              data={questions}
                              columns={columns}
                            />
                          </>
                        }
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

export default Question