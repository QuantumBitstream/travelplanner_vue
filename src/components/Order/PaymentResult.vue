<template>
  <div class="payment-result-container">
    <el-card class="result-card">
      <!-- 支付成功 -->
      <div v-if="paymentStatus === 'PAID'" class="result success">
        <el-icon class="result-icon success-icon"><CircleCheckFilled /></el-icon>
        <h2>支付成功</h2>
        <p>您的旅行已经预订成功，感谢您的支持！</p>
        <div class="order-detail">
          <p>订单号: {{ orderId }}</p>
          <p>产品: {{ orderDetail.subject }}</p>
          <p>金额: ¥{{ orderDetail.amount }}</p>
        </div>
        <div class="actions">
          <el-button type="primary" @click="goToOrderDetail">查看订单详情</el-button>
          <el-button @click="goHome">返回首页</el-button>
        </div>
      </div>

      <!-- 支付失败 -->
      <div v-else-if="paymentStatus === 'FAILED'" class="result failed">
        <el-icon class="result-icon failed-icon"><CircleCloseFilled /></el-icon>
        <h2>支付失败</h2>
        <p>抱歉，您的支付未能完成</p>
        <div class="actions">
          <el-button type="primary" @click="retryPayment">重新支付</el-button>
          <el-button @click="goHome">返回首页</el-button>
        </div>
      </div>

      <!-- 支付处理中 -->
      <div v-else-if="paymentStatus === 'PENDING'" class="result pending">
        <el-icon class="result-icon pending-icon"><Loading /></el-icon>
        <h2>支付处理中</h2>
        <p>您的支付正在处理，请稍候...</p>
        <div class="countdown">{{ countdown }}秒后自动刷新</div>
      </div>

      <!-- 查询中 -->
      <div v-else class="result loading">
        <el-icon class="result-icon loading-icon"><Loading /></el-icon>
        <h2>查询支付结果</h2>
        <p>正在查询支付结果，请稍候...</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { CircleCheckFilled, CircleCloseFilled, Loading } from '@element-plus/icons-vue'

const store = useStore()
const router = useRouter()
const route = useRoute()

// 获取订单ID (从URL参数或Vuex)
const orderId = ref(route.query.orderId || store.state.booking.currentOrderId)

// 支付状态
const paymentStatus = ref('')

// 订单详情
const orderDetail = ref({})

// 倒计时
const countdown = ref(10)
let timer = null

// 查询支付结果
const queryPaymentResult = async () => {
  try {
    if (!orderId.value) {
      console.error('订单ID不存在')
      return
    }

    const result = await store.dispatch('booking/queryPaymentResult', orderId.value)
    paymentStatus.value = result.status
    orderDetail.value = result

    // 如果还在处理中，设置倒计时重新查询
    if (result.status === 'PENDING') {
      startCountdown()
    }
  } catch (error) {
    console.error('查询支付结果失败:', error)
    paymentStatus.value = 'FAILED'
  }
}

// 开始倒计时
const startCountdown = () => {
  clearTimeout(timer)
  countdown.value = 10

  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      queryPaymentResult()
    }
  }, 1000)
}

// 重新支付
const retryPayment = () => {
  router.push({
    name: 'Booking'
  })
}

// 查看订单详情
const goToOrderDetail = () => {
  router.push({
    name: 'OrderDetail',
    params: { id: orderId.value }
  })
}

// 返回首页
const goHome = () => {
  router.push('/')
}

// 组件挂载时查询支付结果
onMounted(() => {
  queryPaymentResult()
})

// 组件销毁前清除定时器
onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.payment-result-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 0 15px;
}

.result-card {
  text-align: center;
  padding: 30px;
}

.result {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.result-icon {
  font-size: 70px;
  margin-bottom: 20px;
}

.success-icon {
  color: #67C23A;
}

.failed-icon {
  color: #F56C6C;
}

.pending-icon,
.loading-icon {
  color: #409EFF;
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

h2 {
  margin-bottom: 10px;
  font-size: 24px;
  color: #303133;
}

p {
  color: #606266;
  margin-bottom: 20px;
}

.order-detail {
  background: #f8f9fa;
  padding: 15px 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 300px;
  margin: 15px 0 25px;
  text-align: left;
}

.order-detail p {
  margin: 8px 0;
  color: #606266;
}

.actions {
  margin-top: 20px;
  display: flex;
  gap: 15px;
}

.countdown {
  margin-top: 20px;
  color: #909399;
  font-size: 14px;
}
</style>
