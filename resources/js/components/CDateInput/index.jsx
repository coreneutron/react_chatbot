import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { DateInput } from 'smart-webcomponents-react/dateinput';

import './CDateInput.scss'

const CDateInput = (props) => {

  return (
    <DateInput className="custom_date_input" />
  )
}

export default CDateInput