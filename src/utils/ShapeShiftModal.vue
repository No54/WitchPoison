<script setup>
import { ref, watch } from 'vue';
import FoodCard from '../components/Food/FoodCard.vue';

// 接收props
const { show, title, message, foodCards, isDebugMode } = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: '移形换影效果',
    },
    message: {
        type: String,
        default: '请选择两张要交换位置的食物牌',
    },
    foodCards: {
        type: Array,
        default: () => [],
    },
    isDebugMode: {
        type: Boolean,
        default: false,
    },
});

// 定义emit
const emit = defineEmits(['close', 'swap-cards']);

// 已选择的卡片索引
const selectedCardIndices = ref(new Set());

// 定义复制的食物牌数组
const copiedFoodCards = ref([]);

// 复制食物牌数组的函数
const copyFoodCards = () => {
    // 深度复制食物牌数组，确保与原始数组完全一致，包括顺序
    copiedFoodCards.value = JSON.parse(JSON.stringify(foodCards)).map((card) => ({
        ...card,
        // 保持原始的isRevealed状态
        originalIsRevealed: card.isRevealed,
    }));
};

// 初始复制食物牌数组
copyFoodCards();

// 监听foodCards的变化，当食物牌状态变化时重新复制
watch(
    () => foodCards,
    (newFoodCards) => {
        copyFoodCards();
    },
    { deep: true }
);

// 监听show属性的变化，当模态窗口打开时，重置已选择的牌数
watch(
    () => show,
    (newShow) => {
        if (newShow) {
            // 重置已选择的牌数
            selectedCardIndices.value = new Set();
            // 重新复制食物牌数组，确保状态一致
            copyFoodCards();
        }
    }
);

// 处理关闭按钮点击
const handleClose = () => {
    emit('close');
};

// 处理卡片点击
const handleSelectCard = (card) => {
    // 找到卡片索引
    const index = copiedFoodCards.value.findIndex((c) => c.id === card.id);
    if (index !== -1) {
        // 如果卡片已经被选择，取消选择
        if (selectedCardIndices.value.has(index)) {
            selectedCardIndices.value.delete(index);
        } else {
            // 如果还没有选择两张卡片，选择当前卡片
            if (selectedCardIndices.value.size < 2) {
                selectedCardIndices.value.add(index);
            }
        }

        // 如果已经选择了两张卡片，执行交换操作
        if (selectedCardIndices.value.size === 2) {
            // 将Set转换为数组，获取选中的卡片索引
            const indices = Array.from(selectedCardIndices.value);
            // 发送交换卡片事件，传递选中的两个索引
            emit('swap-cards', indices);
        }
    }
};

// 检查卡片是否可以选择
const canSelectCard = (card) => {
    // 找到卡片索引
    const index = copiedFoodCards.value.findIndex((c) => c.id === card.id);
    if (index === -1) return false;

    // 可以选择已翻开或未翻开的卡片
    return true;
};

// 检查卡片是否已被选择
const isCardSelected = (card) => {
    // 找到卡片索引
    const index = copiedFoodCards.value.findIndex((c) => c.id === card.id);
    if (index === -1) return false;

    return selectedCardIndices.value.has(index);
};
</script>

<template>
    <div v-if="show" class="modal-overlay">
        <div class="modal-content">
            <!-- 将标题、消息和选择信息合并到一行显示 -->
            <div class="modal-header-row">
                <span class="modal-title">{{ title }}</span>
                <span class="modal-message">{{ message }}</span>
                <span class="select-info">
                    已选择: {{ selectedCardIndices ? selectedCardIndices.size : 0 }}/2
                </span>
            </div>

            <!-- 复制游戏窗口中的5x5食物牌布局 -->
            <div class="food-cards-grid">
                <FoodCard
                    v-for="card in copiedFoodCards"
                    :key="card.id"
                    :card="card"
                    :current-phase="'行动一'"
                    :is-debug-mode="isDebugMode"
                    :is-shuffling="false"
                    :is-modal-context="true"
                    @reveal="handleSelectCard"
                    :class="{
                        'can-select': canSelectCard(card),
                        selected: isCardSelected(card),
                    }"
                />
            </div>

            <div class="modal-footer">
                <button class="close-btn" @click="handleClose">关闭</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 模态框遮罩层 */
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

/* 模态框内容 */
.modal-content {
    background-color: white;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    width: 540px;
    max-width: 540px;
    max-height: 700px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

/* 模态窗口标题行 - 将标题、消息和选择信息合并到一行 */
.modal-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    gap: 10px;
    flex-wrap: nowrap;
    overflow: hidden;
}

/* 标题样式 */
.modal-title {
    font-size: 1.1em;
    font-weight: bold;
    color: #8b0000;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
}

/* 消息样式 */
.modal-message {
    font-size: 0.9em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 2;
    text-align: center;
    color: #333333;
}

/* 选择信息 */
.select-info {
    font-size: 0.9em;
    font-weight: bold;
    color: #8b0000;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    text-align: right;
}

/* 5x5食物牌桌面 - 与游戏窗口完全一致 */
.food-cards-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 7px;
    width: 81vmin;
    height: 81vmin;
    max-width: 540px;
    max-height: 540px;
    margin: 0 auto;
}

/* 可选择的卡片样式 */
:deep(.food-card.can-select) {
    cursor: pointer;
    border-color: #228b22;
    box-shadow: 0 0 10px rgba(46, 204, 113, 0.5);
}

/* 已选择的卡片样式 */
:deep(.food-card.selected) {
    border-color: #4a6fa5;
    box-shadow: 0 0 15px rgba(74, 111, 165, 0.8);
    transform: scale(1.05);
}

/* 模态框底部 */
.modal-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

/* 关闭按钮 */
.close-btn {
    padding: 10px 20px;
    background-color: #8b0000;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s;
}

.close-btn:hover {
    background-color: #a52a2a;
}
</style>
