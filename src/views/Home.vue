<template>
  <div class="home">
    <!-- 轮播图部分 -->
    <div class="banner">
      <el-carousel height="500px" arrow="always">
        <el-carousel-item v-for="banner in banners" :key="banner.id">
          <div
              class="banner-item"
              :style="{ backgroundImage: `url(${banner.imageUrl})` }"
          >
            <div class="banner-content">
              <h1>{{ banner.title }}</h1>
              <p>{{ banner.subtitle }}</p>
              <el-button type="primary" size="large" @click="handleExplore(banner)">
                立即探索
              </el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 搜索部分 -->
    <div class="search-section">
      <div class="search-box">
        <el-input
            v-model="searchText"
            placeholder="搜索目的地、景点、攻略..."
            class="search-input"
            prefix-icon="el-icon-search"
        >
          <template #append>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </div>
    </div>

    <!-- 热门目的地 -->
    <div class="destinations-section">
      <div class="section-header">
        <h2>热门目的地</h2>
        <router-link to="/destinations" class="view-more">
          查看更多 <i class="el-icon-arrow-right"></i>
        </router-link>
      </div>
      <div class="destinations-grid">
        <div
            v-for="dest in destinations"
            :key="dest.id"
            class="destination-card"
            @click="goToDestination(dest)"
        >
          <el-image :src="dest.imageUrl" fit="cover" class="destination-image"/>
          <div class="destination-info">
            <h3>{{ dest.name }}</h3>
            <p>{{ dest.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 精选行程 -->
    <div class="featured-trips">
      <div class="section-header">
        <h2>精选行程</h2>
        <router-link to="/trips" class="view-more">
          查看更多 <i class="el-icon-arrow-right"></i>
        </router-link>
      </div>
      <div class="trips-grid">
        <div
            v-for="trip in trips"
            :key="trip.id"
            class="trip-card"
            @click="goToTrip(trip)"
        >
          <el-image :src="trip.imageUrl" fit="cover" class="trip-image"/>
          <div class="trip-info">
            <h3>{{ trip.title }}</h3>
            <p>{{ trip.description }}</p>
            <div class="trip-meta">
              <span class="duration">
                <i class="el-icon-timer"></i>
                {{ trip.duration }}天
              </span>
              <span class="price">¥{{ trip.price }}起</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      searchText: '',
      banners: [
        {
          id: 1,
          imageUrl: require('@/assets/images/banner1.jpeg'),
          title: '探索世界的美好',
          subtitle: '开启您的完美旅程'
        },
        {
          id: 2,
          imageUrl: require('@/assets/images/banner2.jpeg'),
          title: '遇见最美风景',
          subtitle: '记录精彩时刻'
        }
      ],
      destinations: [
        {
          id: 1,
          name: '北京',
          imageUrl: require('@/assets/images/beijing.jpeg'), // 确保路径正确
          description: '感受古都魅力，探索现代文明'
        },
        {
          id: 2,
          name: '悉尼',
          imageUrl: require('@/assets/images/sydney.jpg'), // 更新为悉尼的图片
          description: '享受海港城市的美丽风光和多元文化'
        },
        {
          id: 3,
          name: '维也纳',
          imageUrl: require('@/assets/images/vienna.jpeg'), // 更新为维也纳的图片
          description: '体验音乐之都的优雅与历史'
        }
      ],
      trips: [
        {
          id: 1,
          title: '江南水乡之旅',
          imageUrl: require('@/assets/images/jiangnan.png'),
          description: '探索江南古镇，感受水乡文化',
          duration: 4,
          price: 2999
        },
        {
          id: 2,
          title: '云南民族风情游',
          imageUrl: require('@/assets/images/yunnan.png'),
          description: '体验多彩民族文化，领略自然风光',
          duration: 6,
          price: 3999
        },
        {
          id: 3,
          title: '西藏心灵之旅',
          imageUrl: require('@/assets/images/tibet.png'),
          description: '探访神秘西藏，感受心灵净化',
          duration: 8,
          price: 5999
        }
      ]
    }
  },
  methods: {
    handleSearch() {
      if (!this.searchText.trim()) return
      this.$router.push({
        path: '/search',
        query: { q: this.searchText }
      })
    },
    handleExplore(banner) {
      console.log('探索:', banner)
      // 实现探索逻辑
    },
    goToDestination(destination) {
      this.$router.push(`/destination/${destination.id}`)
    },
    goToTrip(trip) {
      this.$router.push(`/trip/${trip.id}`)
    }
  }
}
</script>

<style scoped>
.home {
  width: 100%;
}

.banner {
  width: 100%;
  margin-bottom: 2rem;
}

.banner-item {
  height: 500px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.banner-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.banner-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.banner-content p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.search-section {
  max-width: 800px;
  margin: 0 auto 3rem;
  padding: 0 1rem;
}

.search-box {
  width: 100%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0 1rem;
}

.section-header h2 {
  font-size: 1.8rem;
  color: #333;
  margin: 0;
}

.view-more {
  display: flex;
  align-items: center;
  color: var(--el-color-primary);
  text-decoration: none;
  font-size: 1rem;
}

.view-more .el-icon {
  margin-left: 0.5rem;
}

.destinations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 0 1rem;
  margin-bottom: 3rem;
}

.destination-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--el-box-shadow-light);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.destination-card:hover {
  transform: translateY(-5px);
}

.destination-card .destination-image {
  width: 100%;
  height: 200px;
}

.destination-info {
  padding: 1rem;
}

.destination-info h3 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
}

.destination-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.trips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 0 1rem;
  margin-bottom: 3rem;
}

.trip-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.trip-card:hover {
  transform: translateY(-5px);
}

.trip-image {
  width: 100%;
  height: 200px;
}

.trip-info {
  padding: 1rem;
}

.trip-info h3 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
}

.trip-info p {
  margin: 0 0 1rem;
  color: #666;
  font-size: 0.9rem;
}

.trip-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
  font-size: 0.9rem;
}

.duration {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price {
  color: var(--el-color-danger);
  font-weight: bold;
}

@media (max-width: 768px) {
  .banner-content h1 {
    font-size: 2rem;
  }

  .banner-content p {
    font-size: 1.2rem;
  }

  .destinations-grid,
  .trips-grid {
    grid-template-columns: 1fr;
  }
}
</style>
