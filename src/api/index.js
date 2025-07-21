// src/api/index.js

import * as userApi from './modules/user';
import * as loginApi from './modules/login';
// 如果有别的模块，继续在这里引入
// import * as productApi from './modules/product';

const api = {
    user: userApi,
    login: loginApi
    // product: productApi,
};

export default api;
