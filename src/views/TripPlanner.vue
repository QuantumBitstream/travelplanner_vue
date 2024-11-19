<template>
  <div class="trip-planner">

    <div class="page-header">
      <h1>旅行规划器</h1>
      <p>设计属于您自己的旅行计划，享受无缝体验</p>
    </div>

    <div class="global-container-flex-row">

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

            <!-- 选择天数 -->
            <el-form-item label="旅行天数">
              <el-input-number v-model="tripData.days" :min="1" :max="15" />
            </el-form-item>

            <!-- 选择人数 -->
            <el-form-item label="人数">
              <el-input-number v-model="tripData.peopleCount" :min="1" />
            </el-form-item>

            <!-- 添加活动 -->
            <el-form-item label="活动安排">
              <el-select v-model="newActivityDay" placeholder="选择天">
                <el-option v-for="n in tripData.days" :key="n" :value="n" :label="'第' + n + '天'" />
              </el-select>
              <el-autocomplete
                  v-model="newActivity"
                  :fetch-suggestions="fetchSuggestions"
                  placeholder="输入活动名称(目的地景点)"
                  @select="onSelectSuggestion"
              />
              <el-input
                  v-model="newActivityDescription"
                  placeholder="输入活动描述"
              />
              <el-time-picker
                  v-model="newActivityTime"
                  placeholder="选择活动时间"
                  value-format="HH:mm"
                  format="HH:mm"
              />
              <el-button type="primary" @click="addActivity">添加活动</el-button>
            </el-form-item>

            <!-- 提交按钮 -->
            <el-form-item>
              <el-button type="success" @click="submitPlan">提交计划</el-button>
            </el-form-item>

            <!-- 生成行程计划 -->
            <el-form-item>
              <el-button type="primary" @click="generateItinerary">生成行程计划</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>

      <div>
        <OverlayPin></OverlayPin>
      </div>

    </div>

    <!-- 显示活动 -->
    <div v-for="day in tripData.days" :key="day" class="day-activities">
      <h4>第{{ day }}天:</h4>
      <ul class="activities-list">
        <li v-for="(activity, index) in getActivitiesForDay(day)" :key="index">
          {{ activity.name }} - {{ activity.description }} - {{ activity.time }}
          <el-button type="text" @click="removeActivity(day, index)">移除</el-button>
        </li>
      </ul>
    </div>

    <!-- 显示生成的行程 -->
    <div v-if="itinerary.length" class="itinerary">
      <h3>生成的行程计划</h3>
      <ul>
        <li v-for="(day, index) in itinerary" :key="index">
          第{{ index + 1 }}天 ({{ day.date }}):
          <ul>
            <li v-for="activity in day.activities" :key="activity.name">
              {{ activity.name }} - {{ activity.description }} - {{ activity.time }}
            </li>
          </ul>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import OverlayPin from "@/components/OverlayPin.vue";
import { ref } from 'vue';
import dayjs from 'dayjs';

// 假设有一个函数可以优化活动顺序
function optimizeRoute(activities) {
  // Mock implementation: simply return activities in reverse order for demonstration
  return activities.slice().reverse();
}

export default {
  name: 'TripPlanner',
  components: {OverlayPin},
  setup() {
    const destinations = [
      {id: 1, name: '北京'},
      {id: 2, name: '纽约'},
      {id: 3, name: '洛杉矶'},
      // 更多目的地...
    ];

    const tripData = ref({
      destination: '',
      startDate: '',
      days: 1,
      peopleCount: 1,
      activities: Array.from({length: 15}, () => [])
    });

    const newActivity = ref('');
    const newActivityDescription = ref('');
    const newActivityTime = ref('');
    const newActivityDay = ref(1);
    const itinerary = ref([]);

    const addActivity = () => {
      if (newActivity.value.trim() && newActivityDay.value) {
        console.log('newActivityTime.value: ',newActivityTime.value);
        tripData.value.activities[newActivityDay.value - 1].push({
          name: newActivity.value.trim(),
          description: newActivityDescription.value.trim(),
          time: newActivityTime.value
        });
        newActivity.value = '';
        newActivityDescription.value = '';
        newActivityTime.value = '';
      }
    };

    const removeActivity = (day, index) => {
      tripData.value.activities[day - 1].splice(index, 1);
    };

    const getActivitiesForDay = (day) => {
      return tripData.value.activities[day - 1] || [];
    };

    const fetchSuggestions = (queryString, cb) => {
      const suggestions = [
        { value: '埃菲尔铁塔' },
        { value: '卢浮宫' },
        { value: '时代广场' },
        // 更多景点...
      ];
      cb(suggestions.filter(s => s.value.toLowerCase().includes(queryString.toLowerCase())));
    };

    const onSelectSuggestion = (item) => {
      newActivity.value = item.value;
    };

    const submitPlan = () => {
      if (validateForm()) {
        alert('旅行计划已提交！');
        // 可以将数据发送到服务器
      } else {
        alert('请完整填写所有必填项。');
      }
    };

    const validateForm = () => {
      return (
          tripData.value.destination &&
          tripData.value.startDate &&
          tripData.value.activities.some(dayActivities => dayActivities.length > 0)
      );
    };

    const generateItinerary = () => {
      if (!tripData.value.startDate) {
        alert('请选择出发日期！');
        return;
      }

      itinerary.value = Array.from({length: tripData.value.days}, (_, index) => {
        const date = dayjs(tripData.value.startDate).add(index, 'day').format('YYYY-MM-DD');
        const activitiesForDay = tripData.value.activities[index] || [];
        console.log( 'activitiesForDay: ', activitiesForDay );
        return {
          date,
          activities: optimizeRoute(activitiesForDay)
        };
      });
    };

    return {
      destinations,
      tripData,
      newActivity,
      newActivityDescription,
      newActivityTime,
      newActivityDay,
      itinerary,
      addActivity,
      removeActivity,
      getActivitiesForDay,
      fetchSuggestions,
      onSelectSuggestion,
      submitPlan,
      generateItinerary
    };
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
  max-width: 450px;
  margin: 0 auto;
}

.planner-form .el-form-item {
  margin-bottom: 20px;
}

.day-activities {
  margin-top: 20px;
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

.itinerary {
  margin: 20px 0;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
}

.itinerary h3 {
  margin-bottom: 15px;
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
