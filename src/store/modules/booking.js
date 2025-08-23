/**
 * booking.js - 预订与支付管理Vuex模块
 * 功能：
 * 1. 存储当前预订产品信息
 * 2. 处理订单创建和支付流程
 * 3. 管理支付结果
 */
import axios from 'axios'

// 状态
const state = () => ({
    // 预订信息
    bookingInfo: {},
    // 当前订单ID
    currentOrderId: null,
    // 支付状态
    paymentStatus: '', // '', 'success', 'failed', 'pending'
    // 错误信息
    errorMessage: ''
})

// Mutations - 修改状态
const mutations = {
    // 设置预订信息
    setBookingInfo(state, info) {
        state.bookingInfo = info
        console.log("[Vuex] 已更新预订信息:", info)
    },

    // 设置当前订单ID
    setCurrentOrderId(state, id) {
        state.currentOrderId = id
    },

    // 设置支付状态
    setPaymentStatus(state, status) {
        state.paymentStatus = status
    },

    // 设置错误信息
    setErrorMessage(state, message) {
        state.errorMessage = message
    },

    // 重置支付状态
    resetPaymentState(state) {
        state.paymentStatus = ''
        state.errorMessage = ''
    }
}

// Actions - 处理异步逻辑
const actions = {
    /**
     * 创建订单
     * @param {Object} context - Vuex上下文
     * @param {Object} orderData - 订单数据
     * @returns {Promise<string>} - 返回订单ID
     */
    async createOrder({ commit }, orderData) {
        try {
            // 重置前一次支付的状态
            commit('resetPaymentState')

            // 调用后端API创建订单
            const response = await axios.post('/api/order', orderData)

            // 保存订单ID
            const orderId = response.data.id
            commit('setCurrentOrderId', orderId)

            return orderId
        } catch (error) {
            console.error('创建订单失败:', error)
            commit('setErrorMessage', error.message || '创建订单失败')
            throw error
        }
    },

    /**
     * 获取支付表单
     * @param {Object} context - Vuex上下文
     * @param {string} orderId - 订单ID
     * @returns {Promise<string>} - 返回支付表单HTML
     */
    async getPaymentForm({ commit, state }, orderId) {
        try {
            // 如果没有传orderId，使用当前订单ID
            const id = orderId || state.currentOrderId
            if (!id) {
                throw new Error('订单ID不存在')
            }

            // 获取支付表单
            const response = await axios.get(`/api/order/pay/${id}`, {
                responseType: 'text'
            })

            return response.data
        } catch (error) {
            console.error('获取支付表单失败:', error)
            commit('setErrorMessage', error.message || '获取支付表单失败')
            throw error
        }
    },

    /**
     * 查询支付结果
     * @param {Object} context - Vuex上下文
     * @param {string} orderId - 订单ID
     */
    async queryPaymentResult({ commit, state }, orderId) {
        try {
            const id = orderId || state.currentOrderId
            if (!id) {
                throw new Error('订单ID不存在')
            }

            // 查询支付结果
            const response = await axios.get(`/api/order/${id}/status`)

            // 更新支付状态
            commit('setPaymentStatus', response.data.status)

            return response.data
        } catch (error) {
            console.error('查询支付结果失败:', error)
            commit('setErrorMessage', error.message || '查询支付结果失败')
            throw error
        }
    }
}

// Getters - 计算属性
const getters = {
    // 是否有可用的预订信息
    hasBookingInfo: state => {
        return state.bookingInfo && state.bookingInfo.title
    },

    // 支付是否成功
    isPaymentSuccess: state => {
        return state.paymentStatus === 'PAID'
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
