

/*  User 业务模块 的 子仓库  */


import api from '@/api'; // 引入统一的 api 入口
// import {login} from "@/utils";
import axios from "axios";

export default {
    // 是否开启独立命名空间
    // false 逻辑分区 (默认值)
    // true  物理分区
    namespaced: true,
    // 各组件实例的data 迁移到这儿
    state: {
        /*  Login.vue 页面  */
        isLoggedIn: false,
        username: '',
        password: '',
        userAvatar: require('@/assets/avatar.png'),

        /*  Register.vue 页面  */
        registerForm: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: ''
        }

    },
    // 各组件实例的(同步)方法 迁移到这儿
    mutations: {
        /*  Login.vue 页面  */
        SET_LOGIN_STATE(state, payload) {
            state.isLoggedIn = true
            state.username = payload.username
            state.password = payload.password
            console.log('state.isLoggedIn: ',state.isLoggedIn)
            console.log('state.username: '  ,state.username)
        },
        logout(state) {
            state.isLoggedIn = false
            state.username = ''
        },

        /*  Register.vue 页面  */
        SET_REGISTER_FORM(state, formData) {
            state.registerForm = { ...state.registerForm, ...formData }
        },
        RESET_REGISTER_FORM(state) {
            state.registerForm = {
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                role: ''
            }
        }

    },
    // 各组件实例的(异步)方法 迁移到这儿
    actions: {
        /*  Login.vue 页面  */
        async login({commit}, userData) {
            // 模拟登录逻辑

            try {
                // 添加登录API调用
                const resp = await api.login.login(userData);
                console.log('Login successful:', resp.data);
                alert('登录成功！')

                // 模拟登录成功
                /*
                更新 store 使得NavBar组件实时及时更新
                <div class="navbar-user">
                  <template v-if="store.state.user.isLoggedIn">
               */
                commit('SET_LOGIN_STATE', userData)
                console.log(' 更新 store 使得NavBar组件实时及时更新... ' )

                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', userData.username);
                localStorage.setItem('authToken', resp.token);

                return resp
            } catch (error) {


                console.error(error.message);
                console.log('登录失败');
                alert("Fail to log in")
            } finally {
                // this.setState({
                //     loading: false,
                // });
            }

        },
        logout({ commit }) {

            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('authToken');

            commit('logout')
        },

        /*  Register.vue 页面  */
        // 注册操作
        async register({ commit }, formData) {
            try {
                // 这里替换为实际的API调用
                const domain = "http://localhost:8080"
                const loginUrl = `${domain}/auth/register`;
                const response = await axios.post(loginUrl, formData)
                console.log('response.data: ', response)
                if (response.status === 201) {
                    commit('RESET_REGISTER_FORM')
                    return { success: true, message: '注册成功' }
                }
                return { success: false, message: response.data.message }
            } catch (error) {
                return { success: false, message: error.response?.data?.message || '注册失败' }
            }
        },

        // 更新表单数据
        updateRegisterForm({ commit }, formData) {
            commit('SET_REGISTER_FORM', formData)
        },

        // 重置表单
        resetRegisterForm({ commit }) {
            commit('RESET_REGISTER_FORM')
        }

    },
    getters: {
        /*  Login.vue 页面  */
        isLoggedIn: state => state.isLoggedIn,
        username: state => state.username,
        userAvatar: state => state.userAvatar,

        /*  Register.vue 页面  */
        getRegisterForm: state => state.registerForm

    }
}
