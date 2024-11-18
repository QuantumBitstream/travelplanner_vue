// 从 vuex 模块 导入 创建仓库的方法
import { createStore } from 'vuex'

// import Vue from 'vue'
// import Vuex from 'vuex'
import getters from './getters'
import user from "@/store/modules/user";
import home from "@/store/modules/home";
import destination from "@/store/modules/destination";
import trip from "@/store/modules/trip";
import community from "@/store/modules/community";
import profile from "@/store/modules/profile";




/**
 *
 * Vue.use(Vuex) 是在 Vue 2 中使用 Vuex 这个状态管理库的一个关键步骤。
 * 它的作用是将 Vuex 插件安装到 Vue 框架中，使得 Vue 组件能够使用 Vuex 提供的状态管理功能。
 *
 * 在组件中，你可以通过 this.$store 来访问 Vuex Store，并通过相应的方法来读取状态、提交突变或者发起动作。
 *
 *
 * Vue.use(Vuex) 是为在 Vue 2 中使用 Vuex 插件而必要的。
 * 它的作用是将 Vuex 安装为 Vue 的插件，使全局的状态管理在组件中可用。
 * 而在 Vue 3 中，这个步骤已经被内部简化和优化。
 *
 * 在 Vue 3 中，Vue.use(Vuex) 不再是必需的操作，因为 Vuex 被直接导入和使用，不需要显式安装插件
 *
 *
 */
// Vue.use(Vuex)


/**
 *
 * 创建 Vuex Store，用于定义你的应用状态、突变、动作和 getters。
 *
 * @type {Store<{}>}
 */
// 创建 总仓库 并且导出
// export default createStore({
export default createStore({
// // const store = new Vuex.Store({
//     // 各组件实例的data 迁移到这儿
//     state: {
//
//     },
//     // 各组件实例的(同步)方法 迁移到这儿
//     mutations: {
//     },
//     // 各组件实例的(异步)方法 迁移到这儿
//     actions: {
//         /**
//          * Error: [vuex] actions should be function or object with "handler" function but
//          */
//
//     },
    // 总仓库 不实现任何状态管理 (没有 state mutations actions)         只合并子仓库
    modules: {
        user,
        profile,
        home,
        destination,
        trip,
        community,
    },
    getters
})

// export default store
