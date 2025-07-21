// src/api/index.js

import * as userApi from './modules/user';
import * as loginApi from './modules/login';
// 如果有别的模块，继续在这里引入
// import * as productApi from './modules/product';


/**
 *
 * 为了方便调用，我们将所有模块的 API 在这里整合并导出。
 *
 * @type {{user: {}, login: {}}}
 */
const api = {
    user: userApi,
    login: loginApi
    // product: productApi,
};

export default api;
