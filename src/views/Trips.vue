<template>
  <div class="trips">
    <h1>旅行产品列表</h1>
    <div class="trip-list">
      <div v-for="(trip, index) in trips" :key="index" class="trip-card">
        <img :src="trip.image" :alt="trip.title" class="trip-image" />
        <div class="trip-info">
          <h2>{{ trip.title }}</h2>
          <p>{{ trip.description }}</p>
          <div class="trip-footer">
            <span class="trip-price">¥{{ trip.price }} 起</span>
            <button @click="viewDetails(trip.id)">查看详情</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TripsView',
  data() {
    return {
      trips: [
        {
          id: 1,
          title: '洛杉矶深度游',
          image: require('@/assets/logo.png'),
          description: '探索洛杉矶的魅力，享受阳光与沙滩。',
          price: 9999
        },
        {
          id: 2,
          title: '纽约城市探险',
          image: require('@/assets/logo.png'),
          description: '体验纽约的繁华与多元文化。',
          price: 10999
        },
        {
          id: 3,
          title: '旧金山浪漫之旅',
          image: require('@/assets/logo.png'),
          description: '漫步金门大桥，享受浪漫时光。',
          price: 8999
        }
        // 可以添加更多旅行产品
      ]
    };
  },
  methods: {
    viewDetails(tripId) {
      // 跳转到详细页面
      this.$router.push({ name: 'TripDetails', params: { id: tripId } });
    }
  }
};
</script>

<style scoped>
.trips {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
}

.trip-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.trip-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.trip-card:hover {
  transform: translateY(-5px);
}

.trip-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.trip-info {
  padding: 15px;
}

.trip-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.trip-price {
  font-size: 18px;
  color: #ff6b6b;
  font-weight: bold;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
