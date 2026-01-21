<script setup>
import { ref, onMounted, shallowRef } from 'vue';
import { getCardBackComponent } from '../../utils/cardBackLoader.js';

const props = defineProps({
    card: {
        type: Object,
        required: true,
    },
    currentPhase: {
        type: String,
        required: true,
    },
    isDebugMode: {
        type: Boolean,
        default: false,
    },
    isShuffling: {
        type: Boolean,
        default: false,
    },
    isModalContext: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['reveal']);

const cardBackComponent = shallowRef(null);

const handleClick = () => {
    // 在模态窗口中，允许点击任何卡片，不考虑阶段
    if (props.isModalContext) {
        emit('reveal', props.card);
    } else if (!props.card.isRevealed && props.currentPhase !== '行动一') {
        emit('reveal', props.card);
    }
};

// 加载卡背组件
onMounted(() => {
    cardBackComponent.value = getCardBackComponent('food');
});
</script>

<template>
    <div class="food-card" :class="{
        revealed: card.isRevealed,
        poison: card.isPoison,
        disabled: !isModalContext && (currentPhase === '行动一' || currentPhase === '行动三'),
        [card.type]: true,
        shuffling: isShuffling,
    }" @click="handleClick">
        <div v-if="!card.isRevealed" class="card-back">
            <!-- 使用动态组件渲染卡背 -->
            <component v-if="cardBackComponent && !isDebugMode" :is="cardBackComponent"
                style="width: 100%; height: 100%;" />
            <!-- 兼容旧的图片URL方式 -->
            <div v-else-if="!isDebugMode" class="card-back-placeholder">
                <div class="card-back-text">食物牌</div>
            </div>
            <div class="debug-card-content" v-if="isDebugMode">
                <div v-if="card.isPoison" class="poison-text">女巫的毒药</div>
                <div v-else class="food-info">
                    <div class="food-name">{{ card.name }}</div>
                    <div v-if="card.value > 0" class="food-value">+{{ card.value }}</div>
                    <div v-if="card.effect" class="food-effect">{{ card.description }}</div>
                </div>
            </div>
        </div>
        <div v-else class="card-front">
            <div v-if="card.isPoison" class="poison-text">女巫的毒药</div>
            <div v-else class="food-info">
                <div class="food-name">{{ card.name }}</div>
                <div v-if="card.value > 0" class="food-value">+{{ card.value }}</div>
                <div v-if="card.effect" class="food-effect">{{ card.description }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.food-card {
    width: 100%;
    height: 100%;
    perspective: 1000px;
    cursor: pointer;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 洗牌动画 */
.food-card.shuffling {
    animation: shuffle 1s ease-in-out;
}

@keyframes shuffle {
    0% {
        transform: translateY(0) rotate(0deg);
    }

    25% {
        transform: translateY(-20px) rotate(15deg);
    }

    50% {
        transform: translateY(20px) rotate(-15deg);
    }

    75% {
        transform: translateY(-10px) rotate(7deg);
    }

    100% {
        transform: translateY(0) rotate(0deg);
    }
}

.food-card:hover {
    transform: translateY(-2px);
}

.food-card.revealed {
    cursor: default;
}

.card-back,
.card-front {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    border-radius: 8px;
    padding: 8px;
    text-align: center;
    box-sizing: border-box;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.card-back {
    background-color: #8b0000;
    color: white;
}

.card-front {
    background-color: #fff;
    color: #333;
    border: 2px solid #8b0000;
}

/* 毒药牌样式 */
.food-card.poison .card-front {
    background-color: #ffcccc;
    color: #8b0000;
    border-color: #8b0000;
}

/* 普通食物牌样式 */
.food-card.normal .card-front {
    background-color: #e8f5e8;
    border-color: #4caf50;
}

/* 特殊效果食物牌样式 */
.food-card.special .card-front {
    background-color: #fff3e0;
    border-color: #ff9800;
}

.food-card.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.food-card.disabled:hover {
    transform: none;
}

/* 食物牌信息样式 */
.food-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    height: 100%;
    width: 100%;
    overflow: hidden;
}

.food-name {
    font-size: clamp(0.8em, 3vw, 1.2em);
    font-weight: bold;
    color: #333;
    margin-bottom: 3px;
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: 1.1;
    width: 100%;
}

.food-value {
    font-size: clamp(1em, 4vw, 1.5em);
    font-weight: bold;
    color: #4caf50;
    line-height: 1.1;
}

.food-effect {
    font-size: clamp(0.6em, 2vw, 0.8em);
    color: #666;
    font-weight: normal;
    margin-top: 3px;
    line-height: 1.3;
    word-wrap: break-word;
    overflow-wrap: break-word;
    width: 100%;
    max-height: 60%;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.poison-text {
    font-size: clamp(0.8em, 3vw, 1.2em);
    font-weight: bold;
    color: #8b0000;
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: 1.1;
    width: 100%;
}

.card-back-text {
    font-size: clamp(1em, 4vw, 1.5em);
    color: white;
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: 1.1;
    width: 100%;
}

.card-back-placeholder {
    width: 100%;
    height: 100%;
    background-color: #8b0000;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    padding: 8px;
    text-align: center;
    box-sizing: border-box;
}
</style>
