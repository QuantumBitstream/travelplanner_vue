<template>
  <div class="profile-page">
    <el-card class="profile-card">
      <div class="header">
        <h2>个人资料</h2>
      </div>

      <el-form :model="profileForm" ref="profileForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="profileForm.username" disabled />
        </el-form-item>

        <el-form-item label="电子邮件" prop="email">
          <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="电话" prop="phone">
          <el-input v-model="profileForm.phone" placeholder="请输入电话号码" />
        </el-form-item>

        <!-- 保存按钮 -->
        <el-form-item>
          <el-button type="primary" @click="updateProfile">保存</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ProfileView',
  data() {
    return {
      profileForm: {
        username: 'exampleUser',  // 初始用户名假设从后端获取
        email: '',
        phone: ''
      },
      rules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
        ],
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { pattern: /^[0-9]+$/, message: '电话号码只能包含数字', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    updateProfile() {
      this.$refs.profileForm.validate((valid) => {
        if (valid) {
          alert('个人资料已更新！')
          // 这里可以调用API保存更新后的资料
        } else {
          alert('请填写正确的信息。')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.profileForm.resetFields()
    },
    // 假设从服务器加载当前用户数据
    loadUserProfile() {
      // 模拟异步获取用户数据
      setTimeout(() => {
        this.profileForm = {
          username: 'exampleUser',
          email: 'user@example.com',
          phone: '1234567890'
        }
      }, 500)
    }
  },
  mounted() {
    this.loadUserProfile()
  }
}
</script>

<style scoped>
.profile-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f7f7f7;
}

.profile-card {
  width: 500px;
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
