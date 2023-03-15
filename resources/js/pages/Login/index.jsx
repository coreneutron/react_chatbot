import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

import '../../../css/style.scss';
import { useWindowSize } from "../../utils/Helper";
import { useLaravelReactI18n } from 'laravel-react-i18n'

import agent from '../../api/'

import {
  startAction,
  endAction,
  showToast,
} from '../../actions/common'

import {
  login
} from '../../actions/auth'

const Login = () => {
  const { t, tChoice } = useLaravelReactI18n();
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [displayState, setDisplayState] = useState('login')
  const [loginData, setLoginData] = useState({email: '', password: ''})
  const [signupData, setSignupData] = useState({name: '', email: '', password: '', password_confirmation: ''})

  const submitLogin = async () => {
      dispatch(startAction())
      try {
        let res = await agent.auth.login(loginData.email, loginData.password)
        dispatch(endAction())
        if (res.data.success) {
          localStorage.setItem('token', res.data.token)
          dispatch(showToast('success', t(res.data.message)))
          dispatch(login(res.data.user))
          navigate("/users")
        }
      } catch (error) {
        if (error.response != undefined) {
          if (error.response.status >= 400 && error.response.status <= 500) {
            dispatch(endAction())
            dispatch(showToast('error', t(error.response.data.message)))
          }
        }
      }
  }

  const submitRegister = async () => {
      dispatch(startAction())
      try {
        let res = await agent.auth.register(signupData.name, signupData.email, signupData.password, signupData.password_confirmation)
        dispatch(endAction())
        if (res.data.success) {
          setDisplayState('login')
          dispatch(showToast('success', t(res.data.message)))
        }
      } catch (error) {
        if (error.response != undefined) {
          if (error.response.status >= 400 && error.response.status <= 500) {
            dispatch(endAction())
            dispatch(showToast('error', t(error.response.data.message)))
          }
        }
      }
  }

  return (
    <>
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            {/* <span className="r"/>
            <span className="r s"/>
            <span className="r s"/>
            <span className="r"/> */}
          </div>
          {
            displayState === 'login' && 
              <div className="card">
                <div className="card-body text-center">
                  <div className="mb-4">
                    <i className="feather icon-unlock auth-icon"/>
                  </div>
                  <h3 className="mb-4">{ t('Login') }</h3>
                  <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder={ t('Email') } value={loginData.email} onChange={(e) => setLoginData((old) => {return({...old, email: e.target.value})})} onKeyPress={(e) => { if (e.keyCode === 13 || e.charCode === 13) submitLogin() }}/>
                  </div>
                  <div className="input-group mb-4">
                    <input type="password" className="form-control" placeholder={ t('Password') } value={loginData.password} onChange={(e) => setLoginData((old) => {return({...old, password: e.target.value})})} onKeyPress={(e) => { if (e.keyCode === 13 || e.charCode === 13) submitLogin() }}/>
                  </div>
                  <button className="btn btn-primary shadow-2 mb-4" onClick={() => submitLogin()}>{ t('Login') }</button>
                  {/* <p className="mb-2 text-muted">Forgot password? <NavLink to="/auth/reset-password-1">Reset</NavLink></p> */}
                  <p className="mb-0 text-muted"><a onClick={() => setDisplayState('signup')}>{ t('SignUp') }</a></p>
                </div>
              </div>
          }
          {
            displayState === 'signup' &&
              <div className="card">
                <div className="card-body text-center">
                  <div className="mb-4">
                    <i className="feather icon-user-plus auth-icon"/>
                  </div>
                  <h3 className="mb-4">{ t('SignUp') }</h3>
                  <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder={ t('Name') } onChange={(e) => setSignupData((old) => {return({...old, name: e.target.value})})} onKeyPress={(e) => { if (e.keyCode === 13 || e.charCode === 13) submitRegister() }}/>
                  </div>
                  <div className="input-group mb-3">
                    <input type="email" className="form-control" placeholder={ t('Email') } onChange={(e) => setSignupData((old) => {return({...old, email: e.target.value})})} onKeyPress={(e) => { if (e.keyCode === 13 || e.charCode === 13) submitRegister() }}/>
                  </div>
                  <div className="input-group mb-4">
                    <input type="password" className="form-control" placeholder={ t('Password') } onChange={(e) => setSignupData((old) => {return({...old, password: e.target.value})})} onKeyPress={(e) => { if (e.keyCode === 13 || e.charCode === 13) submitRegister() }}/>
                  </div>
                  <div className="input-group mb-4">
                    <input type="password" className="form-control" placeholder={ t('Confirm Password') } onChange={(e) => setSignupData((old) => {return({...old, password_confirmation: e.target.value})})} onKeyPress={(e) => { if (e.keyCode === 13 || e.charCode === 13) submitRegister() }}/>
                  </div>
                  <button className="btn btn-primary shadow-2 mb-4" onClick={() => submitRegister()}>{ t('SignUp') }</button>
                  <p className="mb-0 text-muted">{ t('Already have an account') }&nbsp;&nbsp;<a onClick={() => setDisplayState('login')}>{ t('Login') }</a></p>
                </div>
              </div>
          }
        </div>
      </div>
    </>
  )
}

export default Login
