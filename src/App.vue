<script setup>
import { ref } from 'vue';
import GameBoard from './components/GameBoard.vue';
import GameInstructionsModal from './utils/GameInstructionsModal.vue';

// 调试模式状态
const isDebugMode = ref(false);

// 切换调试模式
const toggleDebugMode = () => {
    isDebugMode.value = !isDebugMode.value;
};

// 调整道具牌顺序相关状态
const showToolCardOrderModal = ref(false);

// 打开调整道具牌顺序模态窗口
const openToolCardOrderModal = () => {
    showToolCardOrderModal.value = true;
};

// 关闭调整道具牌顺序模态窗口
const closeToolCardOrderModal = () => {
    showToolCardOrderModal.value = false;
};

// 游戏说明模态窗口状态
const showGameInstructionsModal = ref(false);

// 打开游戏说明模态窗口
const openGameInstructionsModal = () => {
    showGameInstructionsModal.value = true;
};

// 关闭游戏说明模态窗口
const closeGameInstructionsModal = () => {
    showGameInstructionsModal.value = false;
};
</script>

<template>
    <div class="game-container">
        <div class="game-header">
            <h3 class="game-title">女巫的毒药</h3>
            <div class="header-controls">
                <!-- 调整道具按钮，位于调试模式按钮左边 -->
                <button v-if="isDebugMode" @click="openToolCardOrderModal" class="debug-btn debug">
                    调整道具
                </button>
                <button
                    @click="toggleDebugMode"
                    :class="['debug-btn', isDebugMode ? 'debug' : 'normal']"
                >
                    {{ isDebugMode ? '调试模式' : '正常模式' }}
                </button>
                <button @click="openGameInstructionsModal" class="debug-btn normal">游戏说明</button>
            </div>
        </div>
        <GameBoard
            :is-debug-mode="isDebugMode"
            :show-tool-card-order-modal="showToolCardOrderModal"
            @toggle-debug="toggleDebugMode"
            @open-tool-card-order-modal="openToolCardOrderModal"
            @close-tool-card-order-modal="closeToolCardOrderModal"
            @update:toolCards="
                (newToolCards) => {
                    /* 更新逻辑在GameBoard中已经处理 */
                }
            "
        />

        <!-- 游戏说明模态窗口 -->
        <GameInstructionsModal 
            :visible="showGameInstructionsModal"
            @close="closeGameInstructionsModal"
        />
    </div>
</template>

<style scoped>
.game-container {
    width: 100vw;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f0e6d2;
    font-family: 'Arial', sans-serif;
    overflow: auto;
    /* 隐藏滚动条但保持可滚动 */
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.game-container::-webkit-scrollbar {
    display: none;
}

.game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: rgba(139, 0, 0, 0.1);
    border-bottom: 2px solid #8b0000;
}

.game-title {
    color: #8b0000;
    font-size: 1.8em;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.header-controls {
    display: flex;
    gap: 10px;
    margin-right: 20px;
}

.debug-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
}

.debug-btn.normal {
    background-color: #4caf50;
    color: white;
}

.debug-btn.debug {
    background-color: #f44336;
    color: white;
}

.debug-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}


</style>
