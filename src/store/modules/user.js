

/*  User 业务模块 的 子仓库  */


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
        userAvatar: 'https://example.com/avatar.jpg'
    },
    // 各组件实例的(同步)方法 迁移到这儿
    mutations: {
        login(state, payload) {
            state.isLoggedIn = true
            state.username = payload.username
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
        login({ commit }, userData) {
            // 模拟登录逻辑
            commit('login', userData)
        },
        logout({ commit }) {
            commit('logout')
        }
    },
    getters: {
        isLoggedIn: state => state.isLoggedIn,
        username: state => state.username,
        userAvatar: state => state.userAvatar
    }
}
