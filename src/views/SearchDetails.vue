<template>
  <div class="search-details">
    <h1 class="title">{{ city }}景点列表</h1>
    <ul class="attractions-list">
      <li v-for="attraction in attractions" :key="attraction.id" class="attraction-item">
        <img :src="attraction.imageUrl" :alt="attraction.name" class="attraction-image" />
        <div class="attraction-info">
          <h2 class="attraction-name">{{ attraction.name }}</h2>
          <p class="attraction-description">{{ attraction.description }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "SearchDetails",
  data() {
    return {
      city: "洛杉矶", // 默认城市名称
      attractions: [
        {
          id: 1,
          name: "好莱坞星光大道",
          imageUrl: require("@/assets/images/la/hollywood.png"), // 确保图片路径正确
          description: "世界著名的好莱坞星光大道，感受电影文化的魅力。",
        },
        {
          id: 2,
          name: "圣莫尼卡海滩",
          imageUrl: require("@/assets/images/la/santa-monica.png"),
          description: "洛杉矶最受欢迎的海滩之一，享受阳光与海浪。",
        },
        {
          id: 3,
          name: "格里菲斯天文台",
          imageUrl: require("@/assets/images/la/universal-studios.png"),
          description: "俯瞰洛杉矶全景的最佳地点，夜晚星空尤为迷人。",
        },
      ],
    };
  },
  created() {
    // 从路由参数中获取城市名称
    if (this.$route.params.city) {
      this.city = this.$route.params.city;
    }
  },
};
</script>

<style scoped>
.search-details {
  text-align: center;
  padding: 20px;
}

.title {
  font-size: 2rem;
  margin-bottom: 20px;
}

.attractions-list {
  list-style: none;
  padding: 0;
}

.attraction-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
}

.attraction-image {
  width: 150px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  margin-right: 20px;
}

.attraction-info {
  text-align: left;
}

.attraction-name {
  font-size: 1.5rem;
  margin: 0;
}

.attraction-description {
  font-size: 1rem;
  color: #555;
}
</style>
