<script setup>
const props = defineProps({
    message: {
        type: String,
        required: true,
    },
    show: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <div class="tooltip" v-if="show" :class="['tooltip']">
        <div class="tooltip-content">{{ message }}</div>
    </div>
</template>

<style scoped>
/* Tooltip样式，显示在卡片右下角 */
.tooltip {
    position: absolute;
    top: 100%;
    left: 60%;
    transform: none;
    z-index: 9999;
    pointer-events: none;
    margin-top: 0;
    margin-left: 0;
}

.tooltip-content {
    background-color: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 0.85em;
    max-width: none;
    width: auto;
    line-height: 1.4;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    white-space: nowrap;
    word-wrap: normal;
    box-sizing: border-box;
    display: inline-block;
    position: relative;
}

/* 添加箭头 */
.tooltip-content::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 10px;
    transform: none;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent rgba(0, 0, 0, 0.9) transparent;
}
</style>
