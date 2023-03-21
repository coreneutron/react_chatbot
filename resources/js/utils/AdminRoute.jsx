import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import agent from '../api'

import { login, logout } from '../actions/auth'

const AdmindRoute = props => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const auth = useSelector(state => state.auth)

  useEffect(() => {
    async function getAuthInfo() {
      if (!auth.currentUser.email) {
        try {
          const res = await agent.auth.me()
          if (res.data.email) dispatch(login(res.data))
        } catch (error) {
          if (error === 'Error: Network Error') {
            window.location.reload();
          }
          if (error.response != undefined && error.response.status >= 400 && error.response.status <= 500) {
            localStorage.removeItem('token')
            navigate('/login')
          }
        }
      }
    }
    getAuthInfo()
  }, [])

  if (auth.currentUser.role == 1) {
    return <React.Fragment>{props.children}</React.Fragment>
  } else {
    navigate('/users')
  }
  if (!localStorage.getItem('token')) {
    navigate('/login')
  }
  return <></>
}

export default AdmindRoute