// 卡背组件加载工具

// 导入卡背Vue组件
import BackRole from '../cardBack/backRole.vue';
import BackFood from '../cardBack/backFood.vue';
import BackPunishment from '../cardBack/backPunishment.vue';
import BackTool from '../cardBack/backTool.vue';

// 卡背组件映射
const cardBackMap = {
    identity: BackRole,
    food: BackFood,
    punishment: BackPunishment,
    tool: BackTool,
};

// 获取卡背组件
const getCardBackComponent = (type = 'identity') => {
    return cardBackMap[type] || cardBackMap.identity;
};

export { getCardBackComponent };
