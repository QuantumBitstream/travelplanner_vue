// src/api/modules/user.js


/**
 *
 * 这里定义所有与用户相关的 API 函数。
 * 
 */
import request from '@/api/request'; // 引入封装好的 axios 实例

/**
 * @description 登录接口
 * @param {object} data - 包含 username 和 password 的对象
 * @returns Promise
 */
export function login(data) {
    return request({
        url: '/auth/login', // 你的登录接口地址
        method: 'post',
        data // post 请求的数据
    });
}

/**
 * @description 获取用户信息接口
 * @returns Promise
 */
export function getInfo() {
    return request({
        url: '/user/info', // 获取用户信息的接口地址
        method: 'get'
    });
}

/**
 * @description 登出接口
 * @returns Promise
 */
export function logout() {
    return request({
        url: '/auth/logout', // 登出接口地址
        method: 'post'
    });
}
