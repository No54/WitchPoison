<script setup>
import { ref, computed, onMounted } from 'vue';
import Tooltip from '../../utils/Tooltip.vue';
import { getCardBackComponent } from '../../utils/cardBackLoader.js';
import { identityDescriptions } from './identityCards.js';

const props = defineProps({
    identity: {
        type: String,
        required: true,
    },
    isRevealed: {
        type: Boolean,
        default: false,
    },
    width: {
        type: [String, Number],
        default: 150,
    },
    height: {
        type: [String, Number],
        default: 200,
    },
    isDebugMode: {
        type: Boolean,
        default: false,
    },
});

const showTooltip = ref(false);
const cardBackComponent = ref(null);

// 身份牌描述
const identityDescription = computed(() => {
    return identityDescriptions[props.identity] || '';
});

// 加载卡背组件
onMounted(() => {
    cardBackComponent.value = getCardBackComponent('identity');
});
</script>

<template>
    <div class="identity-card-wrapper">
        <div class="identity-card" :class="{ revealed: isRevealed }"
            :style="{ width: `${width}px`, height: `${height}px` }" @mouseenter="showTooltip = true"
            @mouseleave="showTooltip = false">
            <div v-if="!isRevealed" class="card-back">
                <!-- 使用动态组件渲染卡背 -->
                <component v-if="cardBackComponent && !isDebugMode" :is="cardBackComponent"
                    style="width: 100%; height: 100%;" />
                <!-- 兼容旧的图片URL方式 -->
                <div v-else-if="!isDebugMode" class="card-back-placeholder">
                    <div class="card-back-text">身份牌</div>
                </div>
                <div v-if="isDebugMode" class="card-front">
                    <div class="identity-name">{{ identity }}</div>
                </div>
            </div>
            <div v-else class="card-front">
                <div class="identity-name">{{ identity }}</div>
                <div class="identity-ability">{{ identityDescription }}</div>
            </div>
        </div>
        <!-- 使用Tooltip组件，仅在debug模式下显示 -->
        <Tooltip :message="identityDescription" :show="!isRevealed && showTooltip && isDebugMode" />
    </div>
</template>

<style scoped>
.identity-card-wrapper {
    position: relative;
    display: inline-block;
}

.identity-card {
    position: relative;
}

.card-front {
    position: relative;
}

/* Tooltip样式 */
.tooltip-container {
    position: absolute;
    z-index: 9999;
    pointer-events: none;
    /* 定位在卡牌下方居中 */
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 8px;
}

.tooltip-content {
    background-color: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 10px 15px;
    border-radius: 8px;
    font-size: 0.85em;
    max-width: 200px;
    line-height: 1.4;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    white-space: normal;
    word-wrap: break-word;
    box-sizing: border-box;
}

.identity-card {
    perspective: 1000px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    margin: 10px;
}

.card-back,
.card-front {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    padding: 15px;
    margin: 0;
    box-sizing: border-box;
    border: none;
}

.card-back {
    background-color: #4a4a4a;
    color: white;
    background-size: cover !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
}

.card-front {
    background-color: #fff;
    color: #333;
    text-align: center;
}

.identity-name {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 10px;
    color: #8b0000;
}

.identity-ability {
    font-size: 0.9em;
    line-height: 1.4;
    color: #666;
}

.card-back-placeholder {
    width: 100%;
    height: 100%;
    background-color: #4a4a4a;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
    box-sizing: border-box;
}
</style>
