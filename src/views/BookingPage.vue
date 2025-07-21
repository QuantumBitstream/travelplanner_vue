<template>
  <div>
    <h2>预订 - {{ bookingInfo.title }}</h2>
    <el-card>
      <div>产品名称：{{ bookingInfo.title }}</div>
      <div>单价：￥{{ bookingInfo.price }}</div>
      <!-- 这里继续做表单、支付等 ... -->
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const bookingInfo = computed(() => store.state.booking.bookingInfo)
</script>
