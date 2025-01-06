<template>
  <div class="chat-container">
    <div class="chat-messages">
      <div v-for="(msg, index) in messages" :key="index" class="message">
        <strong>{{ msg.user }}:</strong> {{ msg.text }}
      </div>
    </div>
    <div class="chat-input">
      <input
          v-model="message"
          @keyup.enter="sendMessage"
          placeholder="输入消息..."
      />
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script>
import { connectWebSocket, sendMessage, onMessage } from "@/utils/websocket";

export default {
  data() {
    return {
      messages: [],
      message: "",
      user: "用户" + Math.floor(Math.random() * 1000), // 随机生成用户名
    };
  },
  mounted() {
    // 连接 WebSocket
    connectWebSocket("ws://localhost:8080/chat");

    // 接收消息
    onMessage((msg) => {
      this.messages.push(msg);
    });
  },
  methods: {
    sendMessage() {
      if (this.message.trim() !== "") {
        sendMessage({ user: this.user, text: this.message });
        this.message = "";
      }
    },
  },
};
</script>

<style>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background: #f9f9f9;
}

.message {
  margin-bottom: 10px;
}

.chat-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
  background: #fff;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.chat-input button {
  margin-left: 10px;
  padding: 10px 20px;
  border: none;
  background: #007bff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.chat-input button:hover {
  background: #0056b3;
}
</style>
