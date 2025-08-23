<template>
  <div class="booking-container">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <el-page-header @back="goBack" :title="bookingInfo.title">
        <template #content>
          <span class="page-title">预订确认</span>
        </template>
      </el-page-header>
    </div>

    <!-- 订单内容主体区 -->
    <el-card class="booking-card" shadow="hover">
      <!-- 产品信息展示 -->
      <div class="product-info">
        <div class="product-image">
          <el-image
              :src="bookingInfo.bannerImage"
              fit="cover"
              :preview-src-list="[bookingInfo.bannerImage]"
          />
        </div>

        <div class="product-detail">
          <h2>{{ bookingInfo.title }}</h2>
          <div class="trip-meta">
            <el-tag size="small" type="success">{{ bookingInfo.duration }}天</el-tag>
            <el-tag size="small" type="info">{{ bookingInfo.location }}</el-tag>
          </div>
          <div class="price-section">
            <span class="price-label">单价：</span>
            <span class="price-value">¥{{ bookingInfo.price }}</span>
            <span class="price-unit">/人</span>
          </div>
        </div>
      </div>

      <!-- 分割线 -->
      <el-divider />

      <!-- 预订信息表单 -->
      <div class="booking-form">
        <h3>预订信息</h3>
        <el-form ref="bookingForm" :model="form" :rules="rules" label-width="100px">
          <!-- 联系人信息 -->
          <el-form-item label="联系人" prop="contactName">
            <el-input v-model="form.contactName" placeholder="请输入联系人姓名" />
          </el-form-item>

          <el-form-item label="手机号码" prop="contactPhone">
            <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
          </el-form-item>

          <!-- 出行人数 -->
          <el-form-item label="出行人数" prop="personCount">
            <el-input-number v-model="form.personCount" :min="1" :max="10" @change="calculateTotal" />
          </el-form-item>

          <!-- 选择日期 -->
          <el-form-item label="出行日期" prop="travelDate">
            <el-date-picker
                v-model="form.travelDate"
                type="date"
                placeholder="选择出行日期"
                :disabled-date="disabledDate"
                format="YYYY/MM/DD"
                value-format="YYYY-MM-DD"
            />
          </el-form-item>

          <!-- 备注信息 -->
          <el-form-item label="备注" prop="remark">
            <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="如有特殊需求，请在此说明"
                :rows="3"
                maxlength="200"
                show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>

      <!-- 订单总结 -->
      <div class="order-summary">
        <h3>费用明细</h3>
        <div class="summary-item">
          <span>产品单价</span>
          <span>¥{{ bookingInfo.price }}/人</span>
        </div>
        <div class="summary-item">
          <span>出行人数</span>
          <span>{{ form.personCount }}人</span>
        </div>
        <div class="summary-item total">
          <span>总计金额</span>
          <span class="total-price">¥{{ totalAmount }}</span>
        </div>
      </div>

      <!-- 支付方式选择 -->
      <div class="payment-methods">
        <h3>选择支付方式</h3>
        <el-radio-group v-model="form.paymentMethod">
          <el-radio label="alipay">
            <img src="@/assets/logo.png" alt="支付宝" class="payment-icon" />
            支付宝
          </el-radio>
          <!-- 可添加其他支付方式 -->
        </el-radio-group>
      </div>

      <!-- 提交按钮区域 -->
      <div class="actions">
        <el-button @click="goBack">返回</el-button>
        <el-button
            type="primary"
            :loading="isSubmitting"
            @click="submitOrder"
        >
          确认支付
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
/**
 * 旅游产品预订&支付页面
 * 功能：
 * 1. 显示产品信息
 * 2. 收集用户预订信息
 * 3. 计算订单总金额
 * 4. 支持支付宝支付
 */
import { computed, reactive, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

// 获取路由和状态管理实例
const router = useRouter()
const store = useStore()

// 从Vuex获取预订信息
const bookingInfo = computed(() => store.state.booking.bookingInfo)

// 如果没有预订信息，重定向到首页
onMounted(() => {
  if (!bookingInfo.value || !bookingInfo.value.title) {
    ElMessage.warning('未找到预订信息，请重新选择产品')
    router.push('/')
  }
})

// 表单数据初始化
const form = reactive({
  contactName: '',
  contactPhone: '',
  personCount: 1,
  travelDate: '',
  remark: '',
  paymentMethod: 'alipay'  // 默认支付宝
})

// 表单验证规则
const rules = {
  contactName: [
    { required: true, message: '请输入联系人姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在2-20个字符之间', trigger: 'blur' }
  ],
  contactPhone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  personCount: [
    { required: true, message: '请选择出行人数', trigger: 'change' }
  ],
  travelDate: [
    { required: true, message: '请选择出行日期', trigger: 'change' }
  ]
}

// 禁用今天之前的日期
const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7  // 8.64e7是一天的毫秒数
}

// 表单引用，用于验证
const bookingForm = ref(null)

// 提交状态
const isSubmitting = ref(false)

// 计算总金额
const totalAmount = computed(() => {
  return (bookingInfo.value.price * form.personCount).toFixed(2)
})

// 计算总价
const calculateTotal = () => {
  // 这里可以添加额外的计算逻辑，例如优惠券折扣等
  return bookingInfo.value.price * form.personCount
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 提交订单
const submitOrder = async () => {
  // 表单验证
  if (!bookingForm.value) return

  await bookingForm.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('请完善预订信息')
      return
    }

    try {
      isSubmitting.value = true

      // 创建订单数据
      const orderData = {
        productId: bookingInfo.value.id,
        productName: bookingInfo.value.title,
        unitPrice: bookingInfo.value.price,
        personCount: form.personCount,
        totalAmount: totalAmount.value,
        contactName: form.contactName,
        contactPhone: form.contactPhone,
        travelDate: form.travelDate,
        remark: form.remark
      }

      // 调用Vuex的action创建订单
      const orderId = await store.dispatch('booking/createOrder', orderData)

      // 提示用户将跳转到支付页面
      await ElMessageBox.confirm(
          '订单已创建，即将跳转至支付宝付款页面',
          '确认支付',
          {
            confirmButtonText: '确认支付',
            cancelButtonText: '取消',
            type: 'info'
          }
      )

      // 跳转到支付接口
      if (form.paymentMethod === 'alipay') {
        // 调用支付接口 (两种方式)

        // 方式1: 直接打开新窗口
        window.open(`/api/order/pay/${orderId}`)

        // 方式2: 如果后端返回form表单，可以这样处理
        // const res = await store.dispatch('booking/getPaymentForm', orderId)
        // 创建一个隐藏的div来提交表单
        // const div = document.createElement('div')
        // div.innerHTML = res
        // document.body.appendChild(div)
        // document.forms[0].submit()
      }

    } catch (error) {
      console.error('支付过程中出错:', error)
      ElMessage.error('支付失败，请稍后重试')
    } finally {
      isSubmitting.value = false
    }
  })
}
</script>

<style scoped>
/* 整体容器样式 */
.booking-container {
  max-width: 960px;
  margin: 20px auto;
  padding: 0 15px;
}

/* 页面标题样式 */
.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

/* 预订卡片样式 */
.booking-card {
  margin-bottom: 50px;
}

/* 产品信息区域 */
.product-info {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.product-image {
  width: 180px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
}

.product-detail {
  flex: 1;
}

.product-detail h2 {
  margin-top: 0;
  margin-bottom: 12px;
  color: #303133;
}

.trip-meta {
  margin-bottom: 15px;
}

.trip-meta .el-tag {
  margin-right: 8px;
}

.price-section {
  font-size: 16px;
  margin-top: 10px;
}

.price-value {
  font-size: 22px;
  color: #ff6b6b;
  font-weight: bold;
}

.price-unit {
  font-size: 14px;
  color: #606266;
}

/* 表单区域 */
.booking-form h3,
.order-summary h3,
.payment-methods h3 {
  font-size: 18px;
  color: #303133;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

/* 订单总结 */
.order-summary {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.total {
  font-size: 16px;
  font-weight: bold;
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px dashed #dcdfe6;
}

.total-price {
  color: #ff6b6b;
  font-size: 20px;
}

/* 支付方式 */
.payment-methods {
  margin: 20px 0;
}

.payment-icon {
  width: 24px;
  height: 24px;
  margin-right: 5px;
  vertical-align: middle;
}

/* 按钮区域 */
.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  gap: 15px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .product-info {
    flex-direction: column;
  }

  .product-image {
    width: 100%;
    height: auto;
    aspect-ratio: 16/9;
  }
}
</style>
