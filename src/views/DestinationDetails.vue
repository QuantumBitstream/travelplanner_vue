<template>
  <div class="destination-details" v-if="destination">
    <!-- 顶部图片轮播 -->
    <el-carousel :interval="4000" type="card" height="400px" class="image-carousel">
      <el-carousel-item v-for="(image, index) in destination.images" :key="index">
        <img :src="image.url" :alt="image.alt" class="carousel-image">
      </el-carousel-item>
    </el-carousel>

    <!-- 目的地基本信息 -->
    <div class="destination-header">
      <h1>{{ destination.name }}</h1>
      <div class="destination-meta">
        <el-tag>{{ destination.climate }}</el-tag>
        <el-tag type="success">{{ destination.bestTime }}</el-tag>
        <el-tag type="warning">{{ destination.timezone }}</el-tag>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <el-row :gutter="20" class="main-content">
      <el-col :span="16">
        <!-- 目的地介绍 -->
        <el-card class="content-section">
          <template #header>
            <div class="section-header">
              <h2>目的地介绍</h2>
            </div>
          </template>
          <p>{{ destination.description }}</p>
        </el-card>

        <!-- 景点推荐 -->
        <el-card class="content-section">
          <template #header>
            <div class="section-header">
              <h2>必游景点</h2>
            </div>
          </template>
          <el-collapse v-model="activeAttractions">
            <el-collapse-item v-for="attraction in destination.attractions"
                              :key="attraction.id"
                              :title="attraction.name"
                              :name="attraction.id">
              <div class="attraction-content">
                <img :src="attraction.image" :alt="attraction.name" class="attraction-image">
                <div class="attraction-info">
                  <p>{{ attraction.description }}</p>
                  <div class="attraction-details">
                    <span><i class="el-icon-time"></i> 建议游览时长：{{ attraction.duration }}</span>
                    <span><i class="el-icon-location"></i> 地址：{{ attraction.address }}</span>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>

      <el-col :span="8">
        <!-- 实用信息 -->
        <el-card class="content-section">
          <template #header>
            <div class="section-header">
              <h2>实用信息</h2>
            </div>
          </template>
          <div class="practical-info">
            <div class="info-item">
              <h3>最佳旅行季节</h3>
              <p>{{ destination.practicalInfo.bestSeason }}</p>
            </div>
            <div class="info-item">
              <h3>交通方式</h3>
              <p>{{ destination.practicalInfo.transportation }}</p>
            </div>
            <div class="info-item">
              <h3>货币</h3>
              <p>{{ destination.practicalInfo.currency }}</p>
            </div>
            <div class="info-item">
              <h3>语言</h3>
              <p>{{ destination.practicalInfo.language }}</p>
            </div>
          </div>
        </el-card>

        <!-- 天气信息 -->
        <el-card class="content-section weather-card">
          <template #header>
            <div class="section-header">
              <h2>近期天气</h2>
            </div>
          </template>
          <div class="weather-info">
            <div v-for="(weather, index) in destination.weather"
                 :key="index"
                 class="weather-day">
              <span>{{ weather.date }}</span>
              <el-icon :class="weather.icon"></el-icon>
              <span>{{ weather.temp }}°C</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 相关推荐 -->
    <el-card class="content-section">
      <template #header>
        <div class="section-header">
          <h2>相关推荐</h2>
        </div>
      </template>
      <div class="recommendations">
        <el-row :gutter="20">
          <el-col :span="8" v-for="rec in destination.recommendations" :key="rec.id">
            <el-card :body-style="{ padding: '0px' }" @click="goToDestination(rec.id)">
              <img :src="rec.image" class="recommendation-image">
              <div class="recommendation-info">
                <h3>{{ rec.name }}</h3>
                <p>{{ rec.description }}</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'DestinationDetails',
  data() {
    return {
      destination: null,
      activeAttractions: ['1'],
      loading: true
    };
  },
  created() {
    // 模拟API调用获取目的地数据
    this.fetchDestinationData();
  },
  methods: {
    fetchDestinationData() {
      // 模拟API调用
      setTimeout(() => {
        this.destination = {
          id: 'la',
          name: '洛杉矶',
          climate: '地中海气候',
          bestTime: '3-5月、9-11月',
          timezone: 'UTC-8',
          images: [
            { url: require('@/assets/images/la/hollywood.png'), alt: '好莱坞标志' },
            { url: require('@/assets/images/la/santa-monica.png'), alt: '圣莫尼卡海滩' },
            { url: require('@/assets/images/la/universal.png'), alt: '环球影城' }
          ],
          description: '洛杉矶是美国加利福尼亚州最大的城市，也是美国的第二大城市。这里阳光明媚，气候宜人，拥有众多世界级的景点和娱乐设施。从好莱坞的星光大道到迪士尼乐园，从圣莫尼卡海滩到格里菲斯天文台，这里有着无数精彩纷呈的景点等待您的探索。',
          attractions: [
            {
              id: '1',
              name: '好莱坞环球影城',
              image: require('@/assets/images/la/universal-studios.png'),
              description: '好莱坞环球影城是世界上最大的电影制片厂和主题公园之一，这里让您体验到电影的神奇魅力。',
              duration: '1整天',
              address: '100 Universal City Plaza, Universal City, CA 91608'
            },
            {
              id: '2',
              name: '迪士尼乐园',
              image: require('@/assets/images/la/disneyland.png'),
              description: '加州迪士尼乐园是华特·迪士尼的第一个主题公园，被称为"地球上最快乐的地方"。',
              duration: '1-2天',
              address: '1313 Disneyland Dr, Anaheim, CA 92802'
            }
          ],
          practicalInfo: {
            bestSeason: '春秋季节最适合旅游，气温适中，阳光充足',
            transportation: '建议租车自驾，也可以使用优步或地铁等公共交通',
            currency: '美元（USD）',
            language: '英语'
          },
          weather: [
            { date: '今天', icon: 'el-icon-sunny', temp: 25 },
            { date: '明天', icon: 'el-icon-sunny', temp: 26 },
            { date: '后天', icon: 'el-icon-cloudy', temp: 24 }
          ],
          recommendations: [
            {
              id: 'sf',
              name: '旧金山',
              image: require('@/assets/images/sf.png'),
              description: '金门大桥、渔人码头，体验不一样的加州风情'
            },
            {
              id: 'ch',
              name: '芝加哥',
              image: require('@/assets/images/ch.png'),
              description: '风城，建筑艺术与深厚文化底蕴的现代都会'
            },
            {
              id: 'sd',
              name: '圣地亚哥',
              image: require('@/assets/images/sd.png'),
              description: '海滨城市，完美的度假胜地'
            }
          ]
        };
        this.loading = false;
      }, 1000);
    },
    goToDestination(id) {
      this.$router.push(`/destination/${id}`);
    }
  }
};
</script>

<style scoped>
.destination-details {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.image-carousel {
  margin-bottom: 30px;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.destination-header {
  text-align: center;
  margin-bottom: 30px;
}

.destination-header h1 {
  font-size: 2.5em;
  margin-bottom: 15px;
}

.destination-meta {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.content-section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h2 {
  margin: 0;
  font-size: 1.5em;
}

.attraction-content {
  display: flex;
  gap: 20px;
}

.attraction-image {
  width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.attraction-info {
  flex: 1;
}

.attraction-details {
  margin-top: 10px;
  display: flex;
  gap: 20px;
  color: #666;
}

.practical-info .info-item {
  margin-bottom: 15px;
}

.practical-info h3 {
  font-size: 1.1em;
  margin-bottom: 5px;
  color: #333;
}

.weather-info {
  display: flex;
  justify-content: space-around;
}

.weather-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.recommendation-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.recommendation-info {
  padding: 15px;
}

.recommendation-info h3 {
  margin: 0 0 10px 0;
}

.recommendation-info p {
  margin: 0;
  color: #666;
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }

  .attraction-content {
    flex-direction: column;
  }

  .attraction-image {
    width: 100%;
    height: 200px;
  }
}
</style>
