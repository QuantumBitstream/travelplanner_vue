<template>
  <div class="trip-details">
    <!-- 顶部banner -->
    <div class="banner">
      <img :src="tripData.bannerImage" alt="Los Angeles" class="banner-img">
      <div class="banner-overlay">
        <h1>{{ tripData.title }}</h1>
        <div class="basic-info">
          <span><i class="fas fa-clock"></i> {{ tripData.duration }}天</span>
          <span><i class="fas fa-map-marker-alt"></i> {{ tripData.location }}</span>
          <span><i class="fas fa-dollar-sign"></i> {{ tripData.price }}起</span>
        </div>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="main-content">
      <!-- 行程概览 -->
      <section class="section">
        <h2>行程概览</h2>
        <div class="overview-cards">
          <div v-for="(item, index) in tripData.overview"
               :key="index"
               class="overview-card">
            <i :class="item.icon"></i>
            <h3>{{ item.title }}</h3>
            <p>{{ item.content }}</p>
          </div>
        </div>
      </section>

      <!-- 行程亮点 -->
      <section class="section">
        <h2>行程亮点</h2>
        <div class="highlights">
          <div v-for="(highlight, index) in tripData.highlights"
               :key="index"
               class="highlight-item">
            <div class="highlight-number">{{ index + 1 }}</div>
            <div class="highlight-content">
              <h3>{{ highlight.title }}</h3>
              <p>{{ highlight.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 每日行程 -->
      <section class="section">
        <h2>每日行程</h2>
        <div class="daily-itinerary">
          <div v-for="(day, index) in tripData.itinerary"
               :key="index"
               class="day-card">
            <div class="day-header">
              <h3>第{{ index + 1 }}天</h3>
              <span>{{ day.title }}</span>
            </div>
            <div class="day-content">
              <div v-for="(activity, actIndex) in day.activities"
                   :key="actIndex"
                   class="activity">
                <span class="time">{{ activity.time }}</span>
                <div class="activity-details">
                  <h4>{{ activity.title }}</h4>
                  <p>{{ activity.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 费用说明 -->
      <section class="section">
        <h2>费用说明</h2>
        <div class="price-details">
          <div class="price-section">
            <h3>费用包含</h3>
            <ul>
              <li v-for="(item, index) in tripData.priceIncludes"
                  :key="index">{{ item }}</li>
            </ul>
          </div>
          <div class="price-section">
            <h3>费用不含</h3>
            <ul>
              <li v-for="(item, index) in tripData.priceExcludes"
                  :key="index">{{ item }}</li>
            </ul>
          </div>
        </div>
      </section>
    </div>

    <!-- 底部预订栏 -->
    <div class="booking-bar">
      <div class="price">
        <span class="amount">￥{{ tripData.price }}</span>
        <span class="unit">起/人</span>
      </div>
      <button @click="handleBooking" class="book-btn">立即预订</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TripDetails',
  data() {
    return {
      tripData: {
        title: '洛杉矶深度探索之旅',
        bannerImage: require('@/assets/logo.png'),
        duration: 7,
        location: '美国·洛杉矶',
        price: 0,
        overview: [
          {
            icon: 'fas fa-calendar',
            title: '最佳旅行时间',
            content: '3月-5月，9月-11月'
          },
          {
            icon: 'fas fa-user-friends',
            title: '适合人群',
            content: '情侣、家庭、好友'
          },
          {
            icon: 'fas fa-plane',
            title: '交通方式',
            content: '飞机 + 巴士'
          },
          {
            icon: 'fas fa-hotel',
            title: '住宿标准',
            content: '4星级酒店'
          }
        ],
        highlights: [
          {
            title: '好莱坞环球影城',
            description: '体验世界顶级主题公园，感受电影的魅力'
          },
          {
            title: '圣塔莫尼卡海滩',
            description: '欣赏太平洋日落，体验海滨生活'
          },
          {
            title: '格里菲斯天文台',
            description: '俯瞰洛杉矶全景，观赏好莱坞标志'
          }
        ],
        itinerary: [
          {
            title: '抵达洛杉矶',
            activities: [
              {
                time: '14:00',
                title: '抵达机场',
                description: 'LAX机场接机，入住酒店'
              },
              {
                time: '16:00',
                title: '圣塔莫尼卡码头',
                description: '参观太平洋公园，体验摩天轮'
              }
            ]
          },
          {
            title: '环球影城一日游',
            activities: [
              {
                time: '09:00',
                title: '环球影城',
                description: '全天游玩环球影城，体验各种惊险刺激的项目'
              },
              {
                time: '16:00',
                title: '格里菲斯天文台',
                description: '俯瞰洛杉矶全景，观赏好莱坞标志'
              }
            ]
          }
          // 可以添加更多天数的行程...
        ],
        priceIncludes: [
          '洛杉矶当地住宿',
          '行程中所列景点门票',
          '全程空调旅游巴士',
          '专业导游服务'
        ],
        priceExcludes: [
          '国际往返机票',
          '餐费',
          '个人消费',
          '旅游保险'
        ]
      }
    }
  },
  methods: {
    handleBooking() {
      // 处理预订逻辑
      console.log('开始预订流程')
      // 推荐用vuex存储产品详细信息，预订页直接从vuex取，这样用户刷新也不会丢失
      this.$store.commit('booking/setBookingInfo', this.tripData)
      this.$router.push({ name: 'Booking' })
    }
  }
}
</script>

<style scoped>
.trip-details {
  padding-bottom: 60px;
}

.banner {
  position: relative;
  height: 400px;
  overflow: hidden;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  color: white;
}

.basic-info {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.section {
  margin-bottom: 40px;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.overview-card {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
}

.highlights {
  display: grid;
  gap: 20px;
}

.highlight-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.highlight-number {
  width: 40px;
  height: 40px;
  background: #007bff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.day-card {
  margin-bottom: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.day-header {
  padding: 15px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.day-content {
  padding: 20px;
}

.activity {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.time {
  min-width: 80px;
  color: #666;
}

.price-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.price-section ul {
  list-style: none;
  padding: 0;
}

.price-section li {
  margin-bottom: 10px;
  padding-left: 20px;
  position: relative;
}

.price-section li:before {
  content: "•";
  position: absolute;
  left: 0;
  color: #007bff;
}

.booking-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: white;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price .amount {
  font-size: 24px;
  color: #ff6b6b;
  font-weight: bold;
}

.book-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
}

.book-btn:hover {
  background: #ff5252;
}

@media (max-width: 768px) {
  .banner {
    height: 300px;
  }

  .price-details {
    grid-template-columns: 1fr;
  }

  .basic-info {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
