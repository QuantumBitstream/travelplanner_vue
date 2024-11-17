<template>
  <div class="login-page">
    <div class="login-card">
      <div class="header">
        <h2>登录</h2>
      </div>

      <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="80px">
        <!-- 用户名输入 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" autocomplete="off" placeholder="请输入用户名" />
        </el-form-item>

        <!-- 密码输入 -->
        <el-form-item label="密码" prop="password">
          <el-input
              v-model="loginForm.password"
              type="password"
              autocomplete="off"
              placeholder="请输入密码"
          />
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleLogin">立即登录</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'LoginView',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn', 'username'])
  },
  methods: {
    ...mapActions('user', ['login']),
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // 模拟登录成功

          /*
          更新 store 使得NavBar组件实时及时更新
          <div class="navbar-user">
            <template v-if="store.state.user.isLoggedIn">
           */
          console.log(' 更新 store 使得NavBar组件实时及时更新... ' )
          this.login({
            username: this.loginForm.username,
            password: this.loginForm.password
          });
          // 跳转到Home页面
          this.$router.push('/');
        } else {
          alert('请填写必填项。');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.loginForm.resetFields();
    }
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f7f7f7;
}

.login-card {
  width: 400px;
  padding: 40px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  color: #333;
}
</style>
