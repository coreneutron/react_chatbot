import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useProSidebar } from 'react-pro-sidebar';
import { BsKey } from "react-icons/bs";
import { SlLock, SlUser, SlLogout } from "react-icons/sl";
import { FiMaximize, FiMinimize, FiSettings, FiLogOut, FiUser } from "react-icons/fi";

import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';

import styles from './Header.module.scss';

import {
  startAction,
  endAction,
  showToast
} from '../../actions/common'
import {
  login,
  logout
} from '../../actions/auth'
import { useResize, checkMobileDevice } from "../../utils/Helper"
import agent from '../../api/'

import { useLaravelReactI18n } from 'laravel-react-i18n'

const Header = () => {
  const { t, tChoice } = useLaravelReactI18n();
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const auth = useSelector(state => state.auth)
  const { collapseSidebar, toggleSidebar, collapsed, toggled, broken, rtl } = useProSidebar()

  const [showUserBox, setShowUserBox] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  const  goInFullscreen = (el) => {
    if(el.requestFullscreen)
      el.requestFullscreen();
    else if(el.mozRequestFullScreen)
      el.mozRequestFullScreen();
    else if(el.webkitRequestFullscreen)
      el.webkitRequestFullscreen();
    else if(el.msRequestFullscreen)
      el.msRequestFullscreen();
  }

  const  goOutFullscreen = () => {
    if(document.exitFullscreen)
      document.exitFullscreen();
    else if(document.mozCancelFullScreen)
      document.mozCancelFullScreen();
    else if(document.webkitExitFullscreen)
      document.webkitExitFullscreen();
    else if(document.msExitFullscreen)
      document.msExitFullscreen();
  }

  const clickFullscreen = () => {
    if(fullscreen) {
      setFullscreen(false)
      goOutFullscreen()
    } else {
      setFullscreen(true)
      const rootElement = document.getElementById('root')
      goInFullscreen(rootElement)
    }
  }

  const submitLogout = async() => {
    dispatch(startAction())
		const res = await agent.auth.logout()
		if (res.data.success) {
      dispatch(showToast('success', t(res.data.message)))
      localStorage.removeItem('token')
      dispatch(logout())
      navigate("/login")
    } else dispatch(showToast('error', t(res.data.message)))
		dispatch(endAction())
  }

  return (
    <header style={{marginLeft: 0, width: '100%', background: '#ededed'}} className="navbar pcoded-header navbar-expand-lg header-default">
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li>
            {
              fullscreen ?
                <a className="full-screen" onClick={() => clickFullscreen()}><FiMinimize/></a>
                :
                <a className="full-screen" onClick={() => clickFullscreen()}><FiMaximize/></a>
            }
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          {/* <Badge badgeContent={4} color="primary">
            <MailIcon color="action" />
          </Badge> */}
          <li>
            <div className="drp-user dropdown">
              <button onClick={() => setShowUserBox((old) => !old)} aria-haspopup="true" aria-expanded="true" id="dropdown-basic" type="button" className="dropdown-toggle btn btn-link" style={{paddingRight: '5px'}}><FiSettings/></button>
              {
                showUserBox &&
                  <div aria-labelledby='dropdown-basic' className='profile-notification dropdown-menu show dropdown-menu-right' x-placement='bottom-end' style={{position: 'absolute', willChange: 'transform', top: 0, left: 0, transform: 'translate3d(-249px, 70px, 0px)'}}>
                    <div className='pro-head'>
                      <span>{auth.currentUser.name}</span>
                      <a className="dud-logout" title="Logout" onClick={() => submitLogout()}><FiLogOut/></a>
                    </div>
                    <ul className="pro-body">
                      {/* <li><Link className='dropdown-item' to={'/profile'}><FiUser />&nbsp;&nbsp;&nbsp;&nbsp;Profile</Link></li> */}
                      <li><Link className='dropdown-item' to={'/changePassword'}><BsKey />&nbsp;&nbsp;&nbsp;&nbsp;{t('Change Password')}</Link></li>
                    </ul>
                  </div>
              }
            </div>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header