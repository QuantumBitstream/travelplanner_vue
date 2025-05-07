<template>
  <div class="weather-container">
    <el-card>
      <template #header>
        <div class="header">
          <h2>实时天气 SSE 推送</h2>
          <el-tag v-if="connected" type="success">已连接</el-tag>
          <el-tag v-else type="danger">未连接</el-tag>
        </div>
      </template>

      <el-form inline>
        <el-form-item label="城市名称">
          <el-input
              v-model="city"
              placeholder="输入城市名称（如：Beijing）"
              @keyup.enter="startStream"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
              type="primary"
              :loading="loading"
              @click="startStream"
          >
            开始监听
          </el-button>
          <el-button @click="stopStream" :disabled="!connected">
            停止
          </el-button>
        </el-form-item>
      </el-form>

      <div v-if="weatherData" class="weather-info">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="location">
              <h3>{{ weatherData.location.name }}, {{ weatherData.location.country }}</h3>
              <p>{{ getCurrentTime() }}</p>
            </div>
            <div class="temp-info">
              <span class="temp">{{ weatherData.current.temp_c }}°C</span>
              <img
                  v-if="weatherData.current.condition.icon"
                  :src="weatherData.current.condition.icon"
                  :alt="weatherData.current.condition.text"
              />
              <span class="condition">{{ weatherData.current.condition.text }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="体感温度">{{ weatherData.current.feelslike_c }}°C</el-descriptions-item>
              <el-descriptions-item label="湿度">{{ weatherData.current.humidity }}%</el-descriptions-item>
              <el-descriptions-item label="风速">{{ weatherData.current.wind_kph }} km/h</el-descriptions-item>
              <el-descriptions-item label="风向">{{ weatherData.current.wind_dir }}</el-descriptions-item>
              <el-descriptions-item label="气压">{{ weatherData.current.pressure_mb }} mb</el-descriptions-item>
              <el-descriptions-item label="紫外线指数">{{ weatherData.current.uv }}</el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>

        <el-divider></el-divider>

        <div class="update-history">
          <h4>更新历史</h4>
          <el-timeline>
            <el-timeline-item
                v-for="(update, index) in updateHistory"
                :key="index"
                :timestamp="update.time"
                type="primary"
            >
              温度: {{ update.temp }}°C,
              湿度: {{ update.humidity }}%
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>

      <el-empty v-else description="暂无天气数据"></el-empty>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';

const city = ref('Beijing');
const weatherData = ref(null);
const connected = ref(false);
const loading = ref(false);
const updateHistory = ref([]);
let eventSource = null;

const getCurrentTime = () => {
  return new Date().toLocaleString();
};

const startStream = () => {
  if (!city.value) {
    ElMessage.warning('请输入城市名称');
    return;
  }

  // 关闭已有连接
  stopStream();

  loading.value = true;

  // 创建 EventSource 连接
  const apiUrl = `http://localhost:8081/api/weather/stream?city=${encodeURIComponent(city.value)}`;
  eventSource = new EventSource(apiUrl);

  // 连接建立
  eventSource.onopen = () => {
    connected.value = true;
    loading.value = false;
    ElMessage.success('SSE连接已建立');
  };

  // 监听名为 "weather-update" 的事件
  eventSource.addEventListener('weather-update', (event) => {
    const data = JSON.parse(event.data);
    weatherData.value = data;
    console.log('weatherData: ', weatherData);

    // 添加到更新历史
    updateHistory.value.unshift({
      time: getCurrentTime(),
      temp: data.current.temp_c,
      humidity: data.current.humidity
    });

    // 保留最近10条记录
    if (updateHistory.value.length > 10) {
      updateHistory.value = updateHistory.value.slice(0, 10);
    }
  });

  // 错误处理
  eventSource.onerror = (error) => {
    ElMessage.error('SSE连接出错');
    console.error('SSE错误:', error);
    stopStream();
    loading.value = false;
  };
};

const stopStream = () => {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
    connected.value = false;
    ElMessage.info('已停止SSE连接');
  }
};

onUnmounted(() => {
  stopStream();
});
</script>

<style scoped>
.weather-container {
  max-width: 800px;
  margin: 0 auto;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.temp-info {
  display: flex;
  align-items: center;
  margin: 20px 0;
}
.temp {
  font-size: 40px;
  font-weight: bold;
  margin-right: 15px;
}
.condition {
  margin-left: 10px;
}
.update-history {
  margin-top: 20px;
}
</style>
