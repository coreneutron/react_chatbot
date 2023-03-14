import {
  AUTH_LOGIN,
  AUTH_LOGOUT,
} from '../constants/actionTypes/auth'

const INITIAL_STATE = {
  currentUser: {
    id: 0,
    name: '',
    uid: '',
    email: '',
    phone: '',
    role: '',
    token: ''
  }
}

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTH_LOGIN:
      return {
        ...state,
        currentUser: {
          id: action.user.id,
          name: action.user.name,
          uid: action.user.uid,
          email: action.user.email,
          phone: action.user.phone,
          role: action.user.role,
          token: action.user.token,
        }
      }
    case AUTH_LOGOUT:
      return {
        ...state,
        currentUser: {
          id: 0,
          name: '',
          uid: '',
          email: '',
          phone: '',
          role: '',
          token: ''
        }
      }
    default:
      return state
  }
}

export default reducer