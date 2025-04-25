<template>
  <div class="chat-container">
    <div class="messages-container">
      <div v-for="(msg, index) in messages" :key="index"
           :class="['message', msg.type === 'user' ? 'user-message' : 'ai-message']">
        <div class="message-content">
          <strong>{{ msg.type === 'user' ? '用户: ' : 'AI: ' }}</strong>
          <p>{{ msg.content }}</p>
        </div>
      </div>
    </div>

    <div class="input-container">
      <input
          v-model="userInput"
          @keyup.enter="sendMessage"
          placeholder="输入您的问题..."
          :disabled="loading"
      />
      <button @click="sendMessage" :disabled="loading || !userInput.trim()">
        {{ loading ? '请求中...' : '发送' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const userInput = ref('');
const messages = ref([]);
const loading = ref(false);

async function sendMessage() {
  if (!userInput.value.trim() || loading.value) return;

  // 添加用户消息
  messages.value.push({
    type: 'user',
    content: userInput.value
  });

  const userMessage = userInput.value;
  userInput.value = '';
  loading.value = true;

  try {
    // HTTP 请求直接用相对路径 /api/ai/chat，axios 会自动加上当前域名
    // const response = await axios.post('http://localhost:8081/api/ai/chat', {
    const response = await axios.post('/api/ai/chat', {
      message: userMessage
    });

    // 添加AI回复
    messages.value.push({
      type: 'ai',
      content: response.data.response
    });
  } catch (error) {
    console.error('Error calling AI API:', error);
    messages.value.push({
      type: 'ai',
      content: '抱歉，服务出现了问题。请稍后再试。'
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.messages-container {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.message {
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
}

.user-message {
  background-color: #e3f2fd;
  margin-left: 20%;
}

.ai-message {
  background-color: #f1f8e9;
  margin-right: 20%;
}

.message-content p {
  margin: 5px 0 0;
  white-space: pre-wrap;
}

.input-container {
  display: flex;
  gap: 10px;
}

input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
