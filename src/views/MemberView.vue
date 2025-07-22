<template>
  <div class="profile-page">
    <!-- 个人资料卡片 -->
    <el-card class="profile-card">
      <!-- 顶部用户信息展示区域 -->
      <div class="user-info-header">
        <el-avatar
            :size="86"
            :src="avatarUrl || defaultAvatar"
            class="user-avatar"
        />
        <div class="user-meta">
          <h2>{{ profileForm.username }}</h2>
          <el-tag effect="light" type="primary" class="user-role">普通用户</el-tag>
          <p class="join-time">注册时间：{{ formatDate(joinTime) }}</p>
        </div>
      </div>

      <el-divider>个人资料信息</el-divider>

      <!-- 个人资料表单 -->
      <el-form
          :model="profileForm"
          :rules="rules"
          ref="profileFormRef"
          label-position="top"
          class="profile-form"
      >
        <!-- 用户名字段 -->
        <el-form-item label="用户名">
          <el-input
              v-model="profileForm.username"
              disabled
              prefix-icon="el-icon-user"
          />
        </el-form-item>

        <!-- 电子邮件字段 -->
        <el-form-item label="电子邮件" prop="email">
          <el-input
              v-model="profileForm.email"
              placeholder="请输入邮箱"
              prefix-icon="el-icon-message"
              clearable
          />
        </el-form-item>

        <!-- 操作按钮区域 -->
        <el-form-item>
          <div class="action-buttons">
            <el-button
                type="primary"
                :loading="submitLoading"
                @click="updateProfile"
                icon="el-icon-check"
            >保存更改</el-button>
            <el-button
                @click="resetForm"
                icon="el-icon-refresh-right"
            >重置</el-button>
          </div>
        </el-form-item>
      </el-form>

      <!-- 快捷功能区域 -->
      <div class="quick-links">
        <h3>快捷功能</h3>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card shadow="hover" class="quick-card" @click="goToPayment">
              <template #header>
                <div class="card-header">
                  <i class="el-icon-wallet"></i>
                  <span>支付管理</span>
                </div>
              </template>
              <div class="card-body">查看订单和支付详情</div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="quick-card">
              <template #header>
                <div class="card-header">
                  <i class="el-icon-lock"></i>
                  <span>安全设置</span>
                </div>
              </template>
              <div class="card-body">更改密码和安全选项</div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="quick-card">
              <template #header>
                <div class="card-header">
                  <i class="el-icon-bell"></i>
                  <span>消息通知</span>
                </div>
              </template>
              <div class="card-body">管理系统消息和提醒</div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

// 路由和store实例
const router = useRouter()
const store = useStore()

// 表单ref
const profileFormRef = ref(null)
// 提交状态
const submitLoading = ref(false)

// 默认头像
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
// 用户头像URL（从Vuex获取或使用默认值）
const avatarUrl = computed(() => store.state.profile.profileForm.avatar || defaultAvatar)
// 用户注册时间
const joinTime = computed(() => store.state.profile.joinTime || new Date())

// 从Vuex获取profileForm和rules
const profileForm = computed(() => store.state.profile.profileForm)
const rules = computed(() => store.state.profile.rules)

/**
 * 格式化日期为可读格式
 * @param {Date} date - 需要格式化的日期
 * @returns {string} - 格式化后的日期字符串
 */
const formatDate = (date) => {
  if (!date) return '未知'
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * 更新个人资料
 * 验证表单并提交到Vuex action
 */
const updateProfile = () => {
  profileFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        submitLoading.value = true
        // 调用Vuex action更新用户资料
        await store.dispatch('profile/updateUserProfile', profileForm.value.email)
        ElMessage({
          type: 'success',
          message: '个人资料已成功更新！',
          duration: 2000
        })
      } catch (error) {
        ElMessage({
          type: 'error',
          message: error.message || '更新失败，请重试',
          duration: 3000
        })
      } finally {
        submitLoading.value = false
      }
    } else {
      ElMessage({
        type: 'warning',
        message: '请填写正确的信息',
        duration: 2000
      })
      return false
    }
  })
}

/**
 * 重置表单
 * 调用Element Plus表单重置和Vuex action
 */
const resetForm = () => {
  profileFormRef.value.resetFields()
  store.dispatch('profile/resetProfileForm')
}

/**
 * 跳转到支付详情页
 */
const goToPayment = () => {
  router.push('/payment-details')
}

// 组件挂载时加载用户资料
onMounted(() => {
  store.dispatch('profile/loadUserProfile')
})
</script>

<style scoped>
.profile-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 30px 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #eef2f5 100%);
}

.profile-card {
  width: 800px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.user-info-header {
  display: flex;
  align-items: center;
  padding: 20px 0;
}

.user-avatar {
  border: 4px solid #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-right: 25px;
}

.user-meta {
  flex: 1;
}

.user-meta h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #303133;
}

.user-role {
  margin: 0 0 8px 0;
}

.join-time {
  color: #909399;
  font-size: 14px;
  margin: 5px 0 0 0;
}

.profile-form {
  margin-top: 20px;
  padding: 0 10px;
}

.action-buttons {
  display: flex;
  justify-content: flex-start;
  gap: 15px;
  margin-top: 10px;
}

.quick-links {
  margin-top: 30px;
}

.quick-links h3 {
  font-weight: 600;
  color: #303133;
  margin-bottom: 15px;
  font-size: 18px;
}

.quick-card {
  cursor: pointer;
  transition: all 0.3s;
  height: 100%;
}

.quick-card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: 600;
}

.card-header i {
  margin-right: 5px;
  color: #409EFF;
}

.card-body {
  font-size: 13px;
  color: #606266;
  padding: 5px 0;
}
</style>
