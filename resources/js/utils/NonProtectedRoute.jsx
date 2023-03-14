import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

import agent from '../api'

import { login } from '../actions/auth'

const NonProtectedRoute = props => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [token, setToken] = useState(localStorage.getItem('token'))
  const auth = useSelector(state => state.auth)

  useEffect(() => {
    // localStorage.removeItem('token')
    async function getAuthInfo() {
      if (!auth.currentUser.email) {
        try {
          const res = await agent.auth.me()
          if (res.data.email) {
            dispatch(login(res.data))
            navigate("/users")
          }
        } catch (error) {
          if (error.response != undefined && error.response.status >= 400 && error.response.status <= 415) {
            localStorage.removeItem('token')
            setToken('')
          }
        }
      }
    }
    getAuthInfo()
  }, [])
  if (!token) {
    return <React.Fragment>{props.children}</React.Fragment>
  }
  return <></>
}

export default NonProtectedRoute