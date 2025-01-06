<template>
  <div class="chat-app">
    <!-- 聊天室标题栏 -->
    <div class="chat-header">
      <h2>实时聊天室</h2>
      <div class="user-info">
        <span class="avatar">{{ userInitial }}</span>
        <span class="username">{{ user }}</span>
      </div>
    </div>

    <!-- 主聊天区域 -->
    <div class="chat-container">
      <!-- 在线用户列表 -->
      <div class="online-users">
        <h3>在线用户</h3>
        <div class="user-list">
          <div v-for="(user, index) in onlineUsers"
               :key="index"
               class="user-item">
            <span class="user-avatar">{{ user.charAt(0) }}</span>
            <span class="user-name">{{ user }}</span>
            <span class="online-indicator"></span>
          </div>
        </div>
      </div>

      <!-- 消息显示区域 -->
      <div class="chat-main">
        <div class="chat-messages" ref="messageContainer">
          <div v-for="(msg, index) in messages"
               :key="index"
               :class="['message-wrapper', msg.user === user ? 'message-self' : 'message-other']">
            <div class="message-content">
              <div class="message-header">
                <span class="message-user">{{ msg.user }}&nbsp;</span>
                <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
              </div>
              <div class="message-text">{{ msg.text }}</div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="chat-input-container">
          <div class="input-wrapper">
            <input
                v-model="message"
                @keyup.enter="sendUserMessage"
                placeholder="输入消息..."
                class="message-input"
            />
            <div class="input-actions">
              <!-- 按钮触发表情选择器 -->
              <button class="emoji-btn" @click="toggleEmojiPicker">😊</button>

              <!-- 表情选择器 -->
              <div v-if="isEmojiPickerVisible" class="emoji-picker">
                <span @click="selectEmoji('😀')">😀</span>
                <span @click="selectEmoji('😂')">😂</span>
                <span @click="selectEmoji('😍')">😍</span>
                <span @click="selectEmoji('👍')">👍</span>
              </div>

              <button
                  class="send-btn"
                  @click="sendUserMessage"
                  :disabled="!message.trim()">
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { connectWebSocket, sendMessage, onMessage } from "@/utils/websocket";

export default {
  name: 'ChatRoom',

  setup() {
    const messages = ref([]);
    const message = ref('');
    const messageContainer = ref(null);
    const user = `用户${Math.floor(Math.random() * 1000)}`;
    const onlineUsers = ref([user, '用户234', '用户567', '用户890']);
    const scrollTimeout = ref(null);

    const userInitial = computed(() => user.charAt(0));

    const isEmojiPickerVisible = ref(false);  // 控制表情选择器的显示状态

    const toggleEmojiPicker = () => {  // // 切换表情选择器的显示状态
      isEmojiPickerVisible.value = !isEmojiPickerVisible.value;
    };

    const selectEmoji = (emoji) => {  // // 选择表情后的操作
      console.log("选择的表情是:", emoji);
      message.value += emoji; // 将表情追加到聊天框内容中
      isEmojiPickerVisible.value = false; // 选择后关闭表情选择器
    };

    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    };

    const scrollToBottom = () => {
      if (scrollTimeout.value) {
        clearTimeout(scrollTimeout.value);
      }
      scrollTimeout.value = setTimeout(() => {
        if (messageContainer.value) {
          messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
        }
      }, 100);
    };

    const sendUserMessage = () => {
      if (message.value.trim()) {
        const messageData = { user, text: message.value, timestamp: new Date().getTime() };
        sendMessage(messageData); // 调用 WebSocket 的 sendMessage
        message.value = '';
        messages.value.push(messageData); // 本地显示消息
        scrollToBottom();
      }
    };

    onMounted(() => {
      connectWebSocket("ws://localhost:8080/chat");

      onMessage((msg) => {
        if (msg.user !== user) {
          messages.value.push(msg);
          scrollToBottom();
        }
      });
    });

    onBeforeUnmount(() => {
      if (scrollTimeout.value) {
        clearTimeout(scrollTimeout.value);
      }
    });

    return {
      messages,
      message,
      user,
      userInitial,
      onlineUsers,
      sendUserMessage,
      formatTime,
      scrollToBottom,
      messageContainer,
      isEmojiPickerVisible,
      toggleEmojiPicker,
      selectEmoji
    };
  }
};
</script>

<style scoped>
.chat-app {
  height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: #f5f7fb;
}

.chat-header {
  background: #ffffff;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e6e9f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
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

.chat-container {
  flex: 1;
  display: flex;
  gap: 1rem;
  padding: 1rem;
  height: calc(100vh - 80px);
}

.online-users {
  width: 250px;
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-list {
  margin-top: 1rem;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: #e9ecef;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
}

.online-indicator {
  width: 8px;
  height: 8px;
  background: #28a745;
  border-radius: 50%;
  margin-left: auto;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.chat-messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.message-wrapper {
  margin-bottom: 1rem;
  display: flex;
}

.message-self {
  justify-content: flex-end;
}

.message-content {
  max-width: 70%;
  padding: 0.75rem;
  border-radius: 12px;
  background: #f8f9fa;
}

.message-self .message-content {
  background: #007bff;
  color: white;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.message-time {
  color: #6c757d;
}

.message-self .message-time {
  color: rgba(255,255,255,0.8);
}

.chat-input-container {
  padding: 1rem;
  border-top: 1px solid #e6e9f0;
}

.input-wrapper {
  display: flex;
  gap: 0.5rem;
}

.message-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e6e9f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.message-input:focus {
  outline: none;
  border-color: #007bff;
}

.input-actions {
  display: flex;
  gap: 0.5rem;
}

.send-btn, .emoji-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.emoji-picker {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f9f9f9;
  display: flex;
  gap: 10px; /* 表情之间的间距 */
}

.emoji-picker span {
  font-size: 12px; /* 表情大小 */
  cursor: pointer; /* 鼠标悬停时显示手型指针 */
  transition: transform 0.2s ease, background-color 0.2s ease; /* 添加平滑的动画效果 */
}

.emoji-picker span:hover {
  transform: scale(1.2); /* 悬停时放大表情 */
  background-color: #f0f0f0; /* 悬停时改变背景颜色 */
  border-radius: 4px; /* 添加圆角效果 */
}

.send-btn {
  background: #007bff;
  color: white;
}

.send-btn:hover {
  background: #0056b3;
}

.send-btn:disabled {
  background: #e9ecef;
  cursor: not-allowed;
}

.emoji-btn {
  background: #f8f9fa;
}

.emoji-btn:hover {
  background: #e9ecef;
}

.typing-indicator {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6c757d;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
