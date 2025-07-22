<template>
  <div class="my-trips-page">
    <!-- 页面顶部区域 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1>我的洛杉矶行程</h1>
          <p class="subtitle">探索城市之美，定制专属旅行计划</p>
        </div>
        <!-- 添加新行程按钮 -->
        <el-button
            type="primary"
            icon="el-icon-plus"
            @click="showAddTripDialog"
            :disabled="loading"
        >新增行程</el-button>
      </div>

      <!-- 行程过滤器 -->
      <div class="filters-section">
        <el-input
            v-model="searchQuery"
            placeholder="搜索行程..."
            clearable
            prefix-icon="el-icon-search"
            class="search-input"
        />
        <el-select v-model="filterStatus" placeholder="行程状态" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option label="已计划" value="planned"></el-option>
          <el-option label="进行中" value="ongoing"></el-option>
          <el-option label="已完成" value="completed"></el-option>
        </el-select>
        <el-select v-model="sortBy" placeholder="排序方式">
          <el-option label="日期 (新→旧)" value="date-desc"></el-option>
          <el-option label="日期 (旧→新)" value="date-asc"></el-option>
          <el-option label="名称 (A→Z)" value="name-asc"></el-option>
        </el-select>
      </div>
    </div>

    <!-- 行程展示区域 -->
    <div class="trips-container" v-loading="loading">
      <!-- 有行程数据时显示 -->
      <template v-if="filteredTrips.length">
        <el-row :gutter="20">
          <el-col
              :xs="24"
              :sm="12"
              :md="8"
              v-for="trip in filteredTrips"
              :key="trip.id"
              class="trip-col"
          >
            <el-card class="trip-card" shadow="hover">
              <!-- 卡片顶部图片 -->
              <div class="trip-image" :style="`background-image: url(${trip.imageUrl})`">
                <div class="trip-date">{{ formatDate(trip.startDate) }}</div>
                <el-tag
                    :type="getStatusType(trip.status)"
                    class="trip-status"
                >{{ getStatusText(trip.status) }}</el-tag>
              </div>

              <!-- 卡片内容 -->
              <div class="trip-content">
                <h2 class="trip-title">{{ trip.name }}</h2>
                <p class="trip-description">{{ trip.description }}</p>

                <!-- 地点标签 -->
                <div class="trip-locations">
                  <el-tag
                      v-for="location in trip.locations"
                      :key="location"
                      size="small"
                      effect="plain"
                      class="location-tag"
                  >{{ location }}</el-tag>
                </div>

                <!-- 行程详情 -->
                <div class="trip-details">
                  <div class="detail-item">
                    <i class="el-icon-date"></i>
                    <span>{{ formatDateRange(trip.startDate, trip.endDate) }}</span>
                  </div>
                  <div class="detail-item">
                    <i class="el-icon-user"></i>
                    <span>{{ trip.participants }} 人</span>
                  </div>
                  <div class="detail-item">
                    <i class="el-icon-money"></i>
                    <span>${{ trip.budget }}</span>
                  </div>
                </div>
              </div>

              <!-- 卡片底部操作按钮 -->
              <div class="trip-actions">
                <el-button
                    type="primary"
                    icon="el-icon-view"
                    size="small"
                    @click="viewTripDetails(trip.id)"
                >查看详情</el-button>
                <el-dropdown trigger="click" size="small">
                  <el-button icon="el-icon-more" size="small"></el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="editTrip(trip.id)">
                        <i class="el-icon-edit"></i> 编辑行程
                      </el-dropdown-item>
                      <el-dropdown-item @click="duplicateTrip(trip.id)">
                        <i class="el-icon-document-copy"></i> 复制行程
                      </el-dropdown-item>
                      <el-dropdown-item
                          divided
                          @click="confirmDeleteTrip(trip.id)"
                          style="color: #F56C6C"
                      >
                        <i class="el-icon-delete"></i> 删除行程
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </template>

      <!-- 无行程数据时显示 -->
      <el-empty
          v-else-if="!loading"
          description="暂无洛杉矶行程计划"
          class="empty-state"
      >
        <template #default>
          <p class="empty-desc">开始规划您的洛杉矶之旅吧！</p>
          <el-button type="primary" @click="showAddTripDialog">立即创建</el-button>
        </template>
      </el-empty>
    </div>

    <!-- 添加/编辑行程对话框 -->
    <el-dialog
        v-model="dialogVisible"
        :title="isEditing ? '编辑行程' : '新增行程'"
        width="600px"
        destroy-on-close
    >
      <el-form
          :model="tripForm"
          :rules="tripFormRules"
          ref="tripFormRef"
          label-position="top"
      >
        <el-form-item label="行程名称" prop="name">
          <el-input v-model="tripForm.name" placeholder="请输入行程名称"></el-input>
        </el-form-item>

        <el-form-item label="行程描述" prop="description">
          <el-input
              v-model="tripForm.description"
              type="textarea"
              :rows="3"
              placeholder="请输入行程描述"
          ></el-input>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker
                  v-model="tripForm.startDate"
                  type="date"
                  placeholder="选择开始日期"
                  style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束日期" prop="endDate">
              <el-date-picker
                  v-model="tripForm.endDate"
                  type="date"
                  placeholder="选择结束日期"
                  style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="行程状态" prop="status">
              <el-select v-model="tripForm.status" placeholder="选择状态" style="width: 100%">
                <el-option label="已计划" value="planned"></el-option>
                <el-option label="进行中" value="ongoing"></el-option>
                <el-option label="已完成" value="completed"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参与人数" prop="participants">
              <el-input-number
                  v-model="tripForm.participants"
                  :min="1"
                  :max="50"
                  style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="预算" prop="budget">
          <el-input v-model="tripForm.budget" type="number" placeholder="请输入预算">
            <template #prepend>$</template>
          </el-input>
        </el-form-item>

        <el-form-item label="地点" prop="locations">
          <el-select
              v-model="tripForm.locations"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择或添加地点"
              style="width: 100%"
          >
            <el-option
                v-for="item in locationOptions"
                :key="item"
                :label="item"
                :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
              type="primary"
              @click="saveTrip"
              :loading="formSubmitting"
          >保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 行程详情对话框 -->
    <el-dialog
        v-model="detailsDialogVisible"
        title="行程详情"
        width="700px"
        destroy-on-close
    >
      <div v-if="selectedTrip" class="trip-details-dialog">
        <div class="trip-header">
          <div class="trip-image-large" :style="`background-image: url(${selectedTrip.imageUrl})`"></div>
          <h2>{{ selectedTrip.name }}</h2>
          <el-tag :type="getStatusType(selectedTrip.status)">{{ getStatusText(selectedTrip.status) }}</el-tag>
        </div>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="行程日期">{{ formatDateRange(selectedTrip.startDate, selectedTrip.endDate) }}</el-descriptions-item>
          <el-descriptions-item label="参与人数">{{ selectedTrip.participants }} 人</el-descriptions-item>
          <el-descriptions-item label="预算">${{ selectedTrip.budget }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatDate(selectedTrip.createdAt, true) }}</el-descriptions-item>
        </el-descriptions>

        <div class="section-title">行程描述</div>
        <p class="detail-description">{{ selectedTrip.description }}</p>

        <div class="section-title">地点</div>
        <div class="detail-locations">
          <el-tag
              v-for="location in selectedTrip.locations"
              :key="location"
              effect="plain"
              class="location-tag"
          >{{ location }}</el-tag>
        </div>

        <div class="section-title">行程安排</div>
        <el-timeline>
          <el-timeline-item
              v-for="(activity, index) in selectedTrip.activities"
              :key="index"
              :timestamp="activity.time"
              :type="getActivityType(index)"
          >
            <h4>{{ activity.title }}</h4>
            <p>{{ activity.description }}</p>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
// import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'

// Store实例
// const store = useStore()

// 状态变量
const loading = ref(false)
const searchQuery = ref('')
const filterStatus = ref('')
const sortBy = ref('date-desc')
const dialogVisible = ref(false)
const detailsDialogVisible = ref(false)
const isEditing = ref(false)
const formSubmitting = ref(false)
const tripFormRef = ref(null)
const selectedTrip = ref(null)

// 行程数据，实际应用中从Vuex获取
const trips = ref([])

// 表单数据
const tripForm = reactive({
  id: null,
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  status: 'planned',
  participants: 1,
  budget: 0,
  locations: [],
  imageUrl: '',
})

// 表单验证规则
const tripFormRules = {
  name: [
    { required: true, message: '请输入行程名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在2到50个字符之间', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入行程描述', trigger: 'blur' }
  ],
  startDate: [
    { required: true, message: '请选择开始日期', trigger: 'change' }
  ],
  endDate: [
    { required: true, message: '请选择结束日期', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (value && tripForm.startDate && value < tripForm.startDate) {
          callback(new Error('结束日期不能早于开始日期'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  status: [
    { required: true, message: '请选择行程状态', trigger: 'change' }
  ],
  participants: [
    { required: true, message: '请输入参与人数', trigger: 'blur' }
  ],
  budget: [
    { required: true, message: '请输入预算', trigger: 'blur' }
  ]
}

// 洛杉矶热门地点选项
const locationOptions = [
  '好莱坞', '星光大道', '格里菲斯天文台', '环球影城', '圣塔莫尼卡海滩',
  '威尼斯海滩', '比佛利山庄', '盖蒂博物馆', '洛杉矶县立美术馆', '杜比剧院',
  '迪士尼音乐厅', '道奇体育场', '中国戏院', '农贸市场', '韩国城'
]

/**
 * 根据筛选条件过滤和排序行程
 */
const filteredTrips = computed(() => {
  let result = [...trips.value]

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(trip =>
        trip.name.toLowerCase().includes(query) ||
        trip.description.toLowerCase().includes(query)
    )
  }

  // 状态过滤
  if (filterStatus.value) {
    result = result.filter(trip => trip.status === filterStatus.value)
  }

  // 排序
  switch (sortBy.value) {
    case 'date-desc':
      result.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      break
    case 'date-asc':
      result.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      break
    case 'name-asc':
      result.sort((a, b) => a.name.localeCompare(b.name))
      break
  }

  return result
})

/**
 * 格式化日期
 * @param {string|Date} date - 日期
 * @param {boolean} showTime - 是否显示时间
 * @returns {string} 格式化后的日期字符串
 */
const formatDate = (date, showTime = false) => {
  if (!date) return '未设置'

  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  if (showTime) {
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  return `${year}-${month}-${day}`
}

/**
 * 格式化日期范围
 * @param {string|Date} startDate - 开始日期
 * @param {string|Date} endDate - 结束日期
 * @returns {string} 格式化后的日期范围
 */
const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '日期未设置'

  const start = formatDate(startDate)
  const end = formatDate(endDate)

  if (start === end) return start

  return `${start} 至 ${end}`
}

/**
 * 获取状态对应的类型
 * @param {string} status - 行程状态
 * @returns {string} Element UI标签类型
 */
const getStatusType = (status) => {
  const types = {
    planned: 'info',
    ongoing: 'warning',
    completed: 'success'
  }
  return types[status] || 'info'
}

/**
 * 获取状态对应的文本
 * @param {string} status - 行程状态
 * @returns {string} 状态文本
 */
const getStatusText = (status) => {
  const texts = {
    planned: '已计划',
    ongoing: '进行中',
    completed: '已完成'
  }
  return texts[status] || status
}

/**
 * 获取行程活动类型颜色
 * @param {number} index - 活动索引
 * @returns {string} 活动类型
 */
const getActivityType = (index) => {
  const types = ['primary', 'success', 'warning', 'danger', 'info']
  return types[index % types.length]
}

/**
 * 显示添加行程对话框
 */
const showAddTripDialog = () => {
  isEditing.value = false
  resetTripForm()
  dialogVisible.value = true
}

/**
 * 重置行程表单
 */
const resetTripForm = () => {
  Object.assign(tripForm, {
    id: null,
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'planned',
    participants: 1,
    budget: 0,
    locations: [],
    imageUrl: '',
  })

  if (tripFormRef.value) {
    tripFormRef.value.resetFields()
  }
}

/**
 * 保存行程
 */
const saveTrip = () => {
  tripFormRef.value.validate(async valid => {
    if (!valid) return

    formSubmitting.value = true

    try {
      const tripData = { ...tripForm }

      // 为新行程设置默认图片
      if (!isEditing.value || !tripData.imageUrl) {
        tripData.imageUrl = getRandomTripImage()
      }

      // 实际应用中应调用Vuex actions
      setTimeout(() => {
        if (isEditing.value) {
          // 更新行程
          const index = trips.value.findIndex(trip => trip.id === tripData.id)
          if (index !== -1) {
            trips.value[index] = { ...trips.value[index], ...tripData }
          }
          ElMessage.success('行程更新成功')
        } else {
          // 添加新行程
          const newTrip = {
            ...tripData,
            id: Date.now(),
            createdAt: new Date(),
            activities: generateRandomActivities()
          }
          trips.value.unshift(newTrip)
          ElMessage.success('行程添加成功')
        }

        dialogVisible.value = false
        formSubmitting.value = false
      }, 600)
    } catch (error) {
      ElMessage.error('操作失败，请重试')
      formSubmitting.value = false
    }
  })
}

/**
 * 编辑行程
 * @param {number} id - 行程ID
 */
const editTrip = (id) => {
  const trip = trips.value.find(trip => trip.id === id)
  if (!trip) return

  isEditing.value = true
  Object.assign(tripForm, { ...trip })

  dialogVisible.value = true
}

/**
 * 复制行程
 * @param {number} id - 行程ID
 */
const duplicateTrip = (id) => {
  const trip = trips.value.find(trip => trip.id === id)
  if (!trip) return

  const newTrip = {
    ...trip,
    id: Date.now(),
    name: `${trip.name} (复制)`,
    createdAt: new Date(),
    status: 'planned'
  }

  trips.value.unshift(newTrip)
  ElMessage.success('行程已复制')
}

/**
 * 确认删除行程
 * @param {number} id - 行程ID
 */
const confirmDeleteTrip = (id) => {
  ElMessageBox.confirm('确定要删除这个行程吗？此操作不可恢复', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = trips.value.findIndex(trip => trip.id === id)
    if (index !== -1) {
      trips.value.splice(index, 1)
      ElMessage.success('行程已删除')
    }
  }).catch(() => {
    // 取消删除
  })
}

/**
 * 查看行程详情
 * @param {number} id - 行程ID
 */
const viewTripDetails = (id) => {
  const trip = trips.value.find(trip => trip.id === id)
  if (!trip) return

  selectedTrip.value = trip
  detailsDialogVisible.value = true
}

/**
 * 获取随机行程图片URL
 * @returns {string} 图片URL
 */
const getRandomTripImage = () => {
  const images = [
    'https://images.unsplash.com/photo-1581373449483-37449f962b6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1542217550-37a00d80e8c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1490644658840-3f2e3f8c5625?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1491926626787-62db157af940?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  ]

  return images[Math.floor(Math.random() * images.length)]
}

/**
 * 生成随机活动
 * @returns {Array} 活动数组
 */
const generateRandomActivities = () => {
  const activities = [
    {
      time: '上午 9:00',
      title: '到达目的地',
      description: '办理入住手续，安顿行李'
    },
    {
      time: '上午 11:00',
      title: '参观景点',
      description: '前往当地著名景点游览'
    },
    {
      time: '下午 13:30',
      title: '午餐',
      description: '在当地特色餐厅享用美食'
    },
    {
      time: '下午 15:00',
      title: '购物时间',
      description: '在当地商业区购买纪念品'
    },
    {
      time: '晚上 18:00',
      title: '晚餐',
      description: '品尝当地特色美食'
    }
  ]

  return activities
}

/**
 * 获取行程数据
 */
const fetchTrips = () => {
  loading.value = true

  // 模拟从API获取数据
  setTimeout(() => {
    trips.value = [
      {
        id: 1,
        name: '好莱坞之旅',
        description: '参观传奇的好莱坞标志和漫步星光大道，探索电影之都的魅力。',
        startDate: '2025-08-15',
        endDate: '2025-08-16',
        status: 'planned',
        participants: 2,
        budget: 300,
        locations: ['好莱坞', '星光大道', '格里菲斯天文台'],
        imageUrl: 'https://images.unsplash.com/photo-1581373449483-37449f962b6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        createdAt: '2025-07-20 14:30:00',
        activities: [
          {
            time: '上午 9:00',
            title: '星光大道',
            description: '参观著名的星光大道，寻找喜欢的明星手印'
          },
          {
            time: '下午 13:00',
            title: '好莱坞标志',
            description: '前往格里菲斯天文台远眺好莱坞标志'
          },
          {
            time: '晚上 19:00',
            title: '中国戏院',
            description: '参观TCL中国戏院，欣赏明星手印和足迹'
          }
        ]
      },
      {
        id: 2,
        name: '圣塔莫尼卡海滩一日游',
        description: '享受加州阳光下的美丽海滩和著名的码头，体验海边休闲生活。',
        startDate: '2025-08-20',
        endDate: '2025-08-20',
        status: 'planned',
        participants: 4,
        budget: 200,
        locations: ['圣塔莫尼卡海滩', '圣塔莫尼卡码头', '威尼斯海滩'],
        imageUrl: 'https://images.unsplash.com/photo-1542217550-37a00d80e8c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        createdAt: '2025-07-19 10:15:00',
        activities: [
          {
            time: '上午 10:00',
            title: '海滩漫步',
            description: '在圣塔莫尼卡海滩漫步，享受阳光和海浪'
          },
          {
            time: '下午 14:00',
            title: '码头游览',
            description: '参观著名的圣塔莫尼卡码头，体验游乐设施'
          },
          {
            time: '晚上 18:00',
            title: '海边晚餐',
            description: '在海边餐厅享用新鲜海鲜晚餐'
          }
        ]
      },
      {
        id: 3,
        name: '盖蒂博物馆艺术之旅',
        description: '探索独特的建筑和丰富的艺术收藏，欣赏世界级艺术珍品。',
        startDate: '2025-09-05',
        endDate: '2025-09-05',
        status: 'planned',
        participants: 2,
        budget: 150,
        locations: ['盖蒂博物馆', '洛杉矶县立美术馆'],
        imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        createdAt: '2025-07-15 16:45:00',
        activities: [
          {
            time: '上午 10:00',
            title: '盖蒂中心',
            description: '参观盖蒂中心，欣赏其独特建筑设计'
          },
          {
            time: '下午 13:00',
            title: '艺术展览',
            description: '参观博物馆主要展览，欣赏世界级艺术珍品'
          },
          {
            time: '下午 16:00',
            title: '花园漫步',
            description: '在博物馆花园漫步，欣赏美丽的园林景观'
          }
        ]
      }
    ]
    loading.value = false
  }, 800)
}

// 组件挂载时获取数据
onMounted(() => {
  fetchTrips()
})
</script>

<style scoped>
.my-trips-page {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #f9fafc;
}

.page-header {
  margin-bottom: 30px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title-section h1 {
  margin: 0;
  font-size: 28px;
  color: #303133;
  font-weight: 600;
}

.subtitle {
  color: #606266;
  margin: 8px 0 0 0;
  font-size: 16px;
}

.filters-section {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.search-input {
  width: 250px;
}

.trips-container {
  min-height: 300px;
}

.trip-col {
  margin-bottom: 25px;
}

.trip-card {
  height: 100%;
  transition: transform 0.3s, box-shadow 0.3s;
  overflow: hidden;
  border-radius: 8px;
}

.trip-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.trip-image {
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 8px 8px 0 0;
}

.trip-date {
  position: absolute;
  top: 15px;
  left: 15px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.trip-status {
  position: absolute;
  top: 15px;
  right: 15px;
}

.trip-content {
  padding: 20px;
}

.trip-title {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.trip-description {
  color: #606266;
  margin: 0 0 15px 0;
  font-size: 14px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.trip-locations {
  margin-bottom: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.location-tag {
  margin-right: 0;
}

.trip-details {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
  color: #909399;
  font-size: 13px;
}

.detail-item {
  display: flex;
  align-items: center;
}

.detail-item i {
  margin-right: 5px;
}

.trip-actions {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px 20px;
}

.empty-state {
  padding: 50px 0;
}

.empty-desc {
  margin: 10px 0 15px;
  color: #909399;
}

/* 行程详情对话框样式 */
.trip-details-dialog {
  padding: 0 10px;
}

.trip-header {
  text-align: center;
  margin-bottom: 20px;
}

.trip-image-large {
  height: 250px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-bottom: 20px;
}

.trip-header h2 {
  margin: 10px 0;
  font-size: 22px;
  color: #303133;
}

.section-title {
  font-weight: 600;
  margin: 25px 0 15px;
  color: #303133;
  font-size: 16px;
}

.detail-description {
  color: #606266;
  line-height: 1.6;
}

.detail-locations {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .my-trips-page {
    padding: 20px 15px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-content button {
    margin-top: 15px;
    align-self: flex-start;
  }

  .filters-section {
    flex-direction: column;
  }

  .search-input,
  .filters-section .el-select {
    width: 100%;
  }
}
</style>
