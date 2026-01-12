<script setup>
// 接收props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  options: {
    type: Array,
    default: () => []
  }
})

// 定义emit
const emit = defineEmits(['selectOption'])

// 选择道具选项
const selectOption = (index) => {
  emit('selectOption', index)
}
</script>

<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <h2>选择道具</h2>
      <p>请从以下两张道具牌中选择一张保留：</p>
      <div class="tool-options">
        <div v-for="(option, index) in options" :key="index" class="tool-option" 
          @click="selectOption(index)">
          <div class="tool-name">{{ option.name }}</div>
          <div class="tool-description">{{ option.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 模态框样式 */
.modal-overlay {
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

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 600px;
  width: 90%;
}

.modal-content h2 {
  color: #8b0000;
  margin-bottom: 20px;
  font-size: 1.8em;
}

.modal-content p {
  font-size: 1.2em;
  margin-bottom: 30px;
  color: #333;
}

/* 道具选项样式 */
.tool-options {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.tool-option {
  background-color: #f0e6d2;
  padding: 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  width: 200px;
  border: 2px solid transparent;
}

.tool-option:hover {
  background-color: #d4a76a;
  color: white;
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.tool-name {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 10px;
  color: #8b0000;
}

.tool-description {
  font-size: 0.9em;
  line-height: 1.4;
  color: #666;
}

.tool-option:hover .tool-name,
.tool-option:hover .tool-description {
  color: white;
}
</style>