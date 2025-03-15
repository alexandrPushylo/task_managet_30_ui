import axios from "axios";
// import Cookies from 'js-cookie'
//
// const csrftoken = Cookies.get('csrftoken');
//
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
// axios.defaults.xsrfCookieName = "csrftoken";

export const instance = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
    // headers:{'X-CSRFTOKEN': csrftoken}

})