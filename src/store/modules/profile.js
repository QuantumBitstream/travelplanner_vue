
// store/modules/profile.js
export default {
    namespaced: true,

    state: {
        profileForm: {
            username: 'exampleUser',
            email: '',
            // phone: ''
        },
        rules: {
            email: [
                { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
            ],
            // phone: [
            //     { required: true, message: '请输入电话号码', trigger: 'blur' },
            //     { pattern: /^[0-9]+$/, message: '电话号码只能包含数字', trigger: 'blur' }
            // ]
        }
    },

    getters: {
        getProfileForm: (state) => state.profileForm,
        getRules: (state) => state.rules
    },

    mutations: {
        SET_PROFILE_FORM(state, payload) {
            state.profileForm = payload;
        },
        RESET_PROFILE_FORM(state) {
            state.profileForm = {
                username: 'exampleUser',
                email: '',
                // phone: ''
            };
        }
    },

    actions: {
        // 加载用户资料
        async loadUserProfile({commit}) {
            // return new Promise((resolve) => {
            //     setTimeout(() => {
            //         const userData = {
            //             username: 'exampleUser',
            //             email: 'user@example.com',
            //             // phone: '1234567890'
            //         };
            //         commit('SET_PROFILE_FORM', userData);
            //         resolve(userData);
            //     }, 500);
            // });


            try {
                const authToken = localStorage.getItem("authToken");
                const response = await fetch(
                    'http://localhost:8080/user/profile',
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    });
                const data = await response.json();
                commit('SET_PROFILE_FORM', data);  // store, 异步方法调用同步方法
            } catch (error) {
                console.error('Error fetching user data:', error);
            }


        },

        // 更新用户资料
        updateUserProfile({ state }) {
            return new Promise((resolve) => {
                // 这里模拟API调用
                setTimeout(() => {
                    resolve(state.profileForm);
                }, 500);
            });
        },

        // 重置表单
        resetProfileForm({ commit }) {
            commit('RESET_PROFILE_FORM');
        }
    }
};
