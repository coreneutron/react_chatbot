import axios from 'axios'

import { API_URL } from '../constants/'

const authHeader = {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
}

const authApi = {
  login: (email, password) => axios.post(`${API_URL}/login`, {
    email,
    password
  }),

  register: (name, email, password, password_confirmation) => axios.post(`${API_URL}/register`, {
    name,
    email,
    password,
    password_confirmation
  }),

  me: () => axios.get(`${API_URL}/user`, authHeader),

  logout: () =>
    axios.get(`${API_URL}/logout`, {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
    }),
}

export default authApi