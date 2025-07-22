<template>
  <div class="notifications-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="back-button" @click="goBack">
        <i class="el-icon-arrow-left"></i>
        <span>返回</span>
      </div>
      <h1>消息通知</h1>
    </div>

    <!-- 通知统计卡片组 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="8">
        <el-card shadow="hover" class="stats-card" :body-style="{padding: '15px'}">
          <div class="stats-content">
            <div class="stats-icon unread-icon">
              <i class="el-icon-message"></i>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ unreadCount }}</div>
              <div class="stats-label">未读消息</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8">
        <el-card shadow="hover" class="stats-card" :body-style="{padding: '15px'}">
          <div class="stats-content">
            <div class="stats-icon total-icon">
              <i class="el-icon-bell"></i>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ totalCount }}</div>
              <div class="stats-label">全部消息</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8">
        <el-card shadow="hover" class="stats-card" :body-style="{padding: '15px'}">
          <div class="stats-content">
            <div class="stats-icon today-icon">
              <i class="el-icon-alarm-clock"></i>
            </div>
            <div class="stats-info">
              <div class="stats-value">{{ todayCount }}</div>
              <div class="stats-label">今日新增</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 通知设置卡片 -->
    <el-card class="settings-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>通知设置</span>
          <el-button type="text" @click="saveNotificationSettings">保存设置</el-button>
        </div>
      </template>

      <!-- 通知设置选项 -->
      <div class="notification-settings">
        <div class="setting-group">
          <h3>接收通知方式</h3>
          <div class="setting-options">
            <el-checkbox v-model="notifySettings.email">电子邮件</el-checkbox>
            <el-checkbox v-model="notifySettings.sms">短信</el-checkbox>
            <el-checkbox v-model="notifySettings.push">站内通知</el-checkbox>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="setting-group">
          <h3>通知类型</h3>
          <div class="notification-type-settings">
            <el-row :gutter="20" v-for="(item, index) in notificationTypes" :key="index" class="type-row">
              <el-col :span="8" class="type-label">
                <div class="type-icon" :class="item.iconClass">
                  <i :class="item.icon"></i>
                </div>
                <span>{{ item.label }}</span>
              </el-col>
              <el-col :span="16" class="type-toggles">
                <el-switch
                    v-model="item.email"
                    active-color="#13ce66"
                    inactive-color="#dcdfe6"
                    active-text="邮件"
                ></el-switch>
                <el-switch
                    v-model="item.sms"
                    active-color="#13ce66"
                    inactive-color="#dcdfe6"
                    active-text="短信"
                ></el-switch>
                <el-switch
                    v-model="item.push"
                    active-color="#13ce66"
                    inactive-color="#dcdfe6"
                    active-text="站内"
                ></el-switch>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 消息列表卡片 -->
    <el-card class="messages-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>我的消息</span>
          <div class="header-actions">
            <el-input
                v-model="searchQuery"
                placeholder="搜索消息"
                clearable
                prefix-icon="el-icon-search"
                class="search-input"
            />
            <el-select
                v-model="filterType"
                placeholder="消息类型"
                clearable
                style="width: 120px; margin-left: 10px;"
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="系统" value="system"></el-option>
              <el-option label="活动" value="activity"></el-option>
              <el-option label="订单" value="order"></el-option>
              <el-option label="安全" value="security"></el-option>
            </el-select>
          </div>
        </div>
      </template>

      <!-- 消息列表工具栏 -->
      <div class="message-toolbar">
        <div class="toolbar-left">
          <el-checkbox v-model="selectAll" @change="handleSelectAllChange">全选</el-checkbox>
          <el-button
              type="text"
              size="small"
              :disabled="selectedMessages.length === 0"
              @click="markAsRead"
          >标为已读</el-button>
          <el-button
              type="text"
              size="small"
              :disabled="selectedMessages.length === 0"
              @click="deleteMessages"
          >删除</el-button>
        </div>
        <div class="toolbar-right">
          <el-button type="text" size="small" @click="refreshMessages">
            <i class="el-icon-refresh"></i> 刷新
          </el-button>
        </div>
      </div>

      <!-- 消息列表 -->
      <div class="message-list-wrapper">
        <el-empty
            v-if="filteredMessages.length === 0"
            description="暂无消息"
            :image-size="100"
        ></el-empty>
        <div
            v-else
            v-loading="messagesLoading"
            class="message-list"
        >
          <div
              v-for="(message) in paginatedMessages"
              :key="message.id"
              class="message-item"
              :class="{'unread': !message.read, 'selected': selectedMessages.includes(message.id)}"
              @click="toggleMessageSelection(message.id)"
          >
            <div class="message-checkbox">
              <el-checkbox
                  v-model="message.selected"
                  @click.stop
                  @change="(val) => handleMessageSelect(message.id, val)"
              ></el-checkbox>
            </div>
            <div class="message-content" @click.stop="viewMessageDetail(message)">
              <div class="message-header">
                <div class="message-info">
                  <el-tag size="small" :type="getMessageTagType(message.type)">
                    {{ getMessageTypeText(message.type) }}
                  </el-tag>
                  <span class="message-title">{{ message.title }}</span>
                </div>
                <div class="message-date">{{ formatMessageDate(message.date) }}</div>
              </div>
              <div class="message-body">{{ message.content }}</div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="filteredMessages.length > 0" class="pagination-container">
          <el-pagination
              background
              layout="prev, pager, next"
              :total="filteredMessages.length"
              :page-size="pageSize"
              v-model:current-page="currentPage"
              @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>
    </el-card>

    <!-- 消息详情对话框 -->
    <el-dialog
        v-model="messageDetailVisible"
        :title="currentMessage ? currentMessage.title : '消息详情'"
        width="600px"
        destroy-on-close
        @closed="handleDialogClosed"
    >
      <div v-if="currentMessage" class="message-detail">
        <div class="detail-header">
          <div class="message-meta">
            <el-tag size="small" :type="getMessageTagType(currentMessage.type)" effect="dark">
              {{ getMessageTypeText(currentMessage.type) }}
            </el-tag>
            <span class="message-date">{{ formatMessageDate(currentMessage.date) }}</span>
          </div>
        </div>
        <div class="detail-content">
          <div class="message-text">
            {{ currentMessage.content }}
          </div>
          <div v-if="currentMessage.link" class="message-link">
            <el-link type="primary" :href="currentMessage.link" target="_blank">
              查看详情 <i class="el-icon-right"></i>
            </el-link>
          </div>
        </div>
        <div v-if="currentMessage.attachments && currentMessage.attachments.length > 0" class="attachments">
          <h4>附件</h4>
          <div class="attachment-list">
            <div
                v-for="(attachment, index) in currentMessage.attachments"
                :key="index"
                class="attachment-item"
            >
              <i class="el-icon-document"></i>
              <span>{{ attachment.name }}</span>
              <el-button type="text" size="mini" @click="downloadAttachment(attachment)">
                下载
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="messageDetailVisible = false">关闭</el-button>
          <el-button
              v-if="currentMessage && !currentMessage.read"
              type="primary"
              @click="markSingleAsRead"
          >标为已读</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
// import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'

// 路由和store实例
const router = useRouter()
// const store = useStore()

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 消息加载状态
const messagesLoading = ref(false)
// 消息数据
const messages = ref([])
// 今日日期（用于比较）
const today = new Date()
today.setHours(0, 0, 0, 0)

// 通知设置
const notifySettings = reactive({
  email: true,
  sms: false,
  push: true
})

// 通知类型设置
const notificationTypes = reactive([
  {
    label: '系统通知',
    icon: 'el-icon-s-platform',
    iconClass: 'system-icon',
    email: true,
    sms: false,
    push: true
  },
  {
    label: '活动推送',
    icon: 'el-icon-s-promotion',
    iconClass: 'activity-icon',
    email: true,
    sms: false,
    push: true
  },
  {
    label: '订单信息',
    icon: 'el-icon-s-order',
    iconClass: 'order-icon',
    email: true,
    sms: true,
    push: true
  },
  {
    label: '账户安全',
    icon: 'el-icon-s-opportunity',
    iconClass: 'security-icon',
    email: true,
    sms: true,
    push: true
  }
])

// 搜索和筛选
const searchQuery = ref('')
const filterType = ref('')

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

// 消息选择
const selectAll = ref(false)
const selectedMessages = ref([])

// 消息详情
const messageDetailVisible = ref(false)
const currentMessage = ref(null)

/**
 * 未读消息数量
 */
const unreadCount = computed(() => {
  return messages.value.filter(msg => !msg.read).length
})

/**
 * 总消息数量
 */
const totalCount = computed(() => {
  return messages.value.length
})

/**
 * 今日新消息数量
 */
const todayCount = computed(() => {
  return messages.value.filter(msg => {
    const msgDate = new Date(msg.date)
    return msgDate >= today
  }).length
})

/**
 * 过滤后的消息列表
 */
const filteredMessages = computed(() => {
  let result = [...messages.value]

  // 应用搜索
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query)
    )
  }

  // 应用类型筛选
  if (filterType.value) {
    result = result.filter(item => item.type === filterType.value)
  }

  return result
})

/**
 * 分页后的消息列表
 */
const paginatedMessages = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value

  return filteredMessages.value
      .slice(start, end)
      .map(msg => ({
        ...msg,
        selected: selectedMessages.value.includes(msg.id)
      }))
})

/**
 * 获取消息类型对应的标签类型
 * @param {string} type - 消息类型
 * @returns {string} - Element UI标签类型
 */
const getMessageTagType = (type) => {
  const types = {
    system: 'info',
    activity: 'success',
    order: 'warning',
    security: 'danger'
  }
  return types[type] || 'info'
}

/**
 * 获取消息类型的中文文本
 * @param {string} type - 消息类型
 * @returns {string} - 中文类型文本
 */
const getMessageTypeText = (type) => {
  const texts = {
    system: '系统',
    activity: '活动',
    order: '订单',
    security: '安全'
  }
  return texts[type] || type
}

/**
 * 格式化消息日期
 * @param {Date|string} date - 日期对象或字符串
 * @returns {string} - 格式化后的日期字符串
 */
const formatMessageDate = (date) => {
  if (!date) return ''

  const msgDate = new Date(date)
  const now = new Date()

  // 如果是今天的消息，只显示时间
  if (msgDate.toDateString() === now.toDateString()) {
    return `今天 ${msgDate.getHours().toString().padStart(2, '0')}:${msgDate.getMinutes().toString().padStart(2, '0')}`
  }

  // 如果是昨天的消息
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  if (msgDate.toDateString() === yesterday.toDateString()) {
    return `昨天 ${msgDate.getHours().toString().padStart(2, '0')}:${msgDate.getMinutes().toString().padStart(2, '0')}`
  }

  // 其他日期显示完整日期
  return `${msgDate.getFullYear()}-${String(msgDate.getMonth() + 1).padStart(2, '0')}-${String(msgDate.getDate()).padStart(2, '0')} ${String(msgDate.getHours()).padStart(2, '0')}:${String(msgDate.getMinutes()).padStart(2, '0')}`
}

/**
 * 切换消息选择状态
 * @param {number} messageId - 消息ID
 */
const toggleMessageSelection = (messageId) => {
  const index = selectedMessages.value.indexOf(messageId)
  if (index === -1) {
    selectedMessages.value.push(messageId)
  } else {
    selectedMessages.value.splice(index, 1)
  }

  // 更新全选状态
  updateSelectAllState()
}

/**
 * 处理消息选择变化
 * @param {number} messageId - 消息ID
 * @param {boolean} checked - 是否选中
 */
const handleMessageSelect = (messageId, checked) => {
  if (checked && !selectedMessages.value.includes(messageId)) {
    selectedMessages.value.push(messageId)
  } else if (!checked) {
    const index = selectedMessages.value.indexOf(messageId)
    if (index !== -1) {
      selectedMessages.value.splice(index, 1)
    }
  }

  // 更新全选状态
  updateSelectAllState()
}

/**
 * 更新全选状态
 */
const updateSelectAllState = () => {
  const visibleMessages = paginatedMessages.value
  selectAll.value = visibleMessages.length > 0 &&
      visibleMessages.every(msg => selectedMessages.value.includes(msg.id))
}

/**
 * 处理全选变化
 * @param {boolean} val - 是否全选
 */
const handleSelectAllChange = (val) => {
  const visibleMessages = paginatedMessages.value

  if (val) {
    // 全选当前页消息
    visibleMessages.forEach(msg => {
      if (!selectedMessages.value.includes(msg.id)) {
        selectedMessages.value.push(msg.id)
      }
    })
  } else {
    // 取消全选当前页消息
    visibleMessages.forEach(msg => {
      const index = selectedMessages.value.indexOf(msg.id)
      if (index !== -1) {
        selectedMessages.value.splice(index, 1)
      }
    })
  }
}

/**
 * 标记选中的消息为已读
 */
const markAsRead = () => {
  if (selectedMessages.value.length === 0) return

  messages.value = messages.value.map(msg => {
    if (selectedMessages.value.includes(msg.id)) {
      return { ...msg, read: true }
    }
    return msg
  })

  ElMessage.success(`已将${selectedMessages.value.length}条消息标记为已读`)
  selectedMessages.value = []
  selectAll.value = false
}

/**
 * 删除选中的消息
 */
const deleteMessages = () => {
  if (selectedMessages.value.length === 0) return

  ElMessageBox.confirm(`确定要删除选中的${selectedMessages.value.length}条消息吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    messages.value = messages.value.filter(msg => !selectedMessages.value.includes(msg.id))
    ElMessage.success(`已删除${selectedMessages.value.length}条消息`)
    selectedMessages.value = []
    selectAll.value = false
  }).catch(() => {})
}

/**
 * 查看消息详情
 * @param {Object} message - 消息对象
 */
const viewMessageDetail = (message) => {
  currentMessage.value = JSON.parse(JSON.stringify(message))
  messageDetailVisible.value = true

  // 如果消息未读，标记为已读
  if (!message.read) {
    messages.value = messages.value.map(msg => {
      if (msg.id === message.id) {
        return { ...msg, read: true }
      }
      return msg
    })
  }
}

/**
 * 单条消息标记为已读
 */
const markSingleAsRead = () => {
  if (!currentMessage.value) return

  messages.value = messages.value.map(msg => {
    if (msg.id === currentMessage.value.id) {
      return { ...msg, read: true }
    }
    return msg
  })

  currentMessage.value.read = true
  ElMessage.success('已标记为已读')
}

/**
 * 处理对话框关闭
 */
const handleDialogClosed = () => {
  currentMessage.value = null
}

/**
 * 下载附件
 * @param {Object} attachment - 附件对象
 */
const downloadAttachment = (attachment) => {
  ElMessage.success(`正在下载：${attachment.name}`)
  // 实际下载逻辑
}

/**
 * 刷新消息列表
 */
const refreshMessages = () => {
  messagesLoading.value = true
  setTimeout(() => {
    // 实际项目中应该从Vuex加载数据
    // store.dispatch('notifications/getMessages')
    messagesLoading.value = false
    ElMessage.success('消息已刷新')
  }, 800)
}

/**
 * 保存通知设置
 */
const saveNotificationSettings = () => {
  // 实际项目中应该调用Vuex action保存设置
  // store.dispatch('notifications/saveSettings', { notifySettings, notificationTypes })
  ElMessage.success('通知设置已保存')
}

/**
 * 处理页码变化
 * @param {number} page - 新的页码
 */
const handleCurrentChange = (page) => {
  currentPage.value = page
}

// 监听筛选条件变化，重置分页
watch([searchQuery, filterType], () => {
  currentPage.value = 1
})

// 组件挂载时加载数据
onMounted(() => {
  messagesLoading.value = true

  // 模拟加载数据
  setTimeout(() => {
    messages.value = [
      {
        id: 1,
        title: '系统升级通知',
        content: '尊敬的用户，系统将于2025年7月25日凌晨2:00-4:00进行版本升级，期间系统可能无法访问，请提前做好相关工作安排。',
        type: 'system',
        date: '2025-07-22T08:30:00',
        read: false
      },
      {
        id: 2,
        title: '账号安全提醒',
        content: '您的账号今日在新设备上登录，登录地点：北京市。如非本人操作，请及时修改密码。',
        type: 'security',
        date: '2025-07-22T10:15:00',
        read: false
      },
      {
        id: 3,
        title: '7月优惠活动',
        content: '夏日特惠活动开始啦！即日起至7月31日，充值满500元即可获得额外100元奖励，多充多得！',
        type: 'activity',
        date: '2025-07-20T14:20:00',
        read: true,
        link: 'https://example.com/activity'
      },
      {
        id: 4,
        title: '订单已发货',
        content: '您的订单 #20250718-001234 已发货，物流单号：SF1234567890，预计3-5天送达。',
        type: 'order',
        date: '2025-07-18T16:40:00',
        read: true
      },
      {
        id: 5,
        title: '发票开具成功',
        content: '您申请的订单 #20250715-002345 的电子发票已开具成功，可在订单详情中查看和下载。',
        type: 'order',
        date: '2025-07-15T09:10:00',
        read: true,
        attachments: [
          {
            name: '电子发票.pdf',
            size: '258KB',
            url: '#'
          }
        ]
      },
      {
        id: 6,
        title: '账号绑定手机变更',
        content: '您的账号关联手机号已变更为 138****8888，如非本人操作，请立即联系客服。',
        type: 'security',
        date: '2025-07-10T11:05:00',
        read: true
      },
      {
        id: 7,
        title: '周年庆活动预告',
        content: '平台周年庆即将开启！8月1日-8月7日，多重优惠等您来拿，提前关注不要错过！',
        type: 'activity',
        date: '2025-07-05T17:30:00',
        read: true
      }
    ]
    messagesLoading.value = false
  }, 800)
})
</script>

<style scoped>
.notifications-page {
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

.stats-row {
  margin-bottom: 20px;
}

.stats-card {
  margin-bottom: 20px;
  overflow: visible;
}

.stats-content {
  display: flex;
  align-items: center;
}

.stats-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.stats-icon i {
  font-size: 24px;
  color: #fff;
}

.unread-icon {
  background: linear-gradient(135deg, #409EFF, #2563eb);
}

.total-icon {
  background: linear-gradient(135deg, #67C23A, #16a34a);
}

.today-icon {
  background: linear-gradient(135deg, #E6A23C, #d97706);
}

.stats-info {
  flex: 1;
}

.stats-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  line-height: 1;
  margin-bottom: 5px;
}

.stats-label {
  font-size: 14px;
  color: #909399;
}

.settings-card, .messages-card {
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

.header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.search-input {
  width: 200px;
}

.notification-settings {
  padding: 0 10px;
}

.setting-group h3 {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-top: 0;
  margin-bottom: 15px;
}

.setting-options {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.notification-type-settings {
  margin-top: 15px;
}

.type-row {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.type-label {
  display: flex;
  align-items: center;
}

.type-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}

.type-icon i {
  color: #fff;
}

.system-icon {
  background-color: #909399;
}

.activity-icon {
  background-color: #67C23A;
}

.order-icon {
  background-color: #E6A23C;
}

.security-icon {
  background-color: #F56C6C;
}

.type-toggles {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.message-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #EBEEF5;
  margin-bottom: 15px;
}

.toolbar-left, .toolbar-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.message-list-wrapper {
  min-height: 300px;
}

.message-list {
  margin-bottom: 20px;
}

.message-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #EBEEF5;
  cursor: pointer;
  transition: all 0.3s;
}

.message-item:hover {
  background-color: #f5f7fa;
}

.message-item.unread {
  background-color: #ecf5ff30;
}

.message-item.selected {
  background-color: #ecf5ff;
}

.message-checkbox {
  flex: 0 0 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-content {
  flex: 1;
  overflow: hidden;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.message-info {
  display: flex;
  align-items: center;
}

.message-title {
  margin-left: 10px;
  font-weight: 500;
  color: #303133;
}

.unread .message-title {
  font-weight: 600;
}

.message-date {
  font-size: 12px;
  color: #909399;
  flex-shrink: 0;
}

.message-body {
  color: #606266;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.message-detail .detail-header {
  margin-bottom: 15px;
}

.message-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.detail-content {
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 15px;
}

.message-text {
  color: #303133;
  line-height: 1.5;
}

.message-link {
  margin-top: 15px;
  text-align: right;
}

.attachments h4 {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 10px;
}

.attachment-list {
  background: #f5f7fa;
  padding: 10px 15px;
  border-radius: 8px;
}

.attachment-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #EBEEF5;
}

.attachment-item:last-child {
  border-bottom: none;
}

.attachment-item i {
  margin-right: 8px;
  color: #909399;
}

.attachment-item span {
  flex: 1;
  font-size: 13px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .header-actions {
    margin-top: 10px;
    flex-direction: column;
    width: 100%;
  }

  .search-input {
    width: 100%;
  }

  .stats-row {
    margin-bottom: 0;
  }

  .type-label, .type-toggles {
    width: 100%;
  }

  .type-toggles {
    margin-top: 10px;
    justify-content: flex-start;
  }

  .message-toolbar {
    flex-direction: column;
    gap: 10px;
  }

  .toolbar-left, .toolbar-right {
    width: 100%;
  }
}
</style>
