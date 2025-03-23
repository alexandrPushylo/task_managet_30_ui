import axios from "axios";
import Cookies from 'js-cookie'

const csrftoken = Cookies.get('csrftoken');
// console.log(csrftoken);

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

export const instance = axios.create({
    baseURL: "http://192.168.1.42:8000",
    withCredentials: true,
    headers:{
         "csrftoken": csrftoken,
    }


})

export async function getData() {
    return await instance.get('api/get_data')
}
export async function loginApi(data) {
    return await instance.post("/api/login/", data)
}
export async function logoutApi(data) {
    return await instance.get("/api-auth/logout/")
}

