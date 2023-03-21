import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import agent from '../api'

import { login, logout } from '../actions/auth'

const ProtectedRoute = props => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const auth = useSelector(state => state.auth)

  useEffect(() => {
    // if (!loadLogin) {
    //   console.log("loadLogin false")
    //   dispatch(changePage('login'))
    // }
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

  if (auth.currentUser.email) {
    return <React.Fragment>{props.children}</React.Fragment>
  }
  if (!localStorage.getItem('token')) {
    navigate('/login')
  }
  return <></>
}

export default ProtectedRoute