

/*在这个文件中我们对请求和响应进行封装*/


import axios from "axios";
import router from "@/router";


const Config = require('../settings');

/**
 * qs 模块是一个用于序列化和反序列化 URL 查询字符串的库。
 * 通常与 Axios 等 HTTP 请求库一起使用，用于处理 URL 查询参数的编码和解码
 */
// import qs from 'qs';

// import router from "@/router/index.js";


// 创建axios异步请求对象 进行初始化 配置
// 创建axios实例
const service = axios.create(
    {
        baseURL: "/api/",
        // 发送 post/put/patch/delete 请求之前 对 data 参数进行统一处理
        // transformRequest(data){
        //     return qs.stringify(data)
        // }
        timeout: Config.timeout // 请求超时时间

    }
)

// 配置 axios 请求 拦截器 - 例如添加token
service.interceptors.request.use( config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config
})

// 配置 axios 返回 拦截器 - 统一处理错误
service.interceptors.response.use( response => {


    if (response.status === 401) {
        router.push( { name: 'Error', params : { message: '请先登录' } } );
    } else if (response.status === 402) {
        router.push( { name: 'Error', params : { message: '登录过期，请重新登陆' } } );
    } else if (response.status === 403) {
        router.push( { name: 'Error', params : { message: '没有操作权限,请联系管理员' } } );
    }
    return response
},
    error => {
        if (error.response && error.response.status === 401) {
            // 处理未授权情况，如跳转登录
        }
        return Promise.reject(error);
    } )


// 导出
export default service
