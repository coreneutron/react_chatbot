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
import Select from 'react-select';

import { FaYenSign } from "react-icons/fa"
import { IoMdRemoveCircle, IoMdAddCircle } from "react-icons/io"

import CreatePayment from '../../components/CreatePayment'
import UpdateHistory from "../../components/UpdateHistory";
import FilterSelect from "../../components/FilterSelect";

import {useWindowDimensions} from '../../utils/Helper'

import './UpdateArticle.scss';

import {
  startAction,
  endAction,
  showToast
} from '../../actions/common'
import { logout } from "../../actions/auth";
import agent from '../../api/'

let edit_construction_data = {}

const UpdateArticle = (props) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const budgetEditTable = useRef()

  const { width } = useWindowDimensions()

  const [constructions, setConstructions] = useState([])
  const [article, setArticle] = useState({})
  const [budgets, setBudgets] = useState([])
  const [addBudget, setAddBudget] = useState({})

  const [loadBudgetTable, setLoadBudgetTable] = useState(false)

  const budgetColumns = [
    {
      label: 'Construction',
      dataField: 'construction_name',
      dataType: 'string',
      editor: {
			  template: renderToString(<div id="edit_budget_construction_container"></div>),
        onInit(row, column, editor, value) {
          edit_construction_data = {value: budgets[row].construction_id, label: budgets[row].construction_name}
          ReactDOM.render(
            <FilterSelect 
              id="edit_construction_input"
              options={constructions} 
              defaultValue={edit_construction_data}
              onChange={(val) => {
                edit_construction_data = {value: val.value, label:val.label}
              }}
            />, editor
          )
        }
      }
    }, {
      label: 'Budget',
      dataField: 'cost',
      dataType: 'number',
      formatFunction(settings) {
        settings.template = renderToString(<div data-field="cost" data-id={settings.data.id}>{settings.value.toLocaleString("en-US")}</div>)
      }
    }, {
      label: 'Contract Amount',
      dataField: 'contract_amount',
      dataType: 'number',
      formatFunction(settings) {
        settings.template = renderToString(<div data-field="contract_amount" data-id={settings.data.id}>{settings.value.toLocaleString("en-US")}</div>)
      }
    }, {
      label: 'Change Amount',
      dataField: 'change_amount',
      dataType: 'number',
      formatFunction(settings) {
        settings.template = renderToString(<div data-field="change_amount" data-id={settings.data.id}>{settings.value.toLocaleString("en-US")}</div>)
      }
    }, {
      label: 'Delete',
      dataField: '',
      width: 100,
      allowSort: false,
      allowEdit: false,
      allowMenu: false,
      formatFunction(settings) {
        settings.template = renderToString(<a className="table_budget_delete_btn" data-id={settings.data.id}><IoMdRemoveCircle /></a>);
      }
    }
  ];

  const budgetData = new Smart.DataAdapter({
		dataSource: budgets,
		dataFields: [
      'id: number',
      'construction_id: number',
			'construction_name: string',
			'cost: number',
			'contract_amount: number',
      'change_amount: number'
		]
	});

  useEffect(() => {
    getArticleData()
    getConstructionOptions()
  }, [])

  useEffect(() => {
    if(loadBudgetTable) {
      const construction_add_th_width = document.querySelector(`#construction_add_th`).offsetWidth
      const cost_add_th_width = document.querySelector(`#cost_add_th`).offsetWidth
      const contract_add_th_width = document.querySelector(`#contract_add_th`).offsetWidth
      const change_add_th_width = document.querySelector(`#change_add_th`).offsetWidth
      const budget_add_submit_btn_width = document.querySelector(`#budget_add_submit_btn`).offsetWidth
      document.querySelector(`#add_construction_input`).style = 'width: ' + (construction_add_th_width - 24) +'px'
      document.querySelector(`#add_cost_input`).style = 'width: ' + (cost_add_th_width - 24) + 'px;' + 'left: ' + construction_add_th_width + 'px'
      document.querySelector(`#add_contract_input`).style = 'width: ' + (contract_add_th_width - 24) + 'px;' + 'left: ' + (construction_add_th_width + cost_add_th_width) + 'px'
      document.querySelector(`#add_change_input`).style = 'width: ' + (change_add_th_width - 24) + 'px;' + 'left: ' + (construction_add_th_width + cost_add_th_width + contract_add_th_width) + 'px'
      document.querySelector(`#add_submit_btn`).style = 'width: ' + (budget_add_submit_btn_width - 24) + 'px;' + 'left: ' + (construction_add_th_width + cost_add_th_width + contract_add_th_width + change_add_th_width) + 'px'
    }
  }, [width, loadBudgetTable])

  useEffect(() => {
    budgetEditTableInit()
  }, [budgets])

  const getArticleData = async() => {
    dispatch(startAction())
    try {
      const resArticle = await agent.common.getArticleById(props.article_id)
      if (resArticle.data.success) {
        setArticle({
          id: resArticle.data.id, 
          name: resArticle.data.name, 
          contract_amount: resArticle.contract_amount,
          is_house: resArticle.data.is_house,
          ended: resArticle.data.ended,
          created_user_id: resArticle.data.created_user_id,
          created_user_name: resArticle.data.created_user_name,
          created_at: resArticle.data.created_at,
          updated_user_id: resArticle.data.updated_user_id,
          updated_user_name: resArticle.data.updated_user_name,
          updated_at: resArticle.data.updated_at
        })
        setBudgets([...resArticle.data.budget])
      }
      dispatch(endAction())
    } catch (error) {
      if (error.response.status >= 400 && error.response.status <= 500) {
        dispatch(endAction())
        dispatch(showToast('error', error.response.data.message))
        if (error.response.data.message == 'Unauthorized') {
          localStorage.removeItem('token')
          dispatch(logout())
          navigate('/login')
        }
      }
    }
  }

  const getConstructionOptions = async() => {
    dispatch(startAction())
    try {
      const resAutoConstruction = await agent.common.getAutoConstruction()

      if(resAutoConstruction.data.success) {
        let constructionOptions = []
        resAutoConstruction.data.data.map((item) => {
          constructionOptions.push({
            value: item.id,
            label: item.name
          })
        })
        setConstructions([...constructionOptions])
      }
      dispatch(endAction())
    } catch (error) {
      if (error.response.status >= 400 && error.response.status <= 500) {
        dispatch(endAction())
        dispatch(showToast('error', error.response.data.message))
        if (error.response.data.message == 'Unauthorized') {
          localStorage.removeItem('token')
          dispatch(logout())
          navigate('/login')
        }
      }
    }
  }

  const clickSaveSubmitBtn = async() => {
    dispatch(startAction())
		const res = await agent.common.article(article.id, article.name, article.contract_amount, article.is_house, article.ended)
		if (res.data.success) {
      dispatch(showToast('success', res.data.message))
      props.clickSaveBtn()
    }
		else dispatch(showToast('error', res.data.message))
		dispatch(endAction())
  }

  const handleBudgetTableClick = (event) => {
    const delete_btn = event.target.closest('.table_budget_delete_btn')
    if(delete_btn) {
      deleteBudget(delete_btn.getAttribute('data-id'))
    }
  }

  const budgetEditTableInit = () => {
    const footerTemplate = document.createElement('template'),
			headerTemplate = document.createElement('template');
    footerTemplate.id = 'budgetFooter';
		headerTemplate.id = 'budgetHeader';
    footerTemplate.innerHTML = renderToString(
			<tr>
				<td>Total</td>
				<td id="totalBudget"></td>
        <td id="totalContract"></td>
        <td id="totalChange"></td>
        <td></td>
			</tr>
    )

		headerTemplate.innerHTML = renderToString(
      <tr>
				<th id="construction_add_th"></th>
				<th id="cost_add_th"></th>
				<th id="contract_add_th"></th>
				<th id="change_add_th"></th>
				<th id="budget_add_submit_btn"></th>
			</tr>
    )

    document.body.appendChild(footerTemplate);
		document.body.appendChild(headerTemplate);

		budgetEditTable.current.footerRow = footerTemplate.id;
		budgetEditTable.current.headerRow = headerTemplate.id;

    let total_cost = 0
    let total_contract_amount = 0
    let total_change_amount = 0
    budgets.map((budget) => {
      total_cost += budget.cost
      total_contract_amount += budget.contract_amount
      total_change_amount += budget.change_amount
    })

    document.querySelector(`#totalBudget`).innerHTML = total_cost.toLocaleString("en-US")
    document.querySelector(`#totalContract`).innerHTML = total_contract_amount.toLocaleString("en-US")
    document.querySelector(`#totalChange`).innerHTML = total_change_amount.toLocaleString("en-US")

    setLoadBudgetTable(true)
  }

  const clickAddBudgetBtn = async() => {
    dispatch(startAction())
    const res = await agent.common.addBudget(props.article_id, addBudget.construction.value, addBudget.cost, addBudget.contract_amount, addBudget.change_amount)
    if (res.data.success) {
      getArticleData()
      setAddBudget({...addBudget, construction: {}, cost: 0, contract_amount: 0, change_amount: 0})
      dispatch(showToast('success', res.data.message))
    }
    else dispatch(showToast('error', res.data.message))
    dispatch(endAction())
  }

  const handleBudgetEdited = async(event) => {
    const changed_data = event.detail.row
    dispatch(startAction())
    const res = await agent.common.editBudgets(changed_data.id, props.article_id, edit_construction_data.value, changed_data.cost, changed_data.contract_amount, changed_data.change_amount)
    if (res.data.success) {
      dispatch(showToast('success', res.data.message))
      setBudgets([...res.data.data])
    }
    else dispatch(showToast('error', res.data.message))
    dispatch(endAction())
  }

  const deleteBudget = async(budget_id) => {
    dispatch(startAction())
    const res = await agent.common.deleteBudget(budget_id)
    if (res.data.success) {
      const r_budgets = budgets.filter((el) => {
        return el.id != budget_id;
      });
      setBudgets([...r_budgets])
      setAddBudget({...addBudget, construction: {}, cost: 0, contract_amount: 0, change_amount: 0})
      dispatch(showToast('success', res.data.message))
    }
    else dispatch(showToast('error', res.data.message))
    dispatch(endAction())
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">basic information</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <UpdateHistory 
                id={article.id} 
                created_user_name={article.created_user_name} 
                created_at={article.created_at} 
                updated_user_name={article.updated_user_name} 
                updated_at={article.updated_at} 
              />
              <hr />
              <div className="form-group">
                <div className="row">
                  <div className="col-md-3 inline_label">
                    <label className="form-label">object name</label>
                  </div>
                  <div className="col-md-6">
                    <input className="form-control" type="text" defaultValue={article.name} onChange={(e) => setArticle({...article, name: e.target.value})}/>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="row">
                  <div className="col-md-3 inline_label">
                    <label className="form-label">Contract</label>
                  </div>
                  <div className="col-md-6">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text"><FaYenSign /></span>
                      </div>
                      <input className="form-control" type="text" defaultValue={article.contract_amount} onChange={(e) => setArticle({...article, contract_amount: e.target.value})}/>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="row">
                  <div className="col-md-3 inline_label">
                    <label className="form-label">Type</label>
                  </div>
                  <div className="col-md-6">
                    <div className="custom-control custom-radio custom-control-inline">
                      <input name="supportedRadio" type="radio" id="supportedRadio21" className="custom-control-input" defaultChecked = {article.is_house == 1 ? true : false} onChange={(e) => setArticle({...article, is_house: 1})}/>
                      <label title="" type="checkbox" htmlFor="supportedRadio21" className="custom-control-label">housing</label>
                    </div>
                    <div className="custom-control custom-radio custom-control-inline">
                      <input name="supportedRadio" type="radio" id="supportedRadio22" className="custom-control-input"  defaultChecked = {article.is_house == 0 ? true : false} onChange={(e) => setArticle({...article, is_house: 0})}/>
                      <label title="" type="checkbox" htmlFor="supportedRadio22" className="custom-control-label">building</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="row">
                  <div className="col-md-3 inline_label">
                    <label className="form-label">Non-representation</label>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input" defaultChecked={article.ended == 0 ? false : true} onChange={(e) => setArticle({...article, ended: e.target.checked ? 1 : 0})}/>
                      <label title="" type="checkbox" className="form-check-label">Show hidden properties</label>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="action_btn_group">
                <button type="button" className="btn btn-secondary" onClick={() => props.clickCancelBtn()}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={() => clickSaveSubmitBtn()}>Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">budget data</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <div className="input_table_container">
                <FilterSelect 
                  id="add_construction_input"
                  options={constructions} 
                  value={addBudget.construction}
                  onChange={(val) => {
                    setAddBudget({...addBudget, construction: {...val}});
                  }}
                />
                <input id="add_cost_input" className="form-control table_add_input" type="text" value={addBudget.cost} onChange={(e) => setAddBudget({...addBudget, cost: Number(e.target.value)})}/>
                <input id="add_contract_input" className="form-control table_add_input" type="text" value={addBudget.contract_amount} onChange={(e) => setAddBudget({...addBudget, contract_amount: Number(e.target.value)})}/>
                <input id="add_change_input" className="form-control table_add_input" type="text" value={addBudget.change_amount} onChange={(e) => setAddBudget({...addBudget, change_amount: Number(e.target.value)})}/>
                <a id="add_submit_btn" className="budget_add_submit_btn" onClick={() => clickAddBudgetBtn()}><IoMdAddCircle /></a>
                <Table 
                  id="budget_edit_table"
                  ref={budgetEditTable}
                  dataSource={budgetData} 
                  paging
                  freezeHeader
                  columns={budgetColumns} 
                  columnMenu
                  editing
                  editMode="row"
                  sortMode='many'
                  onClick={(e) => handleBudgetTableClick(e)}
                  onLoad={() => budgetEditTableInit()}
                  onRowEndEdit={(e) => handleBudgetEdited(e)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UpdateArticle