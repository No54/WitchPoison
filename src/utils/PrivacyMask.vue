<script setup>
// 接收props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '隐私操作'
  },
  message: {
    type: String,
    default: '其他玩家请闭眼'
  },
  confirmText: {
    type: String,
    default: '确认'
  }
})

// 定义emit
const emit = defineEmits(['close'])

// 处理确认按钮点击
const handleConfirm = () => {
  emit('close')
}
</script>

<template>
  <div v-if="show" class="mask-overlay">
    <div class="mask-content">
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <button class="confirm-btn" @click="handleConfirm">{{ confirmText }}</button>
    </div>
  </div>
</template>

<style scoped>
/* 蒙版遮罩层 */
.mask-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 蒙版内容 */
.mask-content {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 500px;
  width: 90%;
}

.mask-content h2 {
  color: #8b0000;
  margin-bottom: 20px;
  font-size: 1.8em;
}

.mask-content p {
  font-size: 1.2em;
  margin-bottom: 30px;
  color: #333;
}

.confirm-btn {
  padding: 10px 30px;
  font-size: 1.2em;
  background-color: #8b0000;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: bold;
}

.confirm-btn:hover {
  background-color: #a52a2a;
}
</style>