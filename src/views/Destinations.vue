<template>
  <div class="destinations">
    <div class="header">
      <h1>热门目的地</h1>
      <p>发现我们推荐的最佳旅行目的地</p>
    </div>

    <div class="destinations-grid">
      <el-card
          v-for="destination in destinations"
          :key="destination.id"
          class="destination-card"
          @click="viewDestination(destination)"
          :body-style="{ padding: '0px' }"
      >
        <img :src="destination.imageUrl" alt="" class="destination-image" />
        <div class="destination-info">
          <h3>{{ destination.name }}</h3>
          <p>{{ destination.shortDescription }}</p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DestinationsView',
  data() {
    return {
      destinations: [
        {
          id: 1,
          name: '桂林',
          imageUrl: require('@/assets/images/guilin.png'),
          shortDescription: '青山绿水，甲天下的风光',
        },
        {
          id: 2,
          name: '苏州',
          imageUrl: require('@/assets/images/suzhou.png'),
          shortDescription: '园林之美，江南风情浓郁',
        },
        {
          id: 3,
          name: '丽江',
          imageUrl: require('@/assets/images/lijiang.png'),
          shortDescription: '古城魅力，纳西族文化深厚',
        },
        // 更多目的地...
      ]
    }
  },
  methods: {
    viewDestination(destination) {
      this.$router.push({ path: `/destination/${destination.id}` });
    }
  }
}
</script>

<style scoped>
.destinations {
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 2.5em;
  margin: 0;
  color: #333;
}

.header p {
  font-size: 1.2em;
  color: #666;
}

.destinations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.destination-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.destination-card:hover {
  transform: translateY(-5px);
}

.destination-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.destination-info {
  padding: 10px;
  text-align: center;
}

.destination-info h3 {
  margin: 10px 0 5px;
  color: #333;
}

.destination-info p {
  color: #777;
  font-size: 0.9em;
}

@media(max-width: 768px) {
  .destinations-grid {
    grid-template-columns: 1fr;
  }
}
</style>
