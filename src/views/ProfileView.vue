

<!--

个人中心页面
页面结构优化：

采用卡片式布局与渐变背景，添加用户头像展示
使用标签页分离基本资料与交易历史
改进表单布局为更现代的自上而下结构
功能增强：

添加输入框前缀图标提升可识别性
支持手机号码验证，通过模式匹配保证格式正确
按钮添加加载状态，提高交互反馈
数据处理：

使用Composition API重写，提升代码可维护性
使用computed属性与store连接，保证响应式更新
统一状态管理，封装业务逻辑

支付详情页面
设计优化：

清晰的层级结构，分为基本信息、支付方式、交易进度
使用时间线展示交易流程的各个阶段
视觉差异化显示收入/支出金额
交互设计：

添加返回按钮方便导航
根据交易状态显示/隐藏退款按钮
退款操作有二次确认，防止误操作
隐私保护：

自动掩码处理敏感账号信息
清晰标识支付方式，配合图标增强可识别性

-->
<template>
  <div class="profile-container">
    <!-- 个人资料卡片 -->
    <el-card class="profile-card" :body-style="{ padding: '0px' }">
      <div class="profile-header">
        <div class="user-avatar">
          <el-avatar :size="80" :src="userAvatar">
            {{ profileForm.username?.charAt(0).toUpperCase() }}
          </el-avatar>
        </div>
        <h2 class="welcome-text">{{ profileForm.username }}的个人中心</h2>
      </div>

      <!-- 资料展示区 -->
      <div class="profile-body">
        <el-tabs v-model="activeTab" type="border-card">
          <!-- 基本资料标签页 -->
          <el-tab-pane label="基本资料" name="basic">
            <el-divider>个人资料信息</el-divider>
            <el-form
                :model="profileForm"
                :rules="rules"
                ref="profileFormRef"
                label-position="top"
                class="profile-form"
            >
              <el-form-item label="用户名">
                <el-input v-model="profileForm.username" disabled />
              </el-form-item>

              <el-form-item label="电子邮件" prop="email">
                <el-input
                    v-model="profileForm.email"
                    placeholder="请输入邮箱"
                    clearable
                >
                  <template #prefix>
                    <el-icon><Message /></el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item label="手机号码" prop="phone">
                <el-input
                    v-model="profileForm.phone"
                    placeholder="请输入手机号码"
                    clearable
                >
                  <template #prefix>
                    <el-icon><Phone /></el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item>
                <div class="form-actions">
                  <el-button
                      type="primary"
                      :loading="saveLoading"
                      @click="updateProfile"
                  >
                    保存更改
                  </el-button>
                  <el-button @click="resetForm">重置</el-button>
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

          </el-tab-pane>

          <!-- 最近交易标签页 -->
          <el-tab-pane label="最近交易" name="transactions">
            <div class="transaction-list">
              <el-empty v-if="!recentTransactions.length" description="暂无交易记录" />

              <el-timeline v-else>
                <el-timeline-item
                    v-for="(transaction, index) in recentTransactions"
                    :key="index"
                    :type="getTransactionType(transaction.status)"
                    :timestamp="transaction.date"
                >
                  <el-card class="transaction-card">
                    <div class="transaction-info">
                      <span class="transaction-name">{{ transaction.name }}</span>
                      <span class="transaction-amount" :class="getAmountClass(transaction.amount)">
                        {{ formatAmount(transaction.amount) }}
                      </span>
                    </div>
                    <div class="transaction-status">
                      <el-tag :type="getStatusType(transaction.status)">
                        {{ transaction.status }}
                      </el-tag>
                      <el-button
                          type="primary"
                          link
                          @click="viewTransactionDetails(transaction.id)"
                      >
                        查看详情
                      </el-button>
                    </div>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Message, Phone } from '@element-plus/icons-vue'

// 状态管理
const store = useStore()
const router = useRouter()
const profileFormRef = ref(null)
const activeTab = ref('basic')
const saveLoading = ref(false)

// 用户头像
const userAvatar = computed(() => store.state.profile.profileForm.avatar || '')

// 表单数据
const profileForm = computed(() => store.state.profile.profileForm)

// 表单验证规则
const rules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}

// 模拟交易数据
const recentTransactions = ref([
  {
    id: 'tx-001',
    name: '购买会员服务',
    amount: -99.00,
    status: '成功',
    date: '2025-07-20 10:28:33'
  },
  {
    id: 'tx-002',
    name: '收到退款',
    amount: 129.90,
    status: '已完成',
    date: '2025-07-15 16:45:21'
  },
  {
    id: 'tx-003',
    name: '购买课程包',
    amount: -299.00,
    status: '处理中',
    date: '2025-07-10 09:18:05'
  }
])

/**
 * 获取交易状态对应的样式类型
 * @param {string} status - 交易状态
 * @returns {string} - 对应的元素样式类型
 */
const getStatusType = (status) => {
  const types = {
    '成功': 'success',
    '已完成': 'success',
    '处理中': 'warning',
    '失败': 'danger'
  }
  return types[status] || 'info'
}

/**
 * 获取交易类型对应的时间线样式
 * @param {string} status - 交易状态
 * @returns {string} - 对应的时间线样式类型
 */
const getTransactionType = (status) => {
  if (status === '成功' || status === '已完成') return 'success'
  if (status === '处理中') return 'warning'
  if (status === '失败') return 'danger'
  return 'primary'
}

/**
 * 获取金额显示的样式类
 * @param {number} amount - 交易金额
 * @returns {string} - CSS类名
 */
const getAmountClass = (amount) => {
  return amount >= 0 ? 'income' : 'expense'
}

/**
 * 格式化金额显示
 * @param {number} amount - 交易金额
 * @returns {string} - 格式化后的金额
 */
const formatAmount = (amount) => {
  return amount >= 0 ? `+¥${amount.toFixed(2)}` : `-¥${Math.abs(amount).toFixed(2)}`
}

/**
 * 更新个人资料
 */
const updateProfile = () => {
  profileFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        saveLoading.value = true
        // 调用Vuex更新用户资料
        await store.dispatch('profile/updateUserProfile', {
          email: profileForm.value.email,
          phone: profileForm.value.phone
        })
        ElMessage.success('个人资料更新成功！')
      } catch (error) {
        ElMessage.error('更新失败：' + (error.message || '未知错误'))
      } finally {
        saveLoading.value = false
      }
    } else {
      ElMessage.warning('请完善表单信息')
    }
  })
}

/**
 * 重置表单
 */
const resetForm = () => {
  profileFormRef.value.resetFields()
  store.dispatch('profile/resetProfileForm')
}

/**
 * 查看交易详情
 * @param {string} id - 交易ID
 */
const viewTransactionDetails = (id) => {
  router.push(`/payment/details/${id}`)
}

/**
 * 组件挂载时加载用户资料
 */
onMounted(() => {
  store.dispatch('profile/loadUserProfile')
})
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px); /* 减去顶部导航的高度 */
  padding: 30px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #ebedee 100%);
}

.profile-card {
  width: 700px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.profile-header {
  background: linear-gradient(135deg, #3498db 0%, #1a5276 100%);
  color: white;
  padding: 30px;
  text-align: center;
  position: relative;
}

.user-avatar {
  margin-bottom: 15px;
}

.welcome-text {
  font-size: 24px;
  margin: 0;
  font-weight: 600;
}

.profile-body {
  padding: 0;
}

.profile-form {
  padding: 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  margin-top: 15px;
}

.transaction-list {
  padding: 20px;
}

.transaction-card {
  margin-bottom: 10px;
}

.transaction-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.transaction-name {
  font-weight: 500;
  font-size: 16px;
}

.transaction-amount {
  font-weight: bold;
  font-size: 16px;
}

.transaction-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.income {
  color: #67c23a;
}

.expense {
  color: #f56c6c;
}
</style>
