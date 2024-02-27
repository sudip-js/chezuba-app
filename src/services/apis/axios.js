import axios from "axios";
import { toast } from "react-toastify"

export const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
    },
});


apiClient.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});

apiClient.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    const errorMessage = error?.response?.data?.message || 'Something went wrong!'
    toast.error(errorMessage, {
        position: "top-right",
        theme: 'dark',
    })
    return Promise.reject(error);
});