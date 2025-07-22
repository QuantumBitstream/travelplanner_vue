<template>
  <div class="payment-details-page">
    <!-- 标题区域 -->
    <div class="page-header">
      <div class="back-button" @click="goBack">
        <i class="el-icon-arrow-left"></i>
        <span>返回</span>
      </div>
      <h1>支付详情</h1>
    </div>

    <!-- 支付统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="8">
        <el-card shadow="hover" class="stats-card">
          <div class="stats-value">
            <span class="currency">¥</span>{{ totalAmount.toFixed(2) }}
          </div>
          <div class="stats-label">总支付金额</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8">
        <el-card shadow="hover" class="stats-card">
          <div class="stats-value">{{ payments.length }}</div>
          <div class="stats-label">支付笔数</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8">
        <el-card shadow="hover" class="stats-card">
          <div class="stats-value">{{ latestPaymentDate }}</div>
          <div class="stats-label">最近支付日期</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 支付详情表格 -->
    <el-card shadow="hover" class="payment-table-card">
      <template #header>
        <div class="card-header">
          <span>支付记录</span>
          <div class="header-actions">
            <el-input
                v-model="searchQuery"
                placeholder="搜索订单号/商品"
                clearable
                prefix-icon="el-icon-search"
                class="search-input"
            />
            <el-select v-model="filterStatus" placeholder="支付状态" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="成功" value="success"></el-option>
              <el-option label="处理中" value="processing"></el-option>
              <el-option label="失败" value="failed"></el-option>
            </el-select>
          </div>
        </div>
      </template>

      <!-- 表格主体 -->
      <el-table
          :data="filteredPayments"
          style="width: 100%"
          :empty-text="tableEmptyText"
          v-loading="tableLoading"
      >
        <el-table-column label="订单号" prop="orderNumber" min-width="180"></el-table-column>
        <el-table-column label="商品/服务" prop="productName" min-width="200"></el-table-column>
        <el-table-column label="金额" min-width="120">
          <template #default="scope">
            <span class="amount-cell">¥{{ scope.row.amount.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付方式" prop="paymentMethod" min-width="120"></el-table-column>
        <el-table-column label="支付日期" min-width="180">
          <template #default="scope">
            {{ formatDate(scope.row.paymentDate) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="120">
          <template #default="scope">
            <el-tag
                :type="getStatusType(scope.row.status)"
                effect="light"
            >
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="scope">
            <el-button
                size="small"
                type="primary"
                link
                @click="viewPaymentDetail(scope.row)"
            >查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="filteredPayments.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 支付详情对话框 -->
    <el-dialog
        v-model="dialogVisible"
        title="支付详情"
        width="600px"
        destroy-on-close
    >
      <div v-if="selectedPayment" class="payment-detail-dialog">
        <div class="dialog-header">
          <el-tag
              :type="getStatusType(selectedPayment.status)"
              effect="dark"
              size="large"
          >
            {{ getStatusText(selectedPayment.status) }}
          </el-tag>
          <h3>订单号：{{ selectedPayment.orderNumber }}</h3>
        </div>

        <el-descriptions :column="1" border>
          <el-descriptions-item label="商品/服务">{{ selectedPayment.productName }}</el-descriptions-item>
          <el-descriptions-item label="支付金额">¥{{ selectedPayment.amount.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="支付方式">{{ selectedPayment.paymentMethod }}</el-descriptions-item>
          <el-descriptions-item label="支付时间">{{ formatDate(selectedPayment.paymentDate) }}</el-descriptions-item>
          <el-descriptions-item label="支付账号">{{ selectedPayment.account }}</el-descriptions-item>
          <el-descriptions-item label="交易流水号">{{ selectedPayment.transactionId }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{ selectedPayment.remark || '无' }}</el-descriptions-item>
        </el-descriptions>

        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button
              type="primary"
              v-if="selectedPayment.invoice"
              @click="downloadInvoice"
          >下载发票</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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

// 表格加载状态
const tableLoading = ref(false)
// 支付列表数据
const payments = ref([])
// 搜索和筛选
const searchQuery = ref('')
const filterStatus = ref('')
// 分页
const currentPage = ref(1)
const pageSize = ref(10)
// 详情弹窗
const dialogVisible = ref(false)
const selectedPayment = ref(null)

/**
 * 计算总支付金额
 */
const totalAmount = computed(() => {
  return payments.value.reduce((sum, payment) => sum + payment.amount, 0)
})

/**
 * 获取最近支付日期
 */
const latestPaymentDate = computed(() => {
  if (payments.value.length === 0) return '无记录'

  const dates = payments.value.map(p => new Date(p.paymentDate))
  const latest = new Date(Math.max(...dates))
  return formatDate(latest)
})

/**
 * 表格空状态文本
 */
const tableEmptyText = computed(() => {
  if (tableLoading.value) return '加载中...'
  if (searchQuery.value || filterStatus.value) return '没有找到匹配的支付记录'
  return '暂无支付记录'
})

/**
 * 根据搜索和筛选条件过滤支付列表
 */
const filteredPayments = computed(() => {
  let result = [...payments.value]

  // 应用搜索
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item =>
        item.orderNumber.toLowerCase().includes(query) ||
        item.productName.toLowerCase().includes(query)
    )
  }

  // 应用状态筛选
  if (filterStatus.value) {
    result = result.filter(item => item.status === filterStatus.value)
  }

  return result
})

/**
 * 获取状态对应的Element UI类型
 * @param {string} status - 支付状态
 * @returns {string} - Element UI标签类型
 */
const getStatusType = (status) => {
  const types = {
    success: 'success',
    processing: 'warning',
    failed: 'danger'
  }
  return types[status] || 'info'
}

/**
 * 获取状态对应的中文文本
 * @param {string} status - 支付状态
 * @returns {string} - 中文状态文本
 */
const getStatusText = (status) => {
  const texts = {
    success: '支付成功',
    processing: '处理中',
    failed: '支付失败'
  }
  return texts[status] || status
}

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
 * 查看支付详情
 * @param {Object} payment - 支付记录
 */
const viewPaymentDetail = (payment) => {
  selectedPayment.value = payment
  dialogVisible.value = true
}

/**
 * 下载发票
 */
const downloadInvoice = () => {
  ElMessage.success('发票下载中...')
  // 实际下载逻辑
}

/**
 * 处理每页条数变化
 * @param {number} size - 新的每页条数
 */
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

/**
 * 处理页码变化
 * @param {number} page - 新的页码
 */
const handleCurrentChange = (page) => {
  currentPage.value = page
}

/**
 * 加载支付数据
 */
const loadPaymentData = async () => {
  tableLoading.value = true
  try {
    // 实际项目中应该从Vuex加载数据
    // const data = await store.dispatch('payment/getPaymentList')

    // 模拟数据
    setTimeout(() => {
      payments.value = [
        {
          id: 1,
          orderNumber: 'ORD202507220001',
          productName: '高级会员订阅',
          amount: 199.00,
          paymentMethod: '微信支付',
          paymentDate: '2025-07-20 14:30:00',
          status: 'success',
          account: 'user@example.com',
          transactionId: 'WX202507200000001',
          remark: '年度会员',
          invoice: true
        },
        {
          id: 2,
          orderNumber: 'ORD202507150002',
          productName: '课程购买 - Vue进阶教程',
          amount: 99.00,
          paymentMethod: '支付宝',
          paymentDate: '2025-07-15 09:15:00',
          status: 'success',
          account: 'user@example.com',
          transactionId: 'ZFB202507150000002',
          remark: '含教学视频和源代码',
          invoice: true
        },
        {
          id: 3,
          orderNumber: 'ORD202507100003',
          productName: '企业版授权',
          amount: 3999.00,
          paymentMethod: '银行转账',
          paymentDate: '2025-07-10 16:45:00',
          status: 'processing',
          account: '企业账户',
          transactionId: 'BNK202507100000003',
          remark: '待财务确认',
          invoice: false
        },
        {
          id: 4,
          orderNumber: 'ORD202507050004',
          productName: '技术咨询服务',
          amount: 500.00,
          paymentMethod: '微信支付',
          paymentDate: '2025-07-05 11:20:00',
          status: 'failed',
          account: 'user@example.com',
          transactionId: 'WX202507050000004',
          remark: '支付失败，请重新支付',
          invoice: false
        },
        {
          id: 5,
          orderNumber: 'ORD202507010005',
          productName: '插件购买 - 数据可视化套件',
          amount: 299.00,
          paymentMethod: '支付宝',
          paymentDate: '2025-07-01 08:30:00',
          status: 'success',
          account: 'user@example.com',
          transactionId: 'ZFB202507010000005',
          remark: '',
          invoice: true
        }
      ]
      tableLoading.value = false
    }, 800)
  } catch (error) {
    ElMessage.error('加载支付数据失败')
    tableLoading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadPaymentData()
})
</script>

<style scoped>
.payment-details-page {
  max-width: 1200px;
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

.stats-row {
  margin-bottom: 25px;
}

.stats-card {
  text-align: center;
  padding: 20px 0;
  height: 100%;
}

.stats-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.currency {
  font-size: 20px;
  margin-right: 2px;
  font-weight: normal;
}

.stats-label {
  font-size: 14px;
  color: #909399;
}

.payment-table-card {
  margin-bottom: 30px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.card-header span {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  max-width: 100%;
}

.search-input {
  width: 240px;
}

.amount-cell {
  font-weight: 600;
  color: #67c23a;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.payment-detail-dialog {
  padding: 0 10px;
}

.dialog-header {
  margin-bottom: 20px;
  text-align: center;
}

.dialog-header h3 {
  margin-top: 15px;
  color: #303133;
}

.dialog-footer {
  margin-top: 20px;
  text-align: right;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .header-actions {
    margin-top: 10px;
    width: 100%;
  }

  .search-input {
    width: 100%;
  }

  .stats-row {
    margin-bottom: 0;
  }

  .stats-card {
    margin-bottom: 15px;
  }
}
</style>
