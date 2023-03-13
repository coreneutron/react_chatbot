import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

import SimpleReactValidator from 'simple-react-validator';
import { useLaravelReactI18n } from 'laravel-react-i18n'

import './ChangePassword.scss';

import {
  startAction,
  endAction,
  showToast
} from '../../actions/common'
import {
  login,
  logout
} from '../../actions/auth'
import agent from '../../api/'

const ChangePassword = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t, tChoice } = useLaravelReactI18n();

  const auth = useSelector(state => state.auth)

  const [password, setPassword] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const clickSaveSubmitBtn = async() => {
    if(password.newPassword != password.confirmPassword){
      dispatch(showToast('error', t('Password mismatch')))
    } else {
      dispatch(startAction())
      const res = await agent.common.changePassword(
        password.oldPassword,
        password.newPassword,
      )
      if (res.data.success) {
        dispatch(showToast('success', t(res.data.message)))
        setPassword({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else dispatch(showToast('error', t(res.data.message)))
      dispatch(endAction())
    }
  }

  return (
    <>
      <div className="main-body">
        <div className="page-wrapper">
          <div className="row">
            <div className="col">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">{ t('Change Password') }</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <div className="row">
                          <div className="col-md-4 inline_label">
                            <label className="form-label">{ t('Old Password') }</label>
                          </div>
                          <div className="col-md-6">
                            <input className="form-control" type="password" value={password.oldPassword} onChange={(e) => setPassword({...password, oldPassword: e.target.value})} />
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="row">
                          <div className="col-md-4 inline_label">
                            <label className="form-label">{ t('New Password') }</label>
                          </div>
                          <div className="col-md-6">
                            <input className="form-control" type="password" value={password.newPassword} onChange={(e) => setPassword({...password, newPassword: e.target.value})}/>
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="row">
                          <div className="col-md-4 inline_label">
                            <label className="form-label">{ t('Confirm Password') }</label>
                          </div>
                          <div className="col-md-6">
                            <input className="form-control" type="password"  value={password.confirmPassword} onChange={(e) => setPassword({...password, confirmPassword: e.target.value})}/>
                          </div>
                        </div>
                      </div>
                      <hr />
                      <div className="setting_action_btn_group">
                        <button type="button" className="btn btn-success" onClick={() => clickSaveSubmitBtn()}>{ t('Save') }</button>
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

export default ChangePassword