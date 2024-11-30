<template>
  <div class="community">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1>社区讨论</h1>
      <p>与其他旅行爱好者分享和交流经验</p>
    </div>

    <!-- 发布新帖子 -->
    <el-card class="new-post-card">
      <div class="new-post-form">
        <el-form :model="newPost" label-width="80px">
          <!-- 帖子标题 -->
          <el-form-item label="标题">
            <el-input
                v-model="newPost.title"
                placeholder="输入您的帖子标题"
                clearable
            />
          </el-form-item>

          <!-- 帖子内容 -->
          <el-form-item label="内容">
            <el-input
                v-model="newPost.content"
                type="textarea"
                placeholder="写下您的经验或问题"
                :autosize="{ minRows: 3, maxRows: 5 }"
                clearable
            />
          </el-form-item>

          <!-- 发布按钮 -->
          <el-form-item>
            <el-button
                type="primary"
                class="submit-btn"
                @click="submitPost"
            >
              {{ isEditing ? "保存修改" : "发布帖子" }}
            </el-button>
            <el-button
                v-if="isEditing"
                type="default"
                @click="cancelEdit"
            >
              取消编辑
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 帖子列表 -->
    <div class="post-list">
      <h2>帖子列表</h2>
      <el-card
          v-for="post in posts"
          :key="post.id"
          class="post-card"
          :body-style="{ padding: '20px' }"
      >
        <!-- 帖子标题 -->
        <div class="post-header">
          <h3>{{ post.title }}</h3>
          <el-tag v-if="post.isFavorite" type="warning" size="small">已收藏</el-tag>
        </div>

        <!-- 帖子内容 -->
        <p class="post-content">{{ post.content }}</p>

        <!-- 帖子操作 -->
        <div class="post-footer">
          <span>发表时间: {{ formatTimestamp(post.timestamp) }}</span>
          <div class="post-actions">
            <el-button
                type="text"
                @click="toggleLike(post)"
                :icon="post.isLiked ? 'el-icon-like' : 'el-icon-like-outline'"
                class="like-btn"
                :class="{ liked: post.isLiked }"
            >
              {{ post.likes }}
            </el-button>
            <el-button
                type="text"
                @click="toggleFavorite(post)"
                :icon="post.isFavorite ? 'el-icon-star-on' : 'el-icon-star-off'"
                class="favorite-btn"
                :class="{ favorited: post.isFavorite }"
            >
              收藏
            </el-button>
            <el-button
                type="text"
                icon="el-icon-edit"
                @click="editPost(post)"
            >
              编辑
            </el-button>
            <el-button
                type="text"
                icon="el-icon-delete"
                @click="deletePost(post.id)"
            >
              删除
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommunityView",
  data() {
    return {
      newPost: {
        title: "",
        content: ""
      },
      isEditing: false, // 是否处于编辑状态
      editingPostId: null, // 当前正在编辑的帖子ID
      posts: [
        {
          id: 1,
          title: "洛杉矶必去景点推荐",
          content:
              "洛杉矶的格里菲斯天文台是俯瞰城市的绝佳地点，特别是日落时分。好莱坞星光大道虽然有些拥挤，但仍是打卡的好地方。",
          timestamp: Math.floor(Date.now() / 1000) - 3600, // 1小时前
          likes: 12,
          isLiked: false,
          isFavorite: false
        },
        {
          id: 2,
          title: "洛杉矶美食攻略",
          content:
              "在洛杉矶，In-N-Out汉堡是必试的经典美食。圣塔莫尼卡的海鲜餐厅也很棒，推荐尝试当地的新鲜鱼类。",
          timestamp: Math.floor(Date.now() / 1000) - 86400, // 1天前
          likes: 8,
          isLiked: false,
          isFavorite: false
        },
        {
          id: 3,
          title: "洛杉矶交通小贴士",
          content:
              "洛杉矶的地铁线路不多，建议租车出行。市区停车费用较高，可以选择公共停车场或使用Uber等打车服务。",
          timestamp: Math.floor(Date.now() / 1000) - 172800, // 2天前
          likes: 5,
          isLiked: false,
          isFavorite: false
        }
      ]
    };
  },
  methods: {
    // 发布或保存帖子
    submitPost() {
      if (this.newPost.title.trim() && this.newPost.content.trim()) {
        if (this.isEditing) {
          // 编辑模式：保存修改
          const post = this.posts.find(p => p.id === this.editingPostId);
          if (post) {
            post.title = this.newPost.title.trim();
            post.content = this.newPost.content.trim();
            this.$message.success("帖子修改成功！");
          }
          this.cancelEdit();
        } else {
          // 发布新帖子
          const newPost = {
            id: this.posts.length + 1,
            title: this.newPost.title.trim(),
            content: this.newPost.content.trim(),
            timestamp: Math.floor(Date.now() / 1000), // 当前时间戳
            likes: 0,
            isLiked: false,
            isFavorite: false
          };
          this.posts.unshift(newPost);
          this.$message.success("您的帖子已发布！");
        }
        this.newPost.title = "";
        this.newPost.content = "";
      } else {
        this.$message.warning("标题和内容不能为空，请填写完整！");
      }
    },

    // 编辑帖子
    editPost(post) {
      this.isEditing = true;
      this.editingPostId = post.id;
      this.newPost.title = post.title;
      this.newPost.content = post.content;
    },

    // 取消编辑
    cancelEdit() {
      this.isEditing = false;
      this.editingPostId = null;
      this.newPost.title = "";
      this.newPost.content = "";
    },

    // 删除帖子
    deletePost(postId) {
      this.posts = this.posts.filter(post => post.id !== postId);
      this.$message.success("帖子已删除！");
    },

    // 格式化时间戳
    formatTimestamp(timestamp) {
      const date = new Date(timestamp * 1000);
      const now = new Date();
      const diff = now - date;

      if (diff < 60000) return "刚刚"; // 小于1分钟
      if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`; // 小于1小时
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`; // 小于1天
      if (diff < 2592000000) return `${Math.floor(diff / 86400000)}天前`; // 小于30天
      return date.toLocaleDateString();
    },

    // 点赞功能
    toggleLike(post) {
      if (post.isLiked) {
        post.likes -= 1;
      } else {
        post.likes += 1;
      }
      post.isLiked = !post.isLiked;
    },

    // 收藏功能
    toggleFavorite(post) {
      post.isFavorite = !post.isFavorite;
      const message = post.isFavorite ? "已收藏该帖子" : "已取消收藏";
      this.$message.info(message);
    }
  }
};
</script>

<style scoped>
.community {
  background-color: #f9f9f9;
  padding: 20px;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
  color: #333;
}

.page-header p {
  color: #666;
  font-size: 1.2em;
}

.new-post-card {
  margin-bottom: 50px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.submit-btn {
  background: linear-gradient(90deg, #409eff, #66b1ff);
  color: white;
  border: none;
}

.submit-btn:hover {
  background: linear-gradient(90deg, #66b1ff, #409eff);
}

.post-list {
  max-width: 800px;
  margin: 0 auto;
}

.post-list h2 {
  font-size: 2em;
  text-align: center;
  margin-bottom: 20px;
  color: #444;
}

.post-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.post-header h3 {
  margin: 0 0 10px;
  color: #333;
}

.post-footer {
  margin-top: 10px;
  font-size: 0.9em;
  color: #999;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-actions {
  display: flex;
  gap: 10px;
}

.post-actions .el-button {
  font-size: 0.9em;
  color: #666;
  transition: color 0.3s ease;
}

.post-actions .el-button:hover {
  color: #409eff;
}

.liked {
  color: #f56c6c !important;
}

.favorited {
  color: #e6a23c !important;
}
</style>
