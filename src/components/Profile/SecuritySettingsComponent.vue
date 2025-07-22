<template>
  <div class="security-settings-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="back-button" @click="goBack">
        <i class="el-icon-arrow-left"></i>
        <span>返回</span>
      </div>
      <h1>安全设置</h1>
    </div>

    <!-- 安全状态概览卡片 -->
    <el-card class="security-overview" shadow="hover">
      <div class="overview-header">
        <div class="security-score">
          <el-progress
              type="dashboard"
              :percentage="securityScore"
              :color="securityScoreColors"
              :stroke-width="8"
          >
            <template #default>
              <div class="security-score-text">
                <div class="score-value">{{ securityScore }}</div>
                <div class="score-label">安全分</div>
              </div>
            </template>
          </el-progress>
        </div>
        <div class="security-tips">
          <h3>
            <i :class="securityLevelIcon"></i>
            <span>{{ securityLevelText }}</span>
          </h3>
          <p v-if="securityTips">{{ securityTips }}</p>
          <el-button
              type="primary"
              size="small"
              v-if="securityScore < 100"
              @click="improveSecurityLevel"
          >提升安全等级</el-button>
        </div>
      </div>
    </el-card>

    <!-- 安全设置列表 -->
    <el-card class="settings-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>账户安全</span>
        </div>
      </template>

      <!-- 登录密码设置 -->
      <div class="security-item">
        <div class="item-info">
          <div class="item-icon password-icon">
            <i class="el-icon-lock"></i>
          </div>
          <div class="item-content">
            <h4>登录密码</h4>
            <p>定期修改密码可以提高账户安全性，建议您每三个月修改一次密码</p>
            <div class="last-updated" v-if="passwordLastChanged">
              上次修改时间：{{ formatDate(passwordLastChanged) }}
            </div>
          </div>
        </div>
        <div class="item-action">
          <el-button size="small" type="primary" @click="showPasswordDialog">修改密码</el-button>
        </div>
      </div>

      <!-- 手机号验证 -->
      <div class="security-item">
        <div class="item-info">
          <div class="item-icon phone-icon">
            <i class="el-icon-mobile-phone"></i>
          </div>
          <div class="item-content">
            <h4>手机验证</h4>
            <p>绑定手机后，可通过手机验证码找回密码，接收账户通知</p>
            <div class="item-status" v-if="userInfo.phone">
              <el-tag size="small" type="success">已绑定</el-tag>
              <span class="masked-info">{{ maskPhone(userInfo.phone) }}</span>
            </div>
            <div class="item-status" v-else>
              <el-tag size="small" type="danger">未绑定</el-tag>
            </div>
          </div>
        </div>
        <div class="item-action">
          <el-button
              size="small"
              type="primary"
              v-if="!userInfo.phone"
              @click="showBindPhoneDialog"
          >绑定手机</el-button>
          <el-button
              size="small"
              type="primary"
              plain
              v-else
              @click="showUpdatePhoneDialog"
          >修改</el-button>
        </div>
      </div>

      <!-- 邮箱验证 -->
      <div class="security-item">
        <div class="item-info">
          <div class="item-icon email-icon">
            <i class="el-icon-message"></i>
          </div>
          <div class="item-content">
            <h4>邮箱验证</h4>
            <p>绑定邮箱后，可通过邮箱找回密码，接收重要通知</p>
            <div class="item-status" v-if="userInfo.email">
              <el-tag size="small" type="success">已绑定</el-tag>
              <span class="masked-info">{{ maskEmail(userInfo.email) }}</span>
            </div>
            <div class="item-status" v-else>
              <el-tag size="small" type="danger">未绑定</el-tag>
            </div>
          </div>
        </div>
        <div class="item-action">
          <el-button
              size="small"
              type="primary"
              v-if="!userInfo.email"
              @click="showBindEmailDialog"
          >绑定邮箱</el-button>
          <el-button
              size="small"
              type="primary"
              plain
              v-else
              @click="showUpdateEmailDialog"
          >修改</el-button>
        </div>
      </div>

      <!-- 两步验证 -->
      <div class="security-item">
        <div class="item-info">
          <div class="item-icon mfa-icon">
            <i class="el-icon-key"></i>
          </div>
          <div class="item-content">
            <h4>两步验证</h4>
            <p>开启后，登录时会额外要求验证码，极大提高账户安全性</p>
            <div class="item-status">
              <el-switch
                  v-model="userInfo.twoFactorEnabled"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="toggleTwoFactor"
              ></el-switch>
              <span class="switch-status">{{ userInfo.twoFactorEnabled ? '已开启' : '未开启' }}</span>
            </div>
          </div>
        </div>
        <div class="item-action">
          <el-button
              size="small"
              type="primary"
              plain
              v-if="userInfo.twoFactorEnabled"
              @click="showTwoFactorSetupDialog"
          >管理设备</el-button>
        </div>
      </div>

      <!-- 登录历史 -->
      <div class="security-item">
        <div class="item-info">
          <div class="item-icon history-icon">
            <i class="el-icon-time"></i>
          </div>
          <div class="item-content">
            <h4>登录历史</h4>
            <p>您可以查看最近的登录记录，发现异常及时处理</p>
            <div class="login-history" v-if="recentLogin">
              上次登录时间：{{ formatDate(recentLogin.time) }}
              <el-tag size="small" type="info">{{ recentLogin.device }}</el-tag>
              <el-tag size="small" type="info">{{ recentLogin.location }}</el-tag>
            </div>
          </div>
        </div>
        <div class="item-action">
          <el-button size="small" @click="viewLoginHistory">查看更多</el-button>
        </div>
      </div>
    </el-card>

    <!-- 修改密码对话框 -->
    <el-dialog
        v-model="passwordDialogVisible"
        title="修改登录密码"
        width="420px"
        destroy-on-close
    >
      <el-form
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordRules"
          label-position="top"
          status-icon
      >
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input
              v-model="passwordForm.currentPassword"
              type="password"
              show-password
              placeholder="请输入当前密码"
              clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
              v-model="passwordForm.newPassword"
              type="password"
              show-password
              placeholder="请设置8-20位密码，包含字母和数字"
              clearable
          ></el-input>
          <div class="password-strength">
            <div class="strength-label">密码强度:</div>
            <div class="strength-meter">
              <div
                  class="strength-bar"
                  :class="passwordStrengthClass"
                  :style="{width: passwordStrength + '%'}"
              ></div>
            </div>
            <div class="strength-text" :class="passwordStrengthClass">{{ passwordStrengthText }}</div>
          </div>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
              v-model="passwordForm.confirmPassword"
              type="password"
              show-password
              placeholder="请再次输入新密码"
              clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="passwordDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="changePassword">确定修改</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 登录历史弹窗 -->
    <el-dialog
        v-model="loginHistoryVisible"
        title="登录历史"
        width="680px"
    >
      <el-table :data="loginHistory" stripe style="width: 100%">
        <el-table-column prop="time" label="登录时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.time) }}
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="IP地址" width="130"></el-table-column>
        <el-table-column prop="location" label="地点"></el-table-column>
        <el-table-column prop="device" label="设备"></el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.success ? 'success' : 'danger'" size="small">
              {{ scope.row.success ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

// 路由和store实例
const router = useRouter()
// const store = useStore()

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 用户信息
const userInfo = ref({
  username: 'example_user',
  email: 'user@example.com',
  phone: '13800138000',
  twoFactorEnabled: false
})

// 密码上次修改时间
const passwordLastChanged = ref('2025-06-15T10:30:00')

// 最近一次登录记录
const recentLogin = ref({
  time: '2025-07-21T14:30:00',
  ip: '192.168.1.1',
  device: '苹果iPhone',
  location: '北京市'
})

// 登录历史
const loginHistory = ref([
  {
    time: '2025-07-21T14:30:00',
    ip: '192.168.1.1',
    device: '苹果iPhone',
    location: '北京市',
    browser: 'Safari',
    success: true
  },
  {
    time: '2025-07-20T09:15:00',
    ip: '192.168.1.1',
    device: '苹果iPad',
    location: '北京市',
    browser: 'Safari',
    success: true
  },
  {
    time: '2025-07-15T22:45:00',
    ip: '211.94.116.218',
    device: '微软Windows',
    location: '上海市',
    browser: 'Chrome',
    success: true
  },
  {
    time: '2025-07-10T08:20:00',
    ip: '58.100.32.145',
    device: '安卓手机',
    location: '广州市',
    browser: 'Chrome',
    success: false
  }
])

// 对话框可见状态
const passwordDialogVisible = ref(false)
const loginHistoryVisible = ref(false)
const submitLoading = ref(false)

// 密码表单
const passwordFormRef = ref(null)
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码验证规则
const passwordRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 8, message: '密码长度不能小于8个字符', trigger: 'blur' },
    { pattern: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/, message: '密码必须包含字母和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

/**
 * 计算密码强度（0-100）
 */
const passwordStrength = computed(() => {
  const password = passwordForm.newPassword
  if (!password) return 0

  let score = 0
  // 基础长度分数
  if (password.length >= 8) score += 20
  if (password.length >= 12) score += 10

  // 复杂度分数
  if (/[A-Z]/.test(password)) score += 15
  if (/[a-z]/.test(password)) score += 10
  if (/[0-9]/.test(password)) score += 10
  if (/[^A-Za-z0-9]/.test(password)) score += 15

  // 多样性加分
  const varietyCount = [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(regex =>
      regex.test(password)
  ).length
  score += varietyCount * 5

  return Math.min(score, 100)
})

/**
 * 密码强度文本
 */
const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength < 40) return '弱'
  if (strength < 70) return '中'
  return '强'
})

/**
 * 密码强度CSS类
 */
const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value
  if (strength < 40) return 'weak'
  if (strength < 70) return 'medium'
  return 'strong'
})

/**
 * 安全评分（0-100）
 */
const securityScore = computed(() => {
  let score = 0

  // 是否设置了密码
  score += 20

  // 绑定手机
  if (userInfo.value.phone) score += 20

  // 绑定邮箱
  if (userInfo.value.email) score += 20

  // 两步验证
  if (userInfo.value.twoFactorEnabled) score += 40

  return score
})

/**
 * 安全等级文本
 */
const securityLevelText = computed(() => {
  const score = securityScore.value
  if (score < 40) return '安全级别低'
  if (score < 70) return '安全级别中'
  if (score < 100) return '安全级别高'
  return '安全级别最高'
})

/**
 * 安全等级图标
 */
const securityLevelIcon = computed(() => {
  const score = securityScore.value
  if (score < 40) return 'el-icon-warning'
  if (score < 70) return 'el-icon-info'
  return 'el-icon-success'
})

/**
 * 安全评分颜色
 */
const securityScoreColors = computed(() => {
  return [
    {color: '#F56C6C', percentage: 40},
    {color: '#E6A23C', percentage: 70},
    {color: '#67C23A', percentage: 100}
  ]
})

/**
 * 安全提示
 */
const securityTips = computed(() => {
  const score = securityScore.value
  if (score < 40) return '您的账户安全级别较低，建议进行安全设置'
  if (score < 70) return '您的账户安全有待提升，建议开启两步验证'
  if (score < 100) return '您的账户安全状况良好，可以进一步提升'
  return null
})

/**
 * 格式化日期
 * @param {Date|string} date - 日期对象或字符串
 * @returns {string} - 格式化后的日期字符串
 */
const formatDate = (date) => {
  if (!date) return '未知'
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}`
}

/**
 * 隐藏手机号中间四位
 */
const maskPhone = (phone) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 隐藏邮箱用户名部分
 */
const maskEmail = (email) => {
  if (!email) return ''
  const [username, domain] = email.split('@')
  const maskedUsername = username.substring(0, 3) + '****'
  return `${maskedUsername}@${domain}`
}

/**
 * 显示修改密码对话框
 */
const showPasswordDialog = () => {
  passwordDialogVisible.value = true
}

/**
 * 显示绑定手机对话框
 */
const showBindPhoneDialog = () => {
  ElMessage.info('绑定手机号功能开发中')
}

/**
 * 显示修改手机对话框
 */
const showUpdatePhoneDialog = () => {
  ElMessage.info('修改手机号功能开发中')
}

/**
 * 显示绑定邮箱对话框
 */
const showBindEmailDialog = () => {
  ElMessage.info('绑定邮箱功能开发中')
}

/**
 * 显示修改邮箱对话框
 */
const showUpdateEmailDialog = () => {
  ElMessage.info('修改邮箱功能开发中')
}

/**
 * 显示两步验证设置对话框
 */
const showTwoFactorSetupDialog = () => {
  ElMessage.info('两步验证设置功能开发中')
}

/**
 * 切换两步验证状态
 */
const toggleTwoFactor = (status) => {
  ElMessage.success(status ? '已开启两步验证' : '已关闭两步验证')
}

/**
 * 查看登录历史
 */
const viewLoginHistory = () => {
  loginHistoryVisible.value = true
}

/**
 * 提升安全等级
 */
const improveSecurityLevel = () => {
  if (!userInfo.value.phone) {
    showBindPhoneDialog()
    return
  }

  if (!userInfo.value.email) {
    showBindEmailDialog()
    return
  }

  if (!userInfo.value.twoFactorEnabled) {
    userInfo.value.twoFactorEnabled = true
    toggleTwoFactor(true)
    return
  }
}

/**
 * 修改密码
 */
const changePassword = () => {
  passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        submitLoading.value = true
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 800))

        // 实际项目中应该调用Vuex action
        // await store.dispatch('security/updatePassword', passwordForm)

        ElMessage.success('密码修改成功')
        passwordDialogVisible.value = false

        // 更新密码最后修改时间
        passwordLastChanged.value = new Date().toISOString()
      } catch (error) {
        ElMessage.error('密码修改失败: ' + (error.message || '未知错误'))
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 组件挂载时加载数据
onMounted(() => {
  // 实际项目中应该从Vuex获取用户信息
  // store.dispatch('user/getUserInfo')
})
</script>

<style scoped>
.security-settings-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  position: relative;
}

.back-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: absolute;
  left: 0;
  color: #606266;
  transition: all 0.3s;
}

.back-button:hover {
  color: #409EFF;
}

.back-button i {
  margin-right: 5px;
}

.page-header h1 {
  margin: 0 auto;
  font-size: 24px;
  color: #303133;
  text-align: center;
  font-weight: 600;
}

.security-overview {
  margin-bottom: 20px;
  border-radius: 8px;
}

.overview-header {
  display: flex;
  align-items: center;
  padding: 10px;
}

.security-score {
  margin-right: 40px;
}

.security-score-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.score-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  line-height: 1;
}

.score-label {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.security-tips {
  flex: 1;
}

.security-tips h3 {
  display: flex;
  align-items: center;
  margin-top: 0;
  margin-bottom: 10px;
  font-weight: 500;
}

.security-tips h3 i {
  margin-right: 5px;
}

.security-tips p {
  color: #606266;
  margin-bottom: 15px;
}

.settings-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header span {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.security-item {
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  border-bottom: 1px solid #EBEEF5;
}

.security-item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  flex: 1;
}

.item-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f0f5ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0;
}

.item-icon i {
  font-size: 20px;
  color: #409EFF;
}

.phone-icon {
  background: #f0faff;
}

.phone-icon i {
  color: #1989fa;
}

.email-icon {
  background: #f0f9eb;
}

.email-icon i {
  color: #67C23A;
}

.mfa-icon {
  background: #fdf6ec;
}

.mfa-icon i {
  color: #E6A23C;
}

.history-icon {
  background: #f8f8f8;
}

.history-icon i {
  color: #909399;
}

.item-content {
  flex: 1;
}

.item-content h4 {
  margin: 0 0 8px;
  color: #303133;
  font-weight: 500;
}

.item-content p {
  margin: 0 0 8px;
  color: #909399;
  font-size: 13px;
}

.item-status {
  display: flex;
  align-items: center;
}

.masked-info {
  margin-left: 10px;
  color: #606266;
}

.switch-status {
  margin-left: 10px;
  color: #606266;
  font-size: 13px;
}

.login-history {
  font-size: 13px;
  color: #606266;
}

.login-history .el-tag {
  margin-left: 10px;
}

.last-updated {
  font-size: 13px;
  color: #909399;
}

.item-action {
  margin-left: 20px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

/* 密码强度样式 */
.password-strength {
  display: flex;
  align-items: center;
  margin-top: 8px;
  font-size: 12px;
}

.strength-label {
  color: #909399;
  margin-right: 8px;
}

.strength-meter {
  height: 4px;
  width: 100px;
  background: #EBEEF5;
  border-radius: 2px;
  overflow: hidden;
  margin-right: 8px;
}

.strength-bar {
  height: 100%;
  transition: all 0.3s;
}

.strength-text {
  font-weight: 500;
}

/* 密码强度颜色 */
.weak {
  color: #F56C6C;
  background-color: #F56C6C;
}

.medium {
  color: #E6A23C;
  background-color: #E6A23C;
}

.strong {
  color: #67C23A;
  background-color: #67C23A;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .overview-header {
    flex-direction: column;
  }

  .security-score {
    margin-right: 0;
    margin-bottom: 20px;
  }

  .security-item {
    flex-direction: column;
  }

  .item-action {
    margin-left: 0;
    margin-top: 15px;
  }
}
</style>
