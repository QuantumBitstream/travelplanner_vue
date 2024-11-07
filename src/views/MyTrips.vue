<template>
  <div class="my-trips-page">
    <h1>洛杉矶行程</h1>
    <div v-if="trips.length">
      <ul>
        <li v-for="trip in trips" :key="trip.id" class="trip-item">
          <h2>{{ trip.name }}</h2>
          <p>{{ trip.description }}</p>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>您还没有安排任何洛杉矶的行程。</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyTrips',
  data() {
    return {
      trips: [] // 用于存储洛杉矶行程的数据
    }
  },
  created() {
    this.fetchTrips(); // 在组件创建时获取洛杉矶行程
  },
  methods: {
    fetchTrips() {
      // 模拟从服务器获取洛杉矶的行程数据
      setTimeout(() => {
        this.trips = [
          {
            id: 1,
            name: '好莱坞之旅',
            description: '参观传奇的好莱坞标志和漫步星光大道。'
          },
          {
            id: 2,
            name: '圣塔莫尼卡海滩',
            description: '享受加州阳光下的美丽海滩和著名的码头。'
          },
          {
            id: 3,
            name: '盖蒂博物馆',
            description: '探索独特的建筑和丰富的艺术收藏。'
          }
        ];
      }, 1000); // 模拟网络请求的延迟
    }
  }
}
</script>

<style scoped>
.my-trips-page {
  padding: 20px;
}

.trip-item {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.trip-item h2 {
  margin-top: 0;
  color: #333;
}

.trip-item p {
  color: #666;
}
</style>
