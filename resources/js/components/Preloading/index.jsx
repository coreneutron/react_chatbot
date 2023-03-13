import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { TailSpin } from 'react-loader-spinner'


import {
  startAction,
  endAction,
  showToast,
} from '../../actions/common'

let startTime
let endTime
let commonState = false;
const Preloading = () => {

  const dispatch = useDispatch()

  const common = useSelector(state => state.common);

  useEffect(() => {
    
    if(common.loading && !commonState) {
      startTime = performance.now()
      commonState = true
    }

    if(!common.loading && commonState) {
      commonState = false
    }


  }, [common.loading])

  useEffect(() => {
    if(commonState) {
      endTime = performance.now()
      if(endTime - startTime > 5000) {
        dispatch(endAction())
        commonState = false
      }
    }
  })
  
  return (
    <>
      { common.loading && 
        <div style={{ position: 'absolute', top: '0px', left: '0px', width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.5)', pointerEvents: 'all', zIndex: '10000' }}>
          <div style={{
            width: '100px',
            height: '100px',
            position: 'fixed',
            top: 'calc(50% - 50px)',
            left: 'calc(50% - 50px)',
            opacity: 1
          }}>
            <TailSpin color={'#1DD1D6'} height={100} width={100} />
          </div>
        </div>
      }
    </>
  )
}

export default Preloading