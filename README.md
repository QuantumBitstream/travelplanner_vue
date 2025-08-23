

---

# Travel Planner

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)

Travel Planner 是一个使用 Vue.js 构建的现代化前端项目，旨在帮助用户轻松计划和管理旅行。它提供了一个直观的界面，让用户可以创建行程、添加目的地、记录笔记和预算，并与朋友分享。

## ✨ 功能特性

*   **行程创建与管理:** 创建新的旅行计划，并对现有的计划进行编辑、复制或删除。
*   **目的地搜索与添加:** 通过集成的地图服务搜索目的地，并将其添加到您的行程中。
*   **每日行程规划:** 为旅行中的每一天安排详细的活动和时间表。
*   **预算跟踪:** 记录旅行开销，设置预算提醒，并查看花费分析。
*   **笔记与清单:** 为每个目的地或活动添加备注、提醒和待办事项清单。
*   **响应式设计:** 在桌面、平板和手机上都能获得良好的用户体验。
*   **用户认证:** 安全的注册和登录系统，保护您的旅行数据。
*   **(可选) 社交分享:** 与朋友或家人分享您的旅行计划，并进行协作。

## 🚀 技术栈

*   **前端框架:** [Vue.js](https://vuejs.org/) 3 (或 2)
*   **状态管理:** [Pinia](https://pinia.vuejs.org/) (或 Vuex)
*   **路由:** [Vue Router](https://router.vuejs.org/)
*   **UI 库:** [Element Plus](https://element-plus.org/) / [Vuetify](https://vuetifyjs.com/) / [Tailwind CSS](https://tailwindcss.com/) (根据你的选择)
*   **HTTP 请求:** [Axios](https://axios-http.com/)
*   **地图服务:** [Google Maps API](https://developers.google.com/maps) / [Mapbox](https://www.mapbox.com/)
*   **打包工具:** [Vite](https://vitejs.dev/) (或 Vue CLI)
*   **代码规范:** ESLint, Prettier

## 📦 安装与运行

**1. 克隆项目**

```bash
git clone https://github.com/QuantumBitstream/travelplanner_vue.git
cd travel-planner
```

**2. 安装依赖**

推荐使用 `pnpm` 进行安装：

```bash
pnpm install
```

或者使用 `npm` 或 `yarn`:

```bash
npm install
# or
yarn install
```

**3. 配置环境变量**

在项目根目录下创建一个 `.env.local` 文件，并添加必要的环境变量。例如：

```
VUE_APP_API_BASE_URL=http://localhost:8080/api
VUE_APP_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

**4. 运行开发服务器**

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

项目将在 `http://localhost:5173` (Vite 默认) 或 `http://localhost:8080` (Vue CLI 默认) 上运行。

**5. 构建生产版本**

```bash
pnpm build
# or
npm run build
# or
yarn build
```

构建后的文件将输出到 `dist` 目录。

## 📸 项目截图


**首页:**
![首页截图](https://via.placeholder.com/800x400.png?text=Homepage+Screenshot)

**行程详情页:**
![行程详情页截图](https://via.placeholder.com/800x400.png?text=Trip+Detail+Screenshot)

## 🤝 贡献

我们欢迎任何形式的贡献！如果你有任何建议或发现了 bug，请随时提 [Issue](https://github.com/QuantumBitstream/travelplanner_vue/issues)。

如果你想贡献代码，请遵循以下步骤：

1.  Fork 本项目
2.  创建一个新的分支 (`git checkout -b feature/AmazingFeature`)
3.  提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4.  将你的分支推送到远程 (`git push origin feature/AmazingFeature`)
5.  创建一个 Pull Request

## 📝 许可证

本项目使用 [Apache 2.0](https://opensource.org/licenses/apache-2-0) 许可证。

---


