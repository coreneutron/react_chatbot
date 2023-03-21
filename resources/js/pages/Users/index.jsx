import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

import { Button, FormControl, Input, MenuItem, Select }  from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { startAction, endAction, showToast } from '../../actions/common'
import { GridActionsCellItem } from '@mui/x-data-grid';
import agent from '../../api/'
import { logout } from "../../actions/auth";

import { useLaravelReactI18n } from 'laravel-react-i18n'

import DataTable from "../../components/DataTable";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import {BsExclamationCircle} from "react-icons/bs"
import './Users.scss';

const Users = () => {
  const { t, tChoice } = useLaravelReactI18n();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [page, setPage] = useState('list');
  const [users, setUsers] = useState([]);
  const [cardTitle, setCardTitle] = useState(t('User List'));
  const [signupData, setSignupData] = useState({name: '', email: '', password: '', password_confirmation: ''})
  const [editData, setEditData] = useState({id:'', name: '', email: '', password: '', password_confirmation: ''})

  useEffect(() => {
    getUsers()
  }, [])

  const userColumns = [
    {
      field: 'id',
      headerName: 'ID',
      maxWidth: 100,
      editable: false
    }, 
    {
      field: 'name',
      headerName: t('User Name'),
      editable: false,
      flex: 1,
      renderCell: (params) => {
        return params.row.name;
      },
    }, 
    {
      field: 'email',
      headerName: t('Email'),
      editable: false,
      flex: 1,
    }, 
    {
      field: 'role',
      headerName: t('Role'),
      editable: false,
      flex: 1,
      valueFormatter: (params) => {
        if (params.value == null) {
          return '';
        }

        const valueFormatted = params.value == 1 ? '管理者' : 'ユーザー';
        return valueFormatted;
      },
    }, 
    {
      field: 'disabled',
      headerName: t('Status'),
      flex: 1,
      renderCell: (params) => {
        if(params.row.role != 1){
          if(params.row.disabled == 1) {
            return <a className="table_user_disable_edit_btn" onClick={() => updateAccountStatus(params.row.id, 0)}>{ t('Disabled') }</a>
          } else {
            return <a className="table_user_enable_edit_btn" onClick={() => updateAccountStatus(params.row.id, 1)}>{ t('Enabled') }</a>
          }
        } else return <div></div>;
      },
    },
    {
      field: 'actions',
      headerName: '操作',
      minWidth: 100,
      renderCell: ( params ) => {
        if(params.row.role != 1){
          return  <div>
            <RemoveRedEyeIcon onClick={()=>handleUserEdit(params.row)} style={{cursor: 'pointer', fontSize: '1.25rem', marginRight: '10px'}} />
            <DeleteIcon onClick={()=>handleDeleteClick(params.row.id)} style={{cursor: 'pointer', fontSize: '1.25rem'}} />
          </div>
        } 
        else 
          return <div key={params.row.id}></div>;
      },
    },
  ]
  
  async function getUsers() {
    dispatch(startAction())
    try {
      const resUsers = await agent.common.getUsers();
      if (resUsers.data.success) {
        setUsers([...resUsers.data.data]);
      }
      dispatch(endAction());
    } catch (error) {
      if (error.response.status >= 400 && error.response.status <= 500) {
        dispatch(endAction());
        dispatch(showToast('error', error.response.data.message));
        if (error.response.data.message == 'Unauthorized') {
          localStorage.removeItem('token');
          dispatch(logout());
          navigate('/login');
        }
      }
    }
  }

  const updateAccountStatus = async(user_id, disabled) => {
    dispatch(startAction());
		const res = await agent.common.updateAccountStatus(
      user_id, 
      disabled
    );
		if (res.data.success) {
      dispatch(showToast('success', res.data.message));
      getUsers();
      setPage('list');
    } else dispatch(showToast('error', res.data.message));
		dispatch(endAction());
  }

  const createUser = () => {
    setPage('add');
    setCardTitle(t('User Create'));
  }

  const submitRegister = async () => {
    if(signupData.name == '' || signupData.email == '' || signupData.password == '' || signupData.password_confirmation ==''){
      dispatch(showToast('error', t('All values must be entered!')));
      return ;
    }
    if(signupData.password != signupData.password_confirmation){
      dispatch(showToast('error', t('Password mismatch')));
      return ;
    } else if(signupData.password.length < 6) {
      dispatch(showToast('error', t('Password length greather than 6')));
      return ;
    }
    dispatch(startAction());
      try {
        let res = await agent.auth.register(signupData.name, signupData.email, signupData.password, signupData.password_confirmation)
        dispatch(endAction())
        if (res.data.success) {
          setPage('list');
          setCardTitle(t('User List'));
          getUsers();
          dispatch(showToast('success', res.data.message));
        }
      } catch (error) {
        if (error.response != undefined) {
          if (error.response.status >= 400 && error.response.status <= 415) {
            dispatch(endAction());
            dispatch(showToast('error', error.response.data.message));
          }
        }
      }
  } 

  const clickBackBtn = () => {
    setPage('list');
    setCardTitle(t('User List'));
  }

  const handleUserEdit = (data) => {
    setEditData({ id: data.id, name:data.name, email: data.email });
    setPage('edit');
    setCardTitle(t('User Detail'));
  }

  const submitUpdate = async () => {
    if(editData.name == '' || editData.email == '' || editData.password == '' || editData.password_confirmation == ''){
      dispatch(showToast('error', t('All values must be entered!')));
      return ;
    }
    if(editData.password && editData.password != editData.password_confirmation){
      dispatch(showToast('error', t('Password mismatch')));
      return ;
    } else if(editData.password && editData.password.length < 6) {
      dispatch(showToast('error', t('Password length greather than 6')));
      return ;
    }
    dispatch(startAction())
    try {
      const res = await agent.common.updateUser(editData.id, editData);
      if (res.data.success) {
        getUsers();
        dispatch(showToast('success', t('Successfully updated!')));
      }
      dispatch(endAction())
    } catch (error) {
      if (error.response.status >= 400 && error.response.status <= 500) {
        dispatch(endAction());
        dispatch(showToast('error', error.response.data.message));
        if (error.response.data.message == 'Unauthorized') {
          localStorage.removeItem('token');
          dispatch(logout());
          navigate('/login');
        }
      }
    }
  }
  
  const handleDeleteClick= (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom_alert'>
            <h1><BsExclamationCircle /></h1>
            <p>本当に削除しますか？</p>
            <div className="btn_group">
              <button type="button" className="btn btn-secondary" onClick={onClose}>いいえ</button>
              <button type="button" className="btn btn-success" onClick={() => {onClose(); handleUserDelete(id);}}>はい</button>
            </div>
          </div>
        );
      }
    });
  }

  const handleUserDelete = async(id) => {
    dispatch(startAction())
    try {
      const res = await agent.common.deleteUser(id);
      if (res.data.success) {
        getUsers();
        dispatch(showToast('success', t('Successfully deleted!')));
      }
      dispatch(endAction());
    } catch (error) {
      if (error.response.status >= 400 && error.response.status <= 500) {
        dispatch(endAction());
        dispatch(showToast('error', error.response.data.message));
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
              {
                page == 'list' &&
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title">{cardTitle}</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="table_container">
                            <DataTable 
                              data={users}
                              columns={userColumns}
                            />
                            <Button color="primary" startIcon={<AddIcon />} onClick={() => createUser()}>新規追加</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              }
              {
                page == 'add' &&
                  <>
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title">{cardTitle}</h5>
                    </div>
                    <div className="card-body text-center">
                      <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder={ t('Name') } onChange={(e) => setSignupData((old) => {return({...old, name: e.target.value})})} />
                      </div>
                      <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder={ t('Login ID') } onChange={(e) => setSignupData((old) => {return({...old, email: e.target.value})})} />
                      </div>
                      <div className="input-group mb-4">
                        <input type="password" className="form-control" placeholder={ t('Password') } onChange={(e) => setSignupData((old) => {return({...old, password: e.target.value})})} />
                      </div>
                      <div className="input-group mb-4">
                        <input type="password" className="form-control" placeholder={ t('Password Confirmation') } onChange={(e) => setSignupData((old) => {return({...old, password_confirmation: e.target.value})})} />
                      </div>
                      <Button variant="outlined" onClick={() => submitRegister()}>{ t('User Register') }</Button>
                    </div>
                    <div>
                      <Button color="primary" startIcon={<ArrowBackIcon />} onClick={() => clickBackBtn()}>
                        { t('Back') }
                      </Button>
                    </div>
                  </div>
                  </>
              }
              {
                page == 'edit' &&
                  <>
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">{cardTitle}</h5>
                      </div>
                      <div className="card-body text-center">
                        <div className="input-group mb-3">
                          <input type="text" className="form-control" placeholder={ t('Name') } value={editData.name} onChange={(e) => setEditData((old) => {return({...old, name: e.target.value})})} />
                        </div>
                        <div className="input-group mb-3">
                          <input type="text" className="form-control" placeholder={ t('Login ID') } value={editData.email} onChange={(e) => setEditData((old) => {return({...old, email: e.target.value})})} />
                        </div>
                        <div className="input-group mb-4">
                          <input type="password" className="form-control" placeholder={ t('Password') } value={editData.password} onChange={(e) => setEditData((old) => {return({...old, password: e.target.value})})} />
                        </div>
                        <div className="input-group mb-4">
                          <input type="password" className="form-control" placeholder={ t('Password Confirmation') } value={editData.password_confirmation} onChange={(e) => setEditData((old) => {return({...old, password_confirmation: e.target.value})})} />
                        </div>
                        <Button variant="outlined" onClick={() => submitUpdate()}>{ t('User Update') }</Button>
                      </div>
                      <div>
                        <Button color="primary" startIcon={<ArrowBackIcon />} onClick={() => clickBackBtn()}>{ t('Back') }</Button>
                      </div>
                    </div>
                  </>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Users