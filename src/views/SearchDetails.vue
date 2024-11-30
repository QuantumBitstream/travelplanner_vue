<template>
  <div class="search-details">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <div class="nav-container">
        <el-button @click="$router.push('/')" type="text">
          <el-icon><Back /></el-icon> 返回首页
        </el-button>
        <h1 class="city-title">{{ city }}景点推荐</h1>
      </div>
    </el-header>

    <!-- 主要内容区域 -->
    <el-main class="main-content">
      <!-- 景点列表 -->
      <el-row :gutter="20" class="attractions-grid">
        <el-col :span="8" v-for="attraction in attractions" :key="attraction.id">
          <el-card class="attraction-card" :body-style="{ padding: '0px' }">
            <div class="image-container">
              <el-image
                  :src="attraction.imageUrl"
                  :alt="attraction.name"
                  fit="cover"
                  loading="lazy"
              >
                <template #error>
                  <div class="image-error">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </div>
            <div class="card-content">
              <h3 class="attraction-name">{{ attraction.name }}</h3>
              <div class="attraction-tags">
                <el-tag size="small" type="success">必游</el-tag>
                <el-tag size="small" type="warning" v-if="attraction.rating">{{ attraction.rating }}分</el-tag>
              </div>
              <p class="attraction-description">{{ attraction.description }}</p>
              <div class="card-actions">
                <el-button type="primary" size="small" @click="showDetails(attraction)">
                  查看详情
                </el-button>
                <el-button type="text" size="small" @click="toggleFavorite(attraction)">
                  <el-icon :class="{ 'is-favorite': attraction.isFavorite }">
                    <Star />
                  </el-icon>
                  {{ attraction.isFavorite ? '已收藏' : '收藏' }}
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>

    <!-- 景点详情对话框 -->
    <el-dialog
        v-model="dialogVisible"
        :title="selectedAttraction?.name"
        width="50%"
        destroy-on-close
    >
      <div v-if="selectedAttraction" class="attraction-details">
        <el-image
            :src="selectedAttraction.imageUrl"
            fit="cover"
            class="detail-image"
        />
        <div class="detail-content">
          <p class="detail-description">{{ selectedAttraction.description }}</p>
          <div class="detail-info">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="开放时间">09:00-18:00</el-descriptions-item>
              <el-descriptions-item label="门票价格">\$20起</el-descriptions-item>
              <el-descriptions-item label="建议游玩">2-3小时</el-descriptions-item>
              <el-descriptions-item label="适合季节">全年</el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Back, Picture, Star } from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";

export default {
  name: "SearchDetails",
  components: {
    Back,
    Picture,
    Star
  },
  data() {
    return {
      city: "洛杉矶",
      dialogVisible: false,
      selectedAttraction: null,
      attractions: [
        {
          id: 1,
          name: "好莱坞星光大道",
          imageUrl: require("@/assets/images/la/hollywood.png"),
          description: "世界著名的好莱坞星光大道，感受电影文化的魅力。漫步其中，寻找喜爱明星的星星印记，体验独特的好莱坞文化。",
          rating: "4.5",
          isFavorite: false
        },
        {
          id: 2,
          name: "圣莫尼卡海滩",
          imageUrl: require("@/assets/images/la/santa-monica.png"),
          description: "洛杉矶最受欢迎的海滩之一，享受加州阳光与太平洋海浪。这里有著名的太平洋公园游乐场，是家庭游玩的理想去处。",
          rating: "4.7",
          isFavorite: false
        },
        {
          id: 3,
          name: "格里菲斯天文台",
          imageUrl: require("@/assets/images/la/Griffith Observatory.png"),
          description: "俯瞰洛杉矶全景的最佳地点，夜晚星空尤为迷人。这里不仅可以观测星空，还能欣赏到好莱坞标志和洛杉矶市区全景。",
          rating: "4.8",
          isFavorite: false
        },
      ],
    };
  },
  methods: {
    showDetails(attraction) {
      this.selectedAttraction = attraction;
      this.dialogVisible = true;
    },
    toggleFavorite(attraction) {
      attraction.isFavorite = !attraction.isFavorite;
      ElMessage({
        message: attraction.isFavorite ? '已添加到收藏' : '已取消收藏',
        type: 'success'
      });
    }
  },
  created() {
    if (this.$route.params.city) {
      this.city = this.$route.params.city;
    }
  },
};
</script>

<style scoped>
.header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 20px;
}

.city-title {
  font-size: 1.5rem;
  margin: 0;
  margin-left: 20px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.attractions-grid {
  margin-top: 20px;
}

.attraction-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.attraction-card:hover {
  transform: translateY(-5px);
}

.image-container {
  height: 200px;
  overflow: hidden;
}

.el-image {
  width: 100%;
  height: 100%;
}

.image-error {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.card-content {
  padding: 15px;
}

.attraction-name {
  margin: 0;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.attraction-tags {
  margin-bottom: 10px;
}

.attraction-tags .el-tag {
  margin-right: 5px;
}

.attraction-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.is-favorite {
  color: #f56c6c;
}

.detail-image {
  width: 100%;
  height: 300px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.detail-description {
  line-height: 1.6;
  color: #333;
  margin-bottom: 20px;
}

.detail-info {
  margin-top: 20px;
}

:deep(.el-dialog__body) {
  padding: 20px;
}
</style>
