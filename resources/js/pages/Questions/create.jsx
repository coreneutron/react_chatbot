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

const QuestionCreate = () => {
  const { t, tChoice } = useLaravelReactI18n();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let { id } = useParams();
  
  const [question, setQuestion] = useState({
    scenario_id: '',
    next_question_id: '',
    option_id: '',
    type: 'text',
    content: '',
  });

  const [options, setOptions] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(()=>{
    setQuestion({...question, scenario_id: id});
  }, [id])

  useEffect(()=>{
    getQuestions();
  }, [])

  const getQuestions = async () => {
    dispatch(startAction())
    try {
      const res = await agent.common.getQuestions();
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

  const handleChange = (event) => {
    setQuestion({...question, [event.target.name]: event.target.value});
  }

  const goBack = () => {
    navigate('/questions');
  }
  
  const addOption = () => {
    if (options.length > 0 && options[options.length - 1].content === ''){
      dispatch(showToast('error', t('All values must be entered')))
      return;
    } else {
      setOptions([...options, { content: '', next_question_id: '' }])
    }
  }

  const handleOptionChange = (index, name, value) => {
    let tmp = [...options];
    tmp[index][name] = value;
    setOptions(tmp);
  }

  const questionCreate = async() => {
    dispatch(startAction())
    try {
      const res = await agent.common.createQuestion(question, options);
      if (res.data.success) {
        dispatch(showToast('success', t('Successfully created')))
        setQuestion({...question, next_question_id: '', option_id: '', type: 'text', content: ''});
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

  return (
    <>
      <div className="main-body">
        <div className="page-wrapper">
          <div className="row">
            <div className="col">
              <div className="card">
                <div className="card-header" style={{display:'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <h5 className="card-title">{t('Question Create')}</h5>
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
                        <InputLabel id="demo-simple-select-label">{t('Type')}</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          name="type"
                          label="type"
                          value={question.type}
                          onChange={handleChange}
                        >
                          <MenuItem value="text" key="text">text</MenuItem>
                          <MenuItem value="option" key="option">option</MenuItem>
                          <MenuItem value="input" key="input">input</MenuItem>
                        </Select>
                      </FormControl>
                      {
                        question.type === 'text' &&
                        <>
                          <FormControl fullWidth margin="normal">
                            <TextField id="outlined-basic" label={t('Content')} name="content"  multiline rows={5} value={question.content} onChange={handleChange} />
                          </FormControl>
                          <FormControl fullWidth margin="normal">
                            <InputLabel id="demo-simple-select-label">{t('Next Question Id')}</InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              name="next_question_id"
                              label="next_question_id"
                              value={question.next_question_id}
                              onChange={handleChange}
                            >
                              <MenuItem value='' key=''>None</MenuItem>
                              {
                                questions.map((item, index )=> {
                                  return (
                                    <MenuItem value={item.id} key={index}>{item.id}</MenuItem>
                                  )
                                })
                              }
                            </Select>
                          </FormControl>
                        </>
                      }
                      {
                        question.type === 'option' &&
                        <>
                          <div>
                            <Button color="primary" style={{marginTop: '10px'}} startIcon={<AddIcon />} onClick={()=>addOption()} >
                              Add Option
                            </Button>
                            <Divider />
                          </div>
                          {
                            options.map((item, index)=>(
                              <div style={{display: 'flex', justifyContent: 'space-between'}} key={index}>
                                <FormControl sx={{ minWidth: 500 }} margin="normal">
                                  <TextField id="outlined-basic" label={t('Content')} name="content" value={item.content} onChange={(e)=>handleOptionChange(index, e.target.name, e.target.value)} />
                                </FormControl>
                                <FormControl sx={{ minWidth: 250 }} margin="normal">
                                  <InputLabel id="demo-simple-select-label">{t('Next Question Id')}</InputLabel>
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    name="next_question_id"
                                    label="next_question_id"
                                    value={item.next_question_id}
                                    onChange={(event)=>handleOptionChange(index, event.target.name, event.target.value)}
                                  >
                                    <MenuItem value='' key=''>None</MenuItem>
                                    {
                                      questions.map((item, index )=> {
                                        return (
                                          <MenuItem value={item.id} key={index}>{item.id}</MenuItem>
                                        )
                                      })
                                    }
                                  </Select>
                                </FormControl>
                              </div>
                            ))
                          }
                           <Divider />
                        </>
                      }
                      {
                        question.type === 'input' &&
                        <>
                          <FormControl fullWidth margin="normal">
                            <TextField id="outlined-basic" label={t('Content')} name="content"  multiline rows={5} value={question.content} onChange={handleChange} />
                          </FormControl>
                          <FormControl fullWidth margin="normal">
                            <InputLabel id="demo-simple-select-label">{t('Next Question Id')}</InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              name="next_question_id"
                              label="next_question_id"
                              value={question.next_question_id}
                              onChange={handleChange}
                            >
                              <MenuItem value='' key=''>None</MenuItem>
                              {
                                questions.map((item, index )=> {
                                  return (
                                    <MenuItem value={item.id} key={index}>{item.id}</MenuItem>
                                  )
                                })
                              }
                            </Select>
                          </FormControl>
                        </>
                      }
                    </div>
                  </div>
                  <div className="text-center" style={{marginTop: '10px'}}>
                    <Button variant="outlined" onClick={() => questionCreate()}>{t('Create')}</Button>
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

export default QuestionCreate