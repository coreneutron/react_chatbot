import React, { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom'
import { renderToString } from "react-dom/server";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

import { Table } from 'smart-webcomponents-react/table';
import { CheckBox } from 'smart-webcomponents-react/checkbox';
import { Smart, Form, FormGroup, FormControl } from 'smart-webcomponents-react/form';
import { DropDownList, ListItem } from 'smart-webcomponents-react/dropdownlist';
import { NumberInput } from 'smart-webcomponents-react/numberinput';
import { Input } from 'smart-webcomponents-react/input';
import { RadioButton } from 'smart-webcomponents-react/radiobutton';
import { Button } from  'smart-webcomponents-react/button';
import { DateInput } from 'smart-webcomponents-react/dateinput';

import SimpleReactValidator from 'simple-react-validator';

import { FaYenSign } from "react-icons/fa"
import { IoMdRemoveCircle, IoMdAddCircle } from "react-icons/io"

import FilterSelect from "../FilterSelect"
import './CreatePayment.scss'

import {
  startAction,
  endAction,
  showToast
} from '../../actions/common'
import { logout } from "../../actions/auth";
import agent from '../../api/'

const CreatePayment = (props) => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [articles, setArticles] = useState([])
  const [companies, setCompanies] = useState([])
  const [constructions, setConstructions] = useState([])
  const [addPayment, setAddPayment] = useState({
    pay_date: '',
    article: {
      value: props.paymentArticle.id,
      label: props.paymentArticle.name
    },
    construction: {
      value: 0,
      label: ''
    },
    company: {
      value: 0,
      label: ''
    },
    cost: 0,
    is_cash: 0
  })

  useEffect(() => {
    getAutoData()
  }, [])

  const getAutoData = async() => {
    try {
      const resAutoConstruction = await agent.common.getAutoConstruction()
      const resAutoArticle = await agent.common.getAutoArticle()
      const resAutoCompany = await agent.common.getAutoCompany()

      if(resAutoConstruction.data.success) {
        let constructionOptions = []
        resAutoConstruction.data.data.map((item) => {
          constructionOptions.push({
            value: item.id,
            label: item.name
          })
        })
        setConstructions([...constructionOptions])
        setAddPayment({...addPayment, construction: {...constructionOptions[0]}})
      }
      if(resAutoArticle.data.success) {
        let articleOptions = []
        resAutoArticle.data.data.map((item) => {
          articleOptions.push({
            value: item.id,
            label: item.name
          })
        })
        setArticles([...articleOptions])
        // setAddPayment({...addPayment, article: {...articleOptions[0]}})
      }
      if(resAutoCompany.data.success) {
        let companyOptions = []
        resAutoCompany.data.data.map((item) => {
          companyOptions.push({
            value: item.id,
            label: item.name
          })
        })
        setCompanies([...companyOptions])
        setAddPayment({...addPayment, company: {...companyOptions[0]}})
      }
    } catch (error) {
      if (error.response.status >= 400 && error.response.status <= 500) {
        dispatch(showToast('error', error.response.data.message))
        if (error.response.data.message == 'Unauthorized') {
          localStorage.removeItem('token')
          dispatch(logout())
          navigate('/login')
        }
      }
    }
  }

  const clickSaveBtn = async() => {
    dispatch(startAction())
    const res = await agent.common.addPayment(addPayment.pay_date, Number(addPayment.article.value), Number(addPayment.company.value), Number(addPayment.construction.value), Number(addPayment.cost), Number(addPayment.is_cash))
    if (res.data.success) {
      dispatch(showToast('success', res.data.message))
      props.setPage('list')
    }
    else dispatch(showToast('error', res.data.message))
    dispatch(endAction())
  }

  const clickContinueSaveBtn = async() => {
    dispatch(startAction())
    const res = await agent.common.addPayment(addPayment.pay_date, Number(addPayment.article.value), Number(addPayment.company.value), Number(addPayment.construction.value), Number(addPayment.cost), Number(addPayment.is_cash))
    if (res.data.success) {
      dispatch(showToast('success', res.data.message))
      setAddPayment({
        pay_date: dateFormatting(new Date()), 
        article: {
          value: props.paymentArticle.id,
          label: props.paymentArticle.name
        },
        construction: {
          ...constructions[0]
        },
        company: {
          ...companies[0]
        },
        cost: 0,
        is_cash: 0
      })
    }
    else dispatch(showToast('error', res.data.message))
    dispatch(endAction())
  }

  const dateFormatting = (date) => {
    var m = new Date(date);
    var dateString = m.getFullYear() +"-"+ (m.getMonth()+1) +"-"+ m.getDate()
    return dateString
  }

  const monthDateFormatting = (date) => {
    var m = new Date(date);
    var dateString = m.getFullYear() +"-"+ (m.getMonth()+1)
    return dateString
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title">basic information</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <div className="row">
                <div className="col-md-3 inline_label">
                  <label className="form-label">object name</label>
                </div>
                <div className="col-md-6">
                  <FilterSelect 
                    options={articles} 
                    value={addPayment.article}
                    onChange={(val) => {
                      setAddPayment({...addPayment, article: {...val}})
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-md-3 inline_label">
                  <label className="form-label">Date</label>
                </div>
                <div className="col-md-6">
                  <DateInput className="custom_date_input" formatString="yyyy-MM-dd" placeholder="please select ... " value={addPayment.pay_date} onChange={(e) => setAddPayment({...addPayment, pay_date: dateFormatting(e.detail.value)})}/>
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-md-3 inline_label">
                  <label className="form-label">Company</label>
                </div>
                <div className="col-md-6">
                  <FilterSelect 
                    options={companies} 
                    value={addPayment.company}
                    onChange={(val) => {
                      setAddPayment({...addPayment, company: {...val}})
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-md-3 inline_label">
                  <label className="form-label">Construction</label>
                </div>
                <div className="col-md-6">
                  <FilterSelect 
                    options={constructions} 
                    value={addPayment.construction}
                    onChange={(val) => {
                      setAddPayment({...addPayment, construction: {...val}})
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-md-3 inline_label">
                  <label className="form-label">Cost</label>
                </div>
                <div className="col-md-6">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text"><FaYenSign /></span>
                    </div>
                    <input className="form-control" type="text" value={addPayment.cost} onChange={(e) => setAddPayment({...addPayment, cost: e.target.value})}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-md-3 inline_label">
                  <label className="form-label">Cash Payment</label>
                </div>
                <div className="col-md-6">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" checked={addPayment.is_cash} onChange={(e) =>  setAddPayment({...addPayment, is_cash: e.target.checked ? 1 : 0})}/>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="action_btn_group">
              <button type="button" className="btn btn-secondary" onClick={() => props.clickCancelBtn()}>Cancel</button>
              <div>
                <button type="button" className="btn btn-primary continue_btn" onClick={() => clickContinueSaveBtn()}>Continue to Register</button>
                <button type="button" className="btn btn-primary" onClick={() => clickSaveBtn()}>Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePayment