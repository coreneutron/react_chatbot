import React, { memo, useEffect, useRef, useState } from 'react';
import { FaOctopusDeploy } from 'react-icons/fa';
import Select from 'react-select';
import styled from 'styled-components';

import './FilterSelect.scss'

import { useMousePos, useWindowDimensions } from '../../utils/Helper';

const StyledSelect = styled(Select)`
  & > div[id^=react-select] {
    z-index: 101;
  }
`

const BottomStyledSelect = styled(Select)`
  & > div[id^=react-select] {
    z-index: 101;
    top: -316px;
  }
`

const FilterSelect = (props) => {

  const selectRef = useRef()
  const { posY } = useMousePos();
  const { height } = useWindowDimensions();

  const [position, setPosition] = useState('top')

  const focused = () => {
    if(height / 2 < posY) setPosition('bottom')
    else setPosition('top')
  }

  useEffect(() => {
  }, [props.value])

  return (
    <>
      {
        position == 'top' && 
          <div ref={selectRef} id={props.id}>
            <StyledSelect 
              options={props.options}
              value={props.value}
              // defaultValue={props.defaultValue}
              onChange={(val) => props.onChange(val)}
              // onFocus={() => focused()}
            />
          </div>
      }
      {
        position == 'bottom' &&
          <div id={props.id}>
            <BottomStyledSelect 
              options={props.constructions} 
              value={props.value} 
              styles={{ menu: (base) => ({ ...base, marginBottom: 0 }) }}
              onChange={(val) => props.onChange(val)}
              // menuIsOpen={false}
            />
          </div>
      }
    </>
  )
}

// Wrap component using the `pure` HOC from recompose
export default memo(FilterSelect);