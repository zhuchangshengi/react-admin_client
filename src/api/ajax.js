/**
 * 网络请求配置
 */
import axios from "axios";
import { message } from "antd"

axios.defaults.timeout = 100000;
axios.defaults.baseURL = "";

/**
 * http request 拦截器
 */
axios.interceptors.request.use(
    (config) => {
        // console.log("axios请求 拦截：" + config)
 /*       config.headers = {
            "Content-Type": "application/json",
        };*/
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * http response 拦截器
 */
axios.interceptors.response.use(
    (response) => {
        // console.log("axios响应 拦截：" + response)
/*        if (response.data.errCode === 2) {
            console.log("过期");
        }*/
        return response;
    },
    (error) => {
        console.log("请求出错：", error);
    }
);

/**
 * 封装get方法
 * @param url  请求url
 * @param params  请求参数
 * @returns {Promise}
 */
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params,
        }).then((response) => {
            landing(url, params, response.data);
            resolve(response.data);
        })
            .catch((err) => {
                msg(err);
            });
    });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data) {
    return new Promise((resolve, reject) => {
        axios.post(url, data).then(
            (response) => {
                resolve(response.data);
            }).catch((err)=>{
            msg(err);
        });
    });
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.patch(url, data).then(
            (response) => {
                resolve(response.data);
            }).catch((err)=>{
            msg(err);
            });
    });
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, data).then((response) => {
                resolve(response.data);
            }).catch((err)=>{
            msg(err);
        })
    });
}
//失败提示
function msg(err){
    message.error("请求出错！");
    console.error(err);
}

/**
 * 查看返回的数据
 * @param url
 * @param params
 * @param data
 */
function landing(url, params, data) {
    if (data.code === -1) {
    }
}