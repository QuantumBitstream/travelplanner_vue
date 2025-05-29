<template>
  <nav class="navbar">
    <div class="navbar-container" ref="navbarContainer">
      <!-- Logo区域 -->
      <div class="navbar-logo" ref="logoArea">
        <router-link to="/">
          <img src="@/assets/logo.png" alt="Logo" class="logo-img">
          <span class="logo-text">旅行助手</span>
        </router-link>
      </div>

      <!-- 导航链接 -->
      <div class="navbar-links" ref="navLinksArea">
        <!-- 可见的菜单项 -->
        <router-link
            v-for="item in visibleNavItems"
            :key="item.path"
            :to="item.path"
            class="nav-item"
            :class="{ active: currentPath === item.path }"
        >
          {{ item.name }}
        </router-link>

        <!-- 更多菜单 - 使用 Element Plus Dropdown -->
        <el-dropdown
            v-if="hiddenNavItems.length > 0"
            trigger="click"
            placement="bottom-start"
            @command="handleMoreMenuClick"
        >
          <span class="nav-item more-menu">
            更多
            <el-icon class="more-icon">
              <ArrowDown />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                  v-for="item in hiddenNavItems"
                  :key="item.path"
                  :command="item.path"
                  :class="{ 'is-active': currentPath === item.path }"
              >
                {{ item.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- 用户信息/登录按钮 -->
      <div class="navbar-user" ref="userArea">
        <template v-if="store.state.user.isLoggedIn">
          <!-- 用户下拉菜单 - 使用 Element Plus Dropdown -->
          <el-dropdown trigger="click" placement="bottom-end" @command="handleUserMenuClick">
            <div class="user-info">
              <el-avatar
                  :src="store.state.user.userAvatar"
                  :size="32"
                  class="user-avatar"
              />
              <span class="username">{{ store.state.user.username }}</span>
              <el-icon class="user-menu-icon">
                <ArrowDown />
              </el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item command="my-trips">
                  <el-icon><Notebook /></el-icon>
                  我的行程
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <el-button type="primary" plain @click="$router.push('/login')">
            登录
          </el-button>
          <el-button type="primary" @click="$router.push('/register')">
            注册
          </el-button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import store from "@/store";
import { mapState } from "vuex";
import { ArrowDown, User, Notebook, SwitchButton } from '@element-plus/icons-vue';

export default {
  name: 'NavBar',
  components: {
    ArrowDown,
    User,
    Notebook,
    SwitchButton
  },
  data() {
    return {
      allNavItems: [
        { name: '首页', path: '/', priority: 1 },
        { name: '目的地', path: '/destinations', priority: 2 },
        { name: '行程规划', path: '/trip-planner', priority: 3 },
        { name: '社区', path: '/community', priority: 4 },
        { name: 'Chat', path: '/chat-channel', priority: 5 },
        { name: 'AI ChatBox', path: '/ai-chatBox', priority: 6 },
        { name: 'WeatherStream', path: '/WeatherStream', priority: 7 },
        { name: 'PersonalRecord', path: '/PersonalRecord', priority: 8 },
      ],
      visibleNavItems: [],
      hiddenNavItems: [],
      resizeObserver: null,
      isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
      username: localStorage.getItem('username') || '用户名',
      userAvatar: 'https://example.com/avatar.jpg'
    }
  },
  computed: {
    store() {
      return store
    },
    ...mapState(["user"]),
    currentPath() {
      return this.$route.path
    }
  },
  methods: {
    // 处理更多菜单点击
    handleMoreMenuClick(path) {
      this.$router.push(path);
    },

    // 处理用户菜单点击
    handleUserMenuClick(command) {
      switch (command) {
        case 'profile':
          this.$router.push('/profile');
          break;
        case 'my-trips':
          this.$router.push('/my-trips');
          break;
        case 'logout':
          this.handleLogout();
          break;
      }
    },

    handleLogout() {
      store.dispatch('user/logout');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      this.isLoggedIn = false;
      this.$router.push('/');
    },

    // 估算菜单项宽度
    estimateItemWidth(text) {
      const baseWidth = 24; // padding
      const charWidth = 16; // 每个字符平均宽度
      return baseWidth + (text.length * charWidth);
    },

    // 计算可见菜单项
    calculateVisibleItems() {
      this.$nextTick(() => {
        if (!this.$refs.navbarContainer) return;

        const containerWidth = this.$refs.navbarContainer.offsetWidth;
        const logoWidth = this.$refs.logoArea?.offsetWidth || 200;
        const userWidth = this.$refs.userArea?.offsetWidth || 200;
        const moreButtonWidth = 80; // "更多"按钮预留宽度
        const padding = 40; // 容器内边距

        // 可用于菜单项的宽度
        let availableWidth = containerWidth - logoWidth - userWidth - padding;

        // 按优先级排序，优先显示重要菜单
        const sortedItems = [...this.allNavItems].sort((a, b) => a.priority - b.priority);

        let currentWidth = 0;
        const visible = [];
        const hidden = [];

        for (let i = 0; i < sortedItems.length; i++) {
          const estimatedWidth = this.estimateItemWidth(sortedItems[i].name);

          // 如果还有剩余项目，需要为"更多"按钮预留空间
          const needMoreButton = i < sortedItems.length - 1;
          const requiredWidth = currentWidth + estimatedWidth + (needMoreButton ? moreButtonWidth : 0);

          if (requiredWidth <= availableWidth) {
            visible.push(sortedItems[i]);
            currentWidth += estimatedWidth;
          } else {
            hidden.push(sortedItems[i]);
          }
        }

        this.visibleNavItems = visible;
        this.hiddenNavItems = hidden;
      });
    },

    // 处理窗口大小变化
    handleResize() {
      this.calculateVisibleItems();
    }
  },
  mounted() {
    // 初始计算
    this.calculateVisibleItems();

    // 监听窗口大小变化
    window.addEventListener('resize', this.handleResize);

    // 使用 ResizeObserver 监听容器大小变化
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        this.calculateVisibleItems();
      });
      this.resizeObserver.observe(this.$refs.navbarContainer);
    }

    // 原有的用户状态恢复逻辑
    console.log(' NavBar.vue store.state.user.isLoggedIn: ', store.state.user.isLoggedIn);
    console.log(' NavBar.vue store.state.user.username: ', store.state.user.username);

    //判断store中是否含有当前登录的用户数据
    if (store.state.user.username === '') {
      //判断本地缓存中是否含有当前登录的用户数据
      if (localStorage.getItem("username") != null) {
        //将本地缓存中的当前登录的用户据恢复到store仓库中
        console.log(' localStorage.getItem("username") != null,即该用户登录，但刚才刷新页面导致页面store丢失: ');
        console.log(' 将本地缓存中的当前登录的用户据恢复到store仓库中: ');
        store.state.user.username = JSON.parse(JSON.stringify(localStorage.getItem("username")));
        store.state.user.isLoggedIn = JSON.parse(JSON.stringify(localStorage.getItem("isLoggedIn")));
        console.log(' NavBar.vue store.state.user.isLoggedIn: ', store.state.user.isLoggedIn);
        console.log(' NavBar.vue store.state.user.username: ', store.state.user.username);
      }
    }
  },
  beforeUnmount() {
    // 清理事件监听器
    window.removeEventListener('resize', this.handleResize);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
</script>

<style scoped>
/* 保持原有样式 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 1000;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.navbar-logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.navbar-logo a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
}

.logo-img {
  height: 32px;
  margin-right: 10px;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
}

.navbar-links {
  display: flex;
  gap: 30px;
  flex: 1;
  justify-content: center;
  overflow: hidden;
}

.nav-item {
  text-decoration: none;
  color: #666;
  font-size: 16px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.nav-item:hover {
  color: #409eff;
  background-color: rgba(64, 158, 255, 0.1);
}

.nav-item.active {
  color: #409eff;
  font-weight: 500;
}

/* 更多菜单样式 */
.more-menu {
  gap: 4px;
}

.more-icon {
  margin-left: 4px;
  font-size: 12px;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s;
  gap: 8px;
}

.user-info:hover {
  background-color: #f5f5f7;
}

.username {
  color: #333;
  font-size: 14px;
}

.user-menu-icon {
  font-size: 12px;
  color: #999;
}

/* Element Plus 下拉菜单自定义样式 */
:deep(.el-dropdown-menu__item.is-active) {
  color: #409eff;
  background-color: rgba(64, 158, 255, 0.1);
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .navbar-container {
    padding: 0 10px;
  }

  .navbar-links {
    gap: 15px;
  }

  .logo-text {
    display: none;
  }

  .username {
    display: none;
  }
}
</style>
