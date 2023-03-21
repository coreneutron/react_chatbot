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
import './UpdatePayment.scss'

import {
  startAction,
  endAction,
  showToast
} from '../../actions/common'
import { logout } from "../../actions/auth";
import agent from '../../api'

const UpdatePayment = (props) => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [articles, setArticles] = useState([])
  const [companies, setCompanies] = useState([])
  const [constructions, setConstructions] = useState([])
  const [updatePayment, setUpdatePayment] = useState({
    pay_date: props.payment.pay_date, 
    article: {label: props.payment.article_name, value: props.payment.article_id},
    construction: {label: props.payment.construction_name, value: props.payment.construction_id},
    company: {label:props.payment.company_name, value:props.payment.company_id},
    cost: props.payment.cost,
    is_cash: props.payment.is_cash
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
        setUpdatePayment({...updatePayment, construction: {...constructionOptions[0]}})
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
        // setUpdatePayment({...updatePayment, article: {...articleOptions[0]}})
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
        setUpdatePayment({...updatePayment, company: {...companyOptions[0]}})
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
    const res = await agent.common.updatePayment(updatePayment.pay_date, Number(updatePayment.article.value), Number(updatePayment.construction.value), Number(updatePayment.company.value), Number(updatePayment.cost), Number(updatePayment.is_cash))
    if (res.data.success) {
      dispatch(showToast('success', res.data.message))
      props.setPage('list')
    }
    else dispatch(showToast('error', res.data.message))
    dispatch(endAction())
  }

  const dateFormatting = (date) => {
    var m = new Date(date);
    var dateString = m.getFullYear() +"-"+ (m.getMonth()+1) +"-"+ m.getDate()
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
                    value={updatePayment.article}
                    onChange={(val) => {
                      setUpdatePayment({...updatePayment, article: {...val}})
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
                  <DateInput className="custom_date_input" value={updatePayment.pay_date} onChange={(e) => setUpdatePayment({...updatePayment, pay_date: dateFormatting(e.detail.value)})}/>
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
                    value={updatePayment.company}
                    onChange={(val) => {
                      setUpdatePayment({...updatePayment, company: {...val}})
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
                    value={updatePayment.construction}
                    onChange={(val) => {
                      setUpdatePayment({...updatePayment, construction: {...val}})
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
                    <input className="form-control" type="text" value={updatePayment.cost} onChange={(e) => setUpdatePayment({...updatePayment, cost: e.target.value})}/>
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
                    <input type="checkbox" className="form-check-input" checked={updatePayment.is_cash} onChange={(e) =>  setUpdatePayment({...updatePayment, is_cash: e.target.checked ? 1 : 0})}/>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="action_btn_group">
              <button type="button" className="btn btn-secondary" onClick={() => props.clickCancelBtn()}>Cancel</button>
              <div>
                <button type="button" className="btn btn-primary" onClick={() => clickSaveBtn()}>Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdatePayment