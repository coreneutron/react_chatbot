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
