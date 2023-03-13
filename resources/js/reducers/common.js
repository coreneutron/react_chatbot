import {
  START_ACTION,
  END_ACTION,
  SHOW_TOAST,
  HIDE_TOAST,
} from '../constants/actionTypes/common'

const INITIAL_STATE = {
  loading: false,
  showToast: false,
  msgType: '',
  msgContent: '',
}

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case START_ACTION:
      return {
        ...state,
        loading: true
      }
    case END_ACTION:
      return {
        ...state,
        loading: false
      }
    case SHOW_TOAST:
      return {
        ...state,
        showToast: true,
        msgType: action.msgType,
        msgContent: action.content
      }
    case HIDE_TOAST:
      return {
        ...state,
        showToast: false
      }
    default:
      return state
  }
}

export default reducer