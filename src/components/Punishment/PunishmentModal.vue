<script setup>
// 接收props
const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    punishment: {
        type: Object,
        default: null,
    },
    playerName: {
        type: String,
        default: '',
    },
});

// 定义emit
const emit = defineEmits(['close']);

// 关闭模态框
const closeModal = () => {
    emit('close');
};
</script>

<template>
    <div class="punishment-modal" v-if="show">
        <div class="modal-content">
            <h2>惩罚牌</h2>
            <div class="punishment-player">{{ playerName }} 抽到了惩罚！</div>
            <div class="punishment-content">
                {{ punishment?.content }}
            </div>
            <button class="close-btn" @click="closeModal">确定</button>
        </div>
    </div>
</template>

<style scoped>
/* 惩罚牌模态框样式 */
.punishment-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.punishment-modal .modal-content {
    background: linear-gradient(135deg, #8b0000, #a52a2a);
    color: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    text-align: center;
    max-width: 500px;
    width: 90%;
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        transform: translateY(-50px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.punishment-modal h2 {
    font-size: 2em;
    margin-bottom: 20px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.punishment-modal .punishment-player {
    font-size: 1.5em;
    margin-bottom: 25px;
    font-weight: bold;
}

.punishment-modal .punishment-content {
    background-color: rgba(255, 255, 255, 0.9);
    color: #8b0000;
    padding: 25px;
    border-radius: 8px;
    font-size: 1.2em;
    margin-bottom: 30px;
    min-height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.2);
}

.punishment-modal .close-btn {
    background-color: white;
    color: #8b0000;
    border: none;
    padding: 12px 30px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.punishment-modal .close-btn:hover {
    background-color: #f0e6d2;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

/* 按钮样式统一 */
button {
    padding: 8px 16px;
    font-size: 14px;
    background-color: #8b0000;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-weight: bold;
}

button:hover:not(:disabled) {
    background-color: #a52a2a;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>
