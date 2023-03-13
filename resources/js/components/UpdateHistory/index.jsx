import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

import './UpdateHistory.scss'

import { useResize, useWindowDimensions } from "./../../utils/Helper"

const UpdateHistory = (props) => {

  const historyRef = useRef()
  const { width } = useWindowDimensions();

  const [mobile, setMobile] = useState(false)
  // const [historyWidth, setHistoryWidth] = useState(0)

  // const { isMobile } = useResize()

  useEffect(() => {
    if(historyRef.current.offsetWidth > 820) {
      setMobile(false)
    } else {
      setMobile(true)
    }
  }, [width])

  const dateFormatting = (date) => {
    var m = new Date(date);
    var dateString = m.getUTCFullYear() +"/"+ (m.getUTCMonth()+1) +"/"+ m.getUTCDate() + " " + m.getUTCHours() + ":" + m.getUTCMinutes() + ":" + m.getUTCSeconds();
    return dateString
  }

  return (
    <div className="update_history" ref={historyRef}>
      
        {
          mobile ? 
            <div className="history_container mobile">
              <ul>
                <li>
                  <p className="label">ID</p>
                  <p className="item">{props.id}</p>
                </li>
                <li>
                  <p className="label">Create User</p>
                  <p className="item user">{props.created_user_name}</p>
                </li>
                <li>
                  <p className="label">Update User</p>
                  <p className="item user">{props.updated_user_name}</p>
                </li>
                <li>
                  <p className="label">Create Date</p>
                  <p className="item">{dateFormatting(props.created_at)}</p>
                </li>
                <li>
                  <p className="label">Update Date</p>
                  <p className="item">{dateFormatting(props.updated_at)}</p>
                </li>
              </ul>
            </div>
            :
            <div className="history_container pc">
              <ul>
                <li>
                  <p className="label">ID</p>
                  <p className="item">{props.id}</p>
                </li>
                <li>
                  <p className="label">Create User</p>
                  <p className="item user">{props.created_user_name}</p>
                </li>
                <li>
                  <p className="label">Update User</p>
                  <p className="item user">{props.updated_user_name}</p>
                </li>
                <li>
                  <p className="label">Create Date</p>
                  <p className="item">{dateFormatting(props.created_at)}</p>
                </li>
                <li>
                  <p className="label">Update Date</p>
                  <p className="item">{dateFormatting(props.updated_at)}</p>
                </li>
              </ul>
            </div>
        }
    </div>
  )
}

export default UpdateHistory