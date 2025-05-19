
// 修改配置文件，记得重启开发服务器以确保更改生效
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config.plugin('define').tap(args => {
      Object.assign(args[0], {
        __VUE_OPTIONS_API__: true,  // 控制是否启用 Vue 3 的 Options API。通常设置为 true，以便支持传统的 Vue 组件写法
        __VUE_PROD_DEVTOOLS__: false,  // 控制是否在生产环境中启用 Vue Devtools。通常设置为 false，以减少生产环境的包大小
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false  // 控制是否在生产环境中提供更详细的 hydration 错误信息。通常设置为 false，以优化生产环境的性能
      })
      return args
    })
  },
  devServer: {
    // 本地开发如果要调后端，推荐用 vue 的 proxy，这样不会碰到 CORS 问题
    proxy: {
      // 前端本地访问 /api/xxx，实际请求会被本地前端 devServer 代理到 http://localhost:8081/api/xxx
      // 前端本地访问 /api/xxx，实际请求会被本地前端 devServer 代理到 https://apis.map.qq.com/api/xxx
      // '/api': {
      //   target: 'https://apis.map.qq.com', // 替换为你的后端服务器地址
      //   changeOrigin: true, // 修改请求头中的 Origin 为目标地址
      //   pathRewrite: { '^/api': '' }, // 重写路径，将 /api 替换为空
      //   secure: false // 如果使用 HTTPS 且后端证书无效，设置为 false
      // },
      /**
       *
       * 本地 vue  刷新页面              vue.config.js
       *
       * This application has no explicit mapping for /error, so you are seeing this as a fallback.
       *
       *
       * 此时 只改 vue.config.js 没用，因为浏览器会直接发静态请求，被 Spring Boot 拦截
       *
       * 你还得让 Spring Boot 做转发，把所有未命中的路由都转发到 /index.html，让前端自己解析路径。
       *
       * 或者 '/': { ==> '/api': {
       */
      '/api': {
        target: 'http://localhost:8081', // 替换为你的后端服务器地址
        changeOrigin: true, // 修改请求头中的 Origin 为目标地址
        pathRewrite: { '^/': '' }, // 重写路径，将 /api 替换为空
        secure: false // 如果使用 HTTPS 且后端证书无效，设置为 false
      },
    }
  }
})
