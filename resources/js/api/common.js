import axios from "axios";

import { API_URL } from "../constants/";

const authHeader = {
    headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
    },
};

const commonApi = {
    getUsers: () =>
        axios.get(`${API_URL}/users`, 
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    getUser: (id) =>
        axios.get(`${API_URL}/users/${id}`, 
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    createUser: (user) =>
        axios.post(`${API_URL}/users`, { user }, 
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    updateUser: (id, user) =>
        axios.put(`${API_URL}/users/${id}`, { user }, 
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    deleteUser: (id) =>
        axios.delete(`${API_URL}/users/${id}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
        
    // Scenario
    getScenarios: () =>
        axios.get(`${API_URL}/scenarios`, 
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    getScenario: (id) =>
        axios.get(`${API_URL}/scenarios/${id}`, 
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    createScenario: (scenario) =>
        axios.post(`${API_URL}/scenarios`, scenario, 
        {
            headers: {
                'content-type': 'multipart/form-data',
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    updateScenario: (id, scenario) =>
        axios.post(`${API_URL}/updateScenario`, scenario,
        {
            headers: {
                'content-type': 'multipart/form-data',
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    updateScenarioStatus: (id, status) => 
        axios.post(`${API_URL}/updateScenarioStatus`, 
        {
            id,
            status
        },
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    deleteScenario: (id) =>
        axios.delete(`${API_URL}/scenarios/${id}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),

    // Question
    getQuestionsById: (id) =>
        axios.post(`${API_URL}/getQuestionsById`, {id}, 
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    getQuestions: () =>
        axios.get(`${API_URL}/questions`, 
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    getQuestion: (id) =>
        axios.get(`${API_URL}/questions/${id}`, 
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    createQuestion: (question, options) =>
        axios.post(`${API_URL}/questions`, { question, options },  
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    updateQuestion: (id, question, options) =>
        axios.put(`${API_URL}/questions/${id}`, { question:question, options:options }, 
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    deleteQuestion: (id) =>
        axios.delete(`${API_URL}/questions/${id}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    
    // Setting
    getSettings: () =>
        axios.get(`${API_URL}/settings`, 
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    getSetting: (id) =>
        axios.get(`${API_URL}/settings/${id}`, 
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    updateSetting: (id, setting) =>
        axios.put(`${API_URL}/settings/${id}`, { setting }, 
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    updateSettingBotAvatar: (id, setting) =>
        axios.post(`${API_URL}/updateSettingBotAvatar`, setting,
        {
            headers: {
                'content-type': 'multipart/form-data',
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    getStory: () =>
        axios.get(`${API_URL}/getStory`, 
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }),
    
    updateAccountStatus: (id, disabled) =>
        axios.put(
            `${API_URL}/users/${id}`,
            {
                disabled,
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        ),
    changePassword: (old_pwd, new_pwd) =>
        axios.post(
            `${API_URL}/changePwd`,
            {
                old_pwd,
                new_pwd,
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        ),
};

export default commonApi;
