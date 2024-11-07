<template>
  <div class="trip-planner">
    <div class="page-header">
      <h1>旅行规划器</h1>
      <p>设计属于您自己的旅行计划，享受无缝体验</p>
    </div>

    <el-card class="planner-form-card">
      <div class="planner-form">
        <el-form :model="tripData" label-width="100px">
          <!-- 选择目的地 -->
          <el-form-item label="目的地">
            <el-select v-model="tripData.destination" placeholder="请选择目的地">
              <el-option v-for="dest in destinations" :key="dest.id" :value="dest.name" :label="dest.name" />
            </el-select>
          </el-form-item>

          <!-- 选择日期 -->
          <el-form-item label="出发日期">
            <el-date-picker v-model="tripData.startDate" type="date" placeholder="选择日期" />
          </el-form-item>

          <!-- 选择人数 -->
          <el-form-item label="人数">
            <el-input-number v-model="tripData.peopleCount" :min="1" />
          </el-form-item>

          <!-- 添加活动 -->
          <el-form-item label="活动安排">
            <el-input
                v-model="newActivity"
                placeholder="输入活动名称"
                @keyup.enter="addActivity"
            />
            <el-button type="primary" @click="addActivity">添加活动</el-button>
          </el-form-item>

          <!-- 显示活动 -->
          <ul class="activities-list">
            <li v-for="(activity, index) in tripData.activities" :key="index">
              {{ activity }}
              <el-button type="text" @click="removeActivity(index)">移除</el-button>
            </li>
          </ul>

          <!-- 提交按钮 -->
          <el-form-item>
            <el-button type="success" @click="submitPlan">提交计划</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'TripPlanner',
  data() {
    return {
      destinations: [
        { id: 1, name: '巴黎' },
        { id: 2, name: '纽约' },
        { id: 3, name: '东京' },
        // 更多目的地...
      ],
      tripData: {
        destination: '',
        startDate: '',
        peopleCount: 1,
        activities: []
      },
      newActivity: ''
    }
  },
  methods: {
    addActivity() {
      if (this.newActivity.trim()) {
        this.tripData.activities.push(this.newActivity.trim())
        this.newActivity = ''
      }
    },
    removeActivity(index) {
      this.tripData.activities.splice(index, 1)
    },
    submitPlan() {
      if (this.validateForm()) {
        alert('旅行计划已提交！')
        // 这里可以加入进一步的逻辑，比如发送到服务器
      } else {
        alert('请完整填写所有必填项。')
      }
    },
    validateForm() {
      return this.tripData.destination && this.tripData.startDate && this.tripData.activities.length > 0
    }
  }
}
</script>

<style scoped>
.trip-planner {
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.page-header p {
  color: #666;
  font-size: 1.2em;
}

.planner-form-card {
  max-width: 600px;
  margin: 0 auto;
}

.planner-form .el-form-item {
  margin-bottom: 20px;
}

.activities-list {
  list-style: none;
  padding: 0;
}

.activities-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding: 5px 0;
}

.activities-list li .el-button {
  font-size: 0.9em;
  color: #f56c6c;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2em;
  }

  .page-header p {
    font-size: 1em;
  }
}
</style>
