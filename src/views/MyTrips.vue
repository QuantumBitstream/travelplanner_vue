<template>
  <div class="my-trips-page">
    <!-- 顶部标题和工具栏 -->
    <el-card class="page-header-card">
      <div class="header-row">
        <div class="title-group">
          <i class="el-icon-suitcase icon"></i>
          <span class="title">洛杉矶行程</span>
          <el-tag size="medium" type="success" class="sub-tag">Los Angeles</el-tag>
        </div>
        <el-button
            type="primary"
            icon="el-icon-plus"
            @click="dialogVisible = true"
            size="small"
        >添加行程</el-button>
      </div>
    </el-card>

    <!-- 行程列表 -->
    <el-row :gutter="20" class="trips-list-row" v-if="trips.length">
      <el-col
          v-for="trip in trips"
          :key="trip.id"
          :xs="24" :sm="12" :md="8"
          class="trip-col"
      >
        <el-card
            class="trip-card"
            shadow="hover"
        >
          <template #header>
            <div class="trip-header">
              <span class="trip-name">{{ trip.name }}</span>
              <el-button
                  icon="el-icon-delete"
                  size="small"
                  type="danger"
                  class="del-btn"
                  circle
                  @click="deleteTrip(trip.id)"
                  v-if="trips.length > 1"
              />
            </div>
          </template>
          <div class="trip-desc">{{ trip.description }}</div>
          <div class="trip-footer">
            <el-tag round type="info">行程ID: {{ trip.id }}</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 空状态处理 -->
    <el-empty v-else description="您还没有安排任何洛杉矶的行程。" class="empty-block">
      <el-button type="primary" size="small" @click="dialogVisible = true">创建一个行程</el-button>
    </el-empty>

    <!-- 新增行程对话框 -->
    <el-dialog
        v-model="dialogVisible"
        title="添加洛杉矶行程"
        width="400px"
        :before-close="handleDialogClose"
    >
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="70px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" maxlength="40" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
              type="textarea"
              v-model="form.description"
              maxlength="140"
              show-word-limit
              :rows="3"
              clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleDialogClose">取消</el-button>
        <el-button type="primary" @click="addTrip">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

/**
 * 行程数据
 * 可替换为 vuex 获取和操作
 */
const trips = ref([])

/**
 * 添加行程表单
 */
const dialogVisible = ref(false)
const formRef = ref(null)
const form = ref({ name: '', description: '' })
const formRules = {
  name: [{ required: true, message: '请输入行程名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入行程描述', trigger: 'blur' }],
}

/**
 * 数据初始化，模拟异步获取
 */
onMounted(() => {
  fetchTrips()
})
function fetchTrips() {
  setTimeout(() => {
    trips.value = [
      { id: 1, name: '好莱坞之旅', description: '参观传奇的好莱坞标志和漫步星光大道。' },
      { id: 2, name: '圣塔莫尼卡海滩', description: '享受加州阳光下的美丽海滩和著名的码头。' },
      { id: 3, name: '盖蒂博物馆', description: '探索独特的建筑和丰富的艺术收藏。' }
    ]
  }, 800)
}
/**
 * 添加新行程
 */
function addTrip() {
  formRef.value.validate((valid) => {
    if (!valid) return
    trips.value.push({
      id: Date.now(),
      name: form.value.name,
      description: form.value.description,
    })
    ElMessage.success('行程已添加！')
    handleDialogClose()
  })
}
/**
 * 删除行程
 * @param {*} id 行程ID
 */
function deleteTrip(id) {
  trips.value = trips.value.filter(trip => trip.id !== id)
  ElMessage.success('行程已删除！')
}

/**
 * 关闭对话框，重置表单
 */
function handleDialogClose() {
  dialogVisible.value = false
  setTimeout(() => {
    formRef.value && formRef.value.resetFields()
  }, 200)
}
</script>

<style scoped>
.my-trips-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 36px 16px 44px 16px;
  background-color: #f8fafc;
}

/* 顶部卡片和标题栏 */
.page-header-card {
  margin-bottom: 16px;
  border-radius: 11px;
  padding: 0 10px 3px 10px;
  /* 小阴影 */
  box-shadow: 0 3px 12px 0 rgba(114, 124, 245, 0.05);
}
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 56px;
}
.title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}
.title {
  font-size: 1.33rem;
  font-weight: 600;
  color: #324057;
  letter-spacing: 1px;
}
.icon {
  font-size: 1.3em;
  color: #409eff;
}
.sub-tag {
  margin-left: 7px;
}

.trips-list-row {
  min-height: 200px;
  margin-top: 10px;
}

.trip-col {
  padding-bottom: 18px;
}
.trip-card {
  border-radius: 10px;
  min-height: 140px;
  transition: box-shadow .23s;
}
.trip-card:hover {
  box-shadow: 0 5px 15px 0 rgba(64,158,255,0.12);
}
.trip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.trip-name {
  font-weight: 500;
  font-size: 1.1rem;
  color: #333;
}
.trip-desc {
  font-size: 15px;
  color: #666;
  margin-bottom: 10px;
  min-height: 54px;
  margin-top: 5px;
}
.trip-footer {
  text-align: right;
}
.del-btn {
  color: #e55a41;
}

.empty-block {
  margin-top: 80px;
  min-height: 340px;
}

@media (max-width: 768px) {
  .trips-list-row {
    margin-top: 0;
  }
  .trip-desc { min-height: 38px; }
}

</style>
