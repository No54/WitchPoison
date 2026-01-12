<script setup>
import { ref, watch } from 'vue';

// 接收props
const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    toolCards: {
        type: Array,
        default: () => [],
    },
});

// 定义emit
const emit = defineEmits(['close', 'update:toolCards']);

// 本地道具牌列表，用于调整顺序
const localToolCards = ref([]);

// 监听props.toolCards变化，同步到本地
watch(
    () => props.toolCards,
    (newVal) => {
        localToolCards.value = [...newVal];
    },
    { deep: true, immediate: true }
);

// 关闭模态窗口
const closeModal = () => {
    emit('close');
};

// 保存调整后的顺序
const saveOrder = () => {
    emit('update:toolCards', [...localToolCards.value]);
    emit('close');
};

// 交换位置
const moveUp = (index) => {
    if (index > 0) {
        [localToolCards.value[index - 1], localToolCards.value[index]] = [
            localToolCards.value[index],
            localToolCards.value[index - 1],
        ];
    }
};

const moveDown = (index) => {
    if (index < localToolCards.value.length - 1) {
        [localToolCards.value[index + 1], localToolCards.value[index]] = [
            localToolCards.value[index],
            localToolCards.value[index + 1],
        ];
    }
};

// 移动到顶部
const moveToTop = (index) => {
    if (index > 0) {
        const card = localToolCards.value.splice(index, 1)[0];
        localToolCards.value.unshift(card);
    }
};

// 移动到底部
const moveToBottom = (index) => {
    if (index < localToolCards.value.length - 1) {
        const card = localToolCards.value.splice(index, 1)[0];
        localToolCards.value.push(card);
    }
};
</script>

<template>
    <div class="modal-overlay" v-if="show" @click="closeModal">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h2>调整道具牌顺序</h2>
                <div class="deck-info" style="color: #333 !important">
                    当前牌堆数量：{{ localToolCards.length }} 张
                </div>
                <button class="close-btn" @click="closeModal">×</button>
            </div>
            <div class="modal-body">
                <div class="tool-cards-list">
                    <div
                        v-for="(card, index) in localToolCards"
                        :key="index"
                        class="tool-card-item"
                    >
                        <div class="card-info">
                            <div class="card-name">{{ card.name }}</div>
                            <div class="card-description">{{ card.description }}</div>
                        </div>
                        <div class="card-actions">
                            <button
                                class="move-btn top-btn"
                                @click="moveToTop(index)"
                                :disabled="index === 0"
                            >
                                ⇧
                            </button>
                            <button class="move-btn" @click="moveUp(index)" :disabled="index === 0">
                                ↑
                            </button>
                            <button
                                class="move-btn"
                                @click="moveDown(index)"
                                :disabled="index === localToolCards.length - 1"
                            >
                                ↓
                            </button>
                            <button
                                class="move-btn bottom-btn"
                                @click="moveToBottom(index)"
                                :disabled="index === localToolCards.length - 1"
                            >
                                ⇩
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="cancel-btn" @click="closeModal">取消</button>
                <button class="save-btn" @click="saveOrder">保存</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    border-radius: 8px;
    width: 80%;
    max-width: 600px;
    max-height: 80vh;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #eee;
    background-color: #f5f5f5;
    border-radius: 8px 8px 0 0;
    color: #333;
}

.modal-header h2 {
    margin: 0;
    font-size: 1.2em;
    color: #333;
}

.deck-info {
    font-weight: bold;
    color: #333;
    margin-right: 20px;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5em;
    cursor: pointer;
    color: #666;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    transition: background-color 0.3s;
}

.close-btn:hover {
    background-color: #eee;
}

.modal-body {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.tool-cards-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
    flex: 1;
    padding-right: 10px;
    max-height: 50vh;
}

.tool-cards-list::-webkit-scrollbar {
    width: 8px;
}

.tool-cards-list::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

.tool-cards-list::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

.tool-cards-list::-webkit-scrollbar-thumb:hover {
    background: #555;
}

.tool-card-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 6px;
    transition: all 0.3s;
}

.tool-card-item:hover {
    background-color: #f0f0f0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-info {
    flex: 1;
}

.card-name {
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
}

.card-description {
    font-size: 0.9em;
    color: #666;
}

.card-actions {
    display: flex;
    gap: 8px;
}

.move-btn {
    width: 32px;
    height: 32px;
    border: 1px solid #ddd;
    background-color: #f0f0f0;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1em;
    transition: all 0.3s;
    color: #333;
}

.move-btn:hover:not(:disabled) {
    background-color: #4a6fa5;
    color: white;
    border-color: #4a6fa5;
}

.move-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    color: #999;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 16px 20px;
    border-top: 1px solid #eee;
    background-color: #f5f5f5;
    border-radius: 0 0 8px 8px;
}

.cancel-btn {
    padding: 8px 16px;
    border: 1px solid #ddd;
    background-color: #f0f0f0;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
    color: #333;
}

.cancel-btn:hover {
    background-color: #e0e0e0;
}

.save-btn {
    padding: 8px 16px;
    border: 1px solid #4a6fa5;
    background-color: #4a6fa5;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
}
</style>
