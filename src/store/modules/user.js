

/*  User 业务模块 的 子仓库  */


import {login} from "@/utils";

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
        userAvatar: require('@/assets/avatar.png')
    },
    // 各组件实例的(同步)方法 迁移到这儿
    mutations: {
        /*  Login.vue 页面  */
        login(state, payload) {
            state.isLoggedIn = true
            state.username = payload.username
            state.password = payload.password
            console.log('state.isLoggedIn: ',state.isLoggedIn)
            console.log('state.username: '  ,state.username)
        },
        logout(state) {
            state.isLoggedIn = false
            state.username = ''
        }
    },
    // 各组件实例的(异步)方法 迁移到这儿
    actions: {
        /*  Login.vue 页面  */
        async login({commit}, userData) {
            // 模拟登录逻辑
            // 模拟登录成功
            try {
                const resp = await login(userData);
                console.log('Login successful:', resp.data);

                /*
                更新 store 使得NavBar组件实时及时更新
                <div class="navbar-user">
                  <template v-if="store.state.user.isLoggedIn">
               */
                commit('login', userData)
                console.log(' 更新 store 使得NavBar组件实时及时更新... ' )

                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', userData.username);

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

            commit('logout')
        }
    },
    getters: {
        isLoggedIn: state => state.isLoggedIn,
        username: state => state.username,
        userAvatar: state => state.userAvatar
    }
}
