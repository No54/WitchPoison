<script setup>
import { ref, nextTick, watch } from 'vue';

// 定义props
const props = defineProps({
  logs: {
    type: Array,
    default: () => []
  }
});

// 滚动到底部的功能
const logContainer = ref(null);

watch(() => props.logs.length, () => {
  nextTick(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight;
    }
  });
});


</script>
<template>
  <div class="game-log">
    <h3 class="log-title">游戏日志</h3>
    <div class="log-container" ref="logContainer">
      <div v-if="logs.length === 0" class="empty-log">
        暂无游戏记录
      </div>
      <div v-else class="log-list">
        <div v-for="(log, index) in logs" :key="index" class="log-item"
          :class="{ 'player-log': log.type === 'player', 'system-log': log.type === 'system' }">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-content">{{ log.content }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.game-log {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.log-title {
  margin: 0 0 12px 0;
  font-size: 18px;
  color: #333;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
}

.log-container {
  flex: 1;
  overflow-y: auto;
  background-color: white;
  border-radius: 4px;
  padding: 8px;
  max-height: 300px;
}

.empty-log {
  text-align: center;
  color: #999;
  padding: 20px;
  font-style: italic;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.log-item {
  display: flex;
  flex-direction: column;
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.4;
}

.player-log {
  background-color: #e8f4f8;
  border-left: 3px solid #3498db;
}

.system-log {
  background-color: #f8f9fa;
  border-left: 3px solid #6c757d;
}

.log-time {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.log-content {
  color: #333;
}

/* 滚动条样式 */
.log-container::-webkit-scrollbar {
  width: 6px;
}

.log-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.log-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.log-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>