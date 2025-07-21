/*在这个文件中我们对请求和响应进行封装*/

/**
 *
 * 这是 API 请求的核心。我们在这里
 * - 封装 axios，
 * - 设置基础 URL、超时时间，并
 * - 添加请求拦截器（用于携带 Token）和
 * - 响应拦截器（用于统一处理错误）。
 *
 */


import axios from "axios";
import router from "@/router";
import {ElMessage} from "element-plus"; // 引入 Vuex store


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
        // 注意：baseURL 会自动拼接到请求的 URL 前面
        // 在 .env.development 或 .env.production 中配置 VUE_APP_BASE_API
        baseURL: process.env.VUE_APP_BASE_API || '/api/',
        // 发送 post/put/patch/delete 请求之前 对 data 参数进行统一处理
        // transformRequest(data){
        //     return qs.stringify(data)
        // }
        timeout: Config.timeout // 请求超时时间

    }
)

// 配置 axios 请求 拦截器 - 例如添加token
service.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config
    })

// 配置 axios 返回 拦截器 - 统一处理错误
service.interceptors.response.use(
    /**
     * 如果你想获取诸如 headers 或 status 之类的http信息
     * 请直接 return  response
     */
    response => {
        const res = response.data;
        ElMessage.warning(res.message);
        if (response.status === 401) {
            router.push({name: 'Error', params: {message: '请先登录'}});
        } else if (response.status === 402) {
            router.push({name: 'Error', params: {message: '登录过期，请重新登陆'}});
        } else if (response.status === 403) {
            router.push({name: 'Error', params: {message: '没有操作权限,请联系管理员'}});
        }
        return response
    },
    error => {
        if (error.response && error.response.status === 401) {
            // 处理未授权情况，如跳转登录
        }
        return Promise.reject(error);
    })


// 导出
export default service
