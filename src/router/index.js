import {createRouter, createWebHistory} from 'vue-router'


import {publicRoutes} from "@/router/routes";

// import store from "@/store";
// import {store} from "core-js/internals/reflect-metadata";





const router = createRouter({
    history: createWebHistory(process.env.VUE_APP_BASE_URL),
    routes: publicRoutes  // 定义地址和页面的映射
})

export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher;
}



export default router
