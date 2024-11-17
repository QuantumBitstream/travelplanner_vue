<template>
  <div class="register-page">
    <div class="register-card">
      <div class="header">
        <h2>注册</h2>
      </div>

      <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm" label-width="100px">
        <!-- 用户名输入 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" autocomplete="off" placeholder="请输入用户名" />
        </el-form-item>

        <!-- 邮箱输入 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email" autocomplete="off" placeholder="请输入邮箱" />
        </el-form-item>

        <!-- 密码输入 -->
        <el-form-item label="密码" prop="password">
          <el-input
              v-model="registerForm.password"
              type="password"
              autocomplete="off"
              placeholder="请输入密码"
          />
        </el-form-item>

        <!-- 确认密码输入 -->
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              autocomplete="off"
              placeholder="请再次输入密码"
          />
        </el-form-item>

        <!-- 角色选择 -->
        <el-form-item label="角色" prop="role">
          <el-select v-model="registerForm.role" placeholder="请选择角色">
            <el-option label="User" value="role_user"></el-option>
            <el-option label="Admin" value="role_admin"></el-option>
          </el-select>
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleRegister">注册</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterView',
  data() {
    return {
      registerForm: {
        username: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '用户名长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于 6 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== this.registerForm.password) {
                callback(new Error('两次输入的密码不一致'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    handleRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          alert('注册成功！')
          // 跳转到登录页面
          this.$router.push('/login')
          // 这里可以处理注册逻辑，比如调用API
        } else {
          alert('请填写正确的信息。')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.registerForm.resetFields()
    }
  }
}
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f7f7f7;
}

.register-card {
  width: 450px;
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
