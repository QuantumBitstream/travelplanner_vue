<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo区域 -->
      <div class="navbar-logo">
        <router-link to="/">
          <img src="@/assets/logo.png" alt="Logo" class="logo-img">
          <span class="logo-text">旅行助手</span>
        </router-link>
      </div>

      <!-- 导航链接 -->
      <div class="navbar-links">
        <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-item"
            :class="{ active: currentPath === item.path }"
        >
          {{ item.name }}
        </router-link>
      </div>

      <!-- 用户信息/登录按钮 -->
      <div class="navbar-user">
        <template v-if="store.state.user.isLoggedIn">
          <div class="user-info" @click="toggleUserMenu">
            <img :src="store.state.user.userAvatar" alt="用户头像" class="user-avatar">
            <span class="username">{{ store.state.user.username }}</span>
            <!-- 用户下拉菜单 -->
            <div v-show="showUserMenu" class="user-menu">
              <router-link to="/profile" class="menu-item">个人中心</router-link>
              <router-link to="/my-trips" class="menu-item">我的行程</router-link>
              <div class="menu-item" @click="handleLogout">退出登录</div>
            </div>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="login-btn">登录</router-link>
          <router-link to="/register" class="register-btn">注册</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import store from "@/store";
import {mapState} from "vuex";

export default {
  name: 'NavBar',
  data() {
    return {
      navItems: [
        { name: '首页', path: '/' },
        { name: '目的地', path: '/destinations' },
        { name: '行程规划', path: '/trip-planner' },
        { name: '社区', path: '/community' },
        { name: 'Chat', path: '/chat-channel' },
        { name: 'AI ChatBox', path: '/ai-chatBox' },
      ],
      showUserMenu: false,
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
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu
    },
    handleLogout() {
      store.dispatch('user/logout')
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('username')
      this.isLoggedIn = false
      this.$router.push('/')
    }
  },
  mounted() {
    // 点击其他地方关闭用户菜单
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.user-info')) {
        this.showUserMenu = false
      }
    });

    console.log(' NavBar.vue store.state.user.isLoggedIn: ',store.state.user.isLoggedIn)
    console.log(' NavBar.vue store.state.user.username: '  ,store.state.user.username)
    //判断store中是否含有当前登录的用户数据
    if (store.state.user.username === '') {
      //判断本地缓存中是否含有当前登录的用户数据
      if (localStorage.getItem("username") != null) {
        //将本地缓存中的当前登录的用户据恢复到store仓库中
        console.log(' NavBar.vue store.state.user.isLoggedIn: ',store.state.user.isLoggedIn)
        console.log(' NavBar.vue store.state.user.username: '  ,store.state.user.username)

        console.log(' localStorage.getItem("username") != null,即该用户登录，但刚才刷新页面导致页面store丢失: '  )
        console.log(' 将本地缓存中的当前登录的用户据恢复到store仓库中: '  )
        store.state.user.username = JSON.parse( JSON.stringify( localStorage.getItem("username") ) )
        store.state.user.isLoggedIn = JSON.parse( JSON.stringify( localStorage.getItem("isLoggedIn") ) )
        console.log(' NavBar.vue store.state.user.isLoggedIn: ',store.state.user.isLoggedIn)
        console.log(' NavBar.vue store.state.user.username: '  ,store.state.user.username)

      }
    }
  }
}
</script>

<style scoped>
/* 样式同之前提供的内容 */
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
}

.nav-item {
  text-decoration: none;
  color: #666;
  font-size: 16px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s;
}

.nav-item:hover {
  color: #1890ff;
  background-color: rgba(24,144,255,0.1);
}

.nav-item.active {
  color: #1890ff;
  font-weight: 500;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  padding: 8px;
  border-radius: 4px;
}

.user-info:hover {
  background-color: #f5f5f5;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}

.username {
  color: #333;
  font-size: 14px;
}

.user-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  padding: 4px 0;
  min-width: 120px;
  margin-top: 4px;
}

.menu-item {
  display: block;
  padding: 8px 16px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s;
}

.menu-item:hover {
  background-color: #f5f5f5;
  color: #1890ff;
}

.login-btn,
.register-btn {
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s;
}

.login-btn {
  color: #1890ff;
  background-color: transparent;
  border: 1px solid #1890ff;
}

.login-btn:hover {
  background-color: rgba(24,144,255,0.1);
}

.register-btn {
  color: #fff;
  background-color: #1890ff;
  border: 1px solid #1890ff;
}

.register-btn:hover {
  background-color: #40a9ff;
  border-color: #40a9ff;
}
</style>
