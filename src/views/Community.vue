<template>
  <div class="community">
    <div class="page-header">
      <h1>社区讨论</h1>
      <p>与其他旅行爱好者分享和交流经验</p>
    </div>

    <el-card class="new-post-card">
      <div class="new-post-form">
        <el-form :model="newPost" label-width="80px">
          <!-- 帖子标题 -->
          <el-form-item label="标题">
            <el-input v-model="newPost.title" placeholder="输入您的帖子标题" />
          </el-form-item>

          <!-- 帖子内容 -->
          <el-form-item label="内容">
            <el-input
                v-model="newPost.content"
                type="textarea"
                placeholder="写下您的经验或问题"
                :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </el-form-item>

          <!-- 投稿按钮 -->
          <el-form-item>
            <el-button type="primary" @click="submitPost">发布帖子</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <div class="post-list">
      <h2>帖子列表</h2>
      <el-card
          v-for="post in posts"
          :key="post.id"
          class="post-card"
          :body-style="{ padding: '20px' }"
      >
        <h3>{{ post.title }}</h3>
        <p>{{ post.content }}</p>
        <div class="post-footer">
          <span>发表时间: {{ formatTimestamp(post.timestamp) }}</span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommunityView',
  data() {
    return {
      newPost: {
        title: '',
        content: ''
      },
      posts: [
        {
          id: 1,
          title: '关于巴黎之旅的建议',
          content: '上个月刚去巴黎，推荐去奥赛博物馆，非常值得一看！',
          timestamp: 1678765000
        },
        // 更多帖子...
      ]
    }
  },
  methods: {
    submitPost() {
      if (this.newPost.title.trim() && this.newPost.content.trim()) {
        const newPost = {
          id: this.posts.length + 1,
          title: this.newPost.title.trim(),
          content: this.newPost.content.trim(),
          timestamp: Math.floor(Date.now() / 1000)
        }
        this.posts.unshift(newPost)
        this.newPost.title = ''
        this.newPost.content = ''
        alert('您的帖子已发布！')
      } else {
        alert('标题和内容不能为空，请填写完整。')
      }
    },
    formatTimestamp(timestamp) {
      const date = new Date(timestamp * 1000)
      return date.toLocaleString()
    }
  }
}
</script>

<style scoped>
.community {
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.page-header p {
  color: #666;
  font-size: 1.2em;
}

.new-post-card {
  margin-bottom: 50px;
}

.post-list {
  max-width: 800px;
  margin: 0 auto;
}

.post-list h2 {
  font-size: 2em;
  text-align: center;
  margin-bottom: 20px;
}

.post-card {
  margin-bottom: 20px;
}

.post-card h3 {
  margin: 0 0 10px;
  color: #333;
}

.post-footer {
  margin-top: 10px;
  font-size: 0.9em;
  color: #999;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2em;
  }

  .page-header p {
    font-size: 1em;
  }

  .post-list {
    padding: 0 10px;
  }
}
</style>
