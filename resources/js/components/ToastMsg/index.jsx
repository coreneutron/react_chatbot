import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'

// import { ToastContainer, Toast } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { hideToast } from '../../actions/common'

const ToastMsg = () => {
  const common = useSelector((state) => state.common)
  const dispatch = useDispatch()
  const {
    showToast,
    msgType,
    msgContent
  } = common

  const hide = () => {
    dispatch(hideToast())
  }

  useEffect(() => {
    if (showToast) {
      if (msgType == 'info')
        toast.info(msgContent, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      if (msgType == 'success')
        toast.success(msgContent, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      if (msgType == 'warning')
        toast.warning(msgContent, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      if (msgType == 'error')
        toast.error(msgContent, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
    }
    const intervalId = setInterval(() => {
      hide()
    }, 2000);

    return () => clearInterval(intervalId);
  }, [showToast])

  return <ToastContainer
    position="top-right"
    autoClose={2000}
    hideProgressBar={true}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
  />
}

export default ToastMsg