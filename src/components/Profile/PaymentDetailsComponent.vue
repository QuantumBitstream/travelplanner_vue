<template>
  <div class="payment-details-container">
    <!-- 返回按钮 -->
    <div class="back-navigation">
      <el-button @click="goBack" icon="ArrowLeft" text>返回</el-button>
    </div>

    <!-- 支付详情卡片 -->
    <el-card class="details-card" v-loading="loading">
      <template #header>
        <div class="details-header">
          <h2>支付详情</h2>
          <el-tag :type="getStatusType(paymentDetails.status)" effect="dark" size="large">
            {{ paymentDetails.status }}
          </el-tag>
        </div>
      </template>

      <!-- 订单基本信息 -->
      <section class="details-section">
        <h3 class="section-title">基本信息</h3>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="交易编号">
            {{ paymentDetails.id }}
          </el-descriptions-item>
          <el-descriptions-item label="交易时间">
            {{ paymentDetails.date }}
          </el-descriptions-item>
          <el-descriptions-item label="商品名称">
            {{ paymentDetails.name }}
          </el-descriptions-item>
          <el-descriptions-item label="支付金额">
            <span class="amount" :class="getAmountClass(paymentDetails.amount)">
              {{ formatAmount(paymentDetails.amount) }}
            </span>
          </el-descriptions-item>
        </el-descriptions>
      </section>

      <!-- 支付方式信息 -->
      <section class="details-section">
        <h3 class="section-title">支付方式</h3>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="支付方式">
            <div class="payment-method">
              <img
                  :src="getPaymentMethodIcon(paymentDetails.paymentMethod)"
                  class="payment-icon"
                  alt="支付方式图标"
              />
              {{ getPaymentMethodName(paymentDetails.paymentMethod) }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="支付账号">
            {{ maskAccount(paymentDetails.paymentAccount) }}
          </el-descriptions-item>
        </el-descriptions>
      </section>

      <!-- 交易进度时间线 -->
      <section class="details-section">
        <h3 class="section-title">交易进度</h3>
        <el-timeline>
          <el-timeline-item
              v-for="(activity, index) in paymentDetails.timeline"
              :key="index"
              :type="activity.type"
              :timestamp="activity.timestamp"
              :hollow="activity.hollow"
          >
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
      </section>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button
            type="primary"
            icon="Document"
            @click="downloadReceipt"
        >
          下载电子凭证
        </el-button>
        <el-button
            v-if="showRefundButton"
            type="danger"
            plain
            icon="RefreshLeft"
            @click="requestRefund"
        >
          申请退款
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
// import { ArrowLeft, Document, RefreshLeft } from '@element-plus/icons-vue'

// 路由相关
const route = useRoute()
const router = useRouter()
const transactionId = computed(() => route.params.id)
const loading = ref(true)

// 支付详情数据
const paymentDetails = ref({
  id: '',
  name: '',
  amount: 0,
  status: '',
  date: '',
  paymentMethod: '',
  paymentAccount: '',
  timeline: []
})

/**
 * 获取交易详情数据
 */
const fetchPaymentDetails = async () => {
  try {
    loading.value = true
    // 模拟API请求获取支付详情
    // 实际项目中应该调用真实API
    await new Promise(resolve => setTimeout(resolve, 800))

    // 模拟数据
    if (transactionId.value === 'tx-001') {
      paymentDetails.value = {
        id: 'tx-001',
        name: '购买会员服务',
        amount: -99.00,
        status: '成功',
        date: '2025-07-20 10:28:33',
        paymentMethod: 'alipay',
        paymentAccount: '186****5678',
        timeline: [
          { content: '订单创建', timestamp: '2025-07-20 10:25:12', type: 'primary' },
          { content: '支付处理中', timestamp: '2025-07-20 10:27:45', type: 'warning' },
          { content: '支付成功', timestamp: '2025-07-20 10:28:33', type: 'success' },
          { content: '会员权限已激活', timestamp: '2025-07-20 10:28:40', type: 'success' }
        ]
      }
    } else if (transactionId.value === 'tx-002') {
      paymentDetails.value = {
        id: 'tx-002',
        name: '收到退款',
        amount: 129.90,
        status: '已完成',
        date: '2025-07-15 16:45:21',
        paymentMethod: 'wechat',
        paymentAccount: '微信支付(136****4321)',
        timeline: [
          { content: '退款申请提交', timestamp: '2025-07-14 14:22:33', type: 'primary' },
          { content: '商家确认退款', timestamp: '2025-07-15 09:15:40', type: 'warning' },
          { content: '退款处理中', timestamp: '2025-07-15 10:30:12', type: 'warning' },
          { content: '退款成功', timestamp: '2025-07-15 16:45:21', type: 'success' }
        ]
      }
    } else if (transactionId.value === 'tx-003') {
      paymentDetails.value = {
        id: 'tx-003',
        name: '购买课程包',
        amount: -299.00,
        status: '处理中',
        date: '2025-07-10 09:18:05',
        paymentMethod: 'creditcard',
        paymentAccount: '招商银行(****8546)',
        timeline: [
          { content: '订单创建', timestamp: '2025-07-10 09:15:22', type: 'primary' },
          { content: '支付处理中', timestamp: '2025-07-10 09:18:05', type: 'warning', hollow: false },
          { content: '等待系统确认', timestamp: '预计完成时间：2025-07-24', type: 'info', hollow: true }
        ]
      }
    } else {
      ElMessage.error('未找到交易记录')
      router.push('/profile')
    }
  } catch (error) {
    ElMessage.error('获取支付详情失败：' + (error.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

/**
 * 获取交易状态对应的Element UI标签类型
 * @param {string} status - 交易状态
 * @returns {string} - 对应的标签类型
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
 * 获取支付方式图标
 * @param {string} method - 支付方式代码
 * @returns {string} - 图标URL
 */
const getPaymentMethodIcon = (method) => {
  const icons = {
    'alipay': 'https://img.alicdn.com/imgextra/i2/O1CN01rrRYtT1fp5No0Bf8S_!!6000000004060-2-tps-120-120.png',
    'wechat': 'https://img.alicdn.com/imgextra/i2/O1CN01sBxrPw1GcdmFsXwYP_!!6000000000645-2-tps-120-120.png',
    'creditcard': 'https://img.alicdn.com/imgextra/i1/O1CN01eXYZz21YrWJJJKl07_!!6000000003112-2-tps-120-120.png'
  }
  return icons[method] || ''
}

/**
 * 获取支付方式名称
 * @param {string} method - 支付方式代码
 * @returns {string} - 支付方式名称
 */
const getPaymentMethodName = (method) => {
  const names = {
    'alipay': '支付宝',
    'wechat': '微信支付',
    'creditcard': '银行卡'
  }
  return names[method] || '其他支付方式'
}

/**
 * 掩码处理账号信息，保护隐私
 * @param {string} account - 账号信息
 * @returns {string} - 掩码后的账号
 */
const maskAccount = (account) => {
  return account || '未知账号'
}

/**
 * 是否显示退款按钮
 */
const showRefundButton = computed(() => {
  return (paymentDetails.value.amount < 0) &&
      (paymentDetails.value.status === '成功') &&
      !paymentDetails.value.name.includes('退款')
})

/**
 * 返回上一页
 */
const goBack = () => {
  router.go(-1)
}

/**
 * 下载电子凭证
 */
const downloadReceipt = () => {
  ElMessage.success('电子凭证下载中...')
  // 实际项目中应该调用API下载PDF凭证
}

/**
 * 申请退款
 */
const requestRefund = () => {
  ElMessageBox.confirm(
      '确定要申请退款吗？退款申请提交后将无法撤销。',
      '退款确认',
      {
        confirmButtonText: '确定申请',
        cancelButtonText: '取消',
        type: 'warning'
      }
  ).then(() => {
    ElMessage.success('退款申请已提交，请等待处理')
  }).catch(() => {})
}

// 组件挂载时获取支付详情
onMounted(() => {
  fetchPaymentDetails()
})
</script>

<style scoped>
.payment-details-container {
  max-width: 800px;
  margin: 30px auto;
  padding: 0 20px;
}

.back-navigation {
  margin-bottom: 20px;
}

.details-card {
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.details-header h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.section-title {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #606266;
  position: relative;
  padding-left: 12px;
  font-weight: 500;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 16px;
  width: 4px;
  background-color: #409EFF;
  border-radius: 2px;
}

.details-section {
  margin-bottom: 30px;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 10px;
}

.payment-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.amount {
  font-weight: bold;
  font-size: 16px;
}

.income {
  color: #67c23a;
}

.expense {
  color: #f56c6c;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .payment-details-container {
    padding: 0 10px;
    margin: 20px auto;
  }

  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
