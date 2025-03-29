import axios from "axios";
import Cookies from 'js-cookie'
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"

const baseUrl = "http://192.168.1.42:8000/api";

const csrftoken = Cookies.get('csrftoken');
console.log(csrftoken);

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

export const instance = axios.create({
    baseURL: "http://192.168.1.42:8000",
    withCredentials: true,

    headers:{
        'X-CSRFTOKEN': csrftoken,
    },


});
