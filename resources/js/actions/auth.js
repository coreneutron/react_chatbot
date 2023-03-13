import {
  AUTH_LOGIN,
  AUTH_LOGOUT,
} from '../constants/actionTypes/auth'

export const login = user => ({ type: AUTH_LOGIN, user })

export const logout = () => ({ type: AUTH_LOGOUT })