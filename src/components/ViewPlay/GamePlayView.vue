<script setup>
// 导入组件
import PlayerInfo from './PlayerInfo.vue';
import FoodCard from '../Food/FoodCard.vue';
import Layout_Play from './Layout_Play.vue';
import GameLog from './GameLog.vue';
import GoodLuckDewSelectionModal from '../Items/ItemCards/GoodLuckDewSelectionModal.vue';

// 接收props
const props = defineProps({
    players: {
        type: Array,
        required: true,
    },
    currentPlayerIndex: {
        type: Number,
        default: 0,
    },
    foodCards: {
        type: Array,
        default: () => [],
    },
    currentPhase: {
        type: String,
        default: '行动一',
    },
    gamePhase: {
        type: String,
        default: 'playing',
    },
    isMagnifierSelectionPhase: {
        type: Boolean,
        default: false,
    },
    isSwapSelectionPhase: {
        type: Boolean,
        default: false,
    },
    isStrengthPotionTargetSelection: {
        type: Boolean,
        default: false,
    },
    isStrengthPotionCardSelection: {
        type: Boolean,
        default: false,
    },
    isGoodLuckDewSelectionPhase: {
        type: Boolean,
        default: false,
    },
    goodLuckDewOptions: {
        type: Array,
        default: () => [],
    },
    logs: {
        type: Array,
        default: () => [],
    },
    isDebugMode: {
        type: Boolean,
        default: false,
    },
    isShuffling: {
        type: Boolean,
        default: false,
    },
});

// 定义emit
const emit = defineEmits([
    'skipPhase',
    'buyToolCard',
    'useTool',
    'useToolCard',
    'revealFoodCard',
    'useAbility',
    'selectMagnifierCard',
    'selectSwapCard',
    'selectStrengthPotionTarget',
    'selectStrengthPotionCard',
    'selectGoodLuckDewOption',
]);

// 跳过当前行动阶段
const skipPhase = () => {
    emit('skipPhase');
};

// 购买道具牌
const buyToolCard = () => {
    emit('buyToolCard');
};

// 使用道具牌
const useTool = (data) => {
    emit('useTool', data);
};

// 使用道具牌
const useToolCard = (card, index) => {
    emit('useToolCard', { card, index });
};

// 翻开食物牌或处理特殊选择
const revealFoodCard = (card) => {
    if (props.isMagnifierSelectionPhase) {
        emit('selectMagnifierCard', card);
    } else if (props.isSwapSelectionPhase) {
        emit('selectSwapCard', card);
    } else if (props.isStrengthPotionCardSelection) {
        emit('selectStrengthPotionCard', card);
    } else {
        emit('revealFoodCard', card);
    }
};

// 使用角色主动技能
const useAbility = (data) => {
    emit('useAbility', data);
};

// 选择力量药剂目标玩家
const selectStrengthPotionTarget = (playerId) => {
    emit('selectStrengthPotionTarget', playerId);
};
</script>

<template>
    <Layout_Play>
        <template #player1>
            <!-- 玩家1信息 -->
            <PlayerInfo
                v-if="players[0]"
                :player="players[0]"
                :players="players"
                :currentPlayerIndex="currentPlayerIndex"
                :gamePhase="gamePhase"
                :currentPhase="currentPhase"
                :isStrengthPotionTargetSelection="isStrengthPotionTargetSelection"
                @skip-phase="skipPhase"
                @buy-tool="buyToolCard"
                @use-tool="useTool"
                @use-ability="useAbility"
                @select-strength-potion-target="selectStrengthPotionTarget"
            />
        </template>
        <template #player2>
            <!-- 玩家2信息 -->
            <PlayerInfo
                v-if="players[1]"
                :player="players[1]"
                :players="players"
                :currentPlayerIndex="currentPlayerIndex"
                :gamePhase="gamePhase"
                :currentPhase="currentPhase"
                :isStrengthPotionTargetSelection="isStrengthPotionTargetSelection"
                @skip-phase="skipPhase"
                @buy-tool="buyToolCard"
                @use-tool="useTool"
                @use-ability="useAbility"
                @select-strength-potion-target="selectStrengthPotionTarget"
            />
        </template>
        <template #player3>
            <!-- 玩家3信息 -->
            <PlayerInfo
                v-if="players[2]"
                :player="players[2]"
                :players="players"
                :currentPlayerIndex="currentPlayerIndex"
                :gamePhase="gamePhase"
                :currentPhase="currentPhase"
                :isStrengthPotionTargetSelection="isStrengthPotionTargetSelection"
                @skip-phase="skipPhase"
                @buy-tool="buyToolCard"
                @use-tool="useTool"
                @use-ability="useAbility"
                @select-strength-potion-target="selectStrengthPotionTarget"
            />
            <div v-else>{{ ' ' }}</div>
        </template>
        <template #player4>
            <!-- 玩家4信息 -->
            <PlayerInfo
                v-if="players[3]"
                :player="players[3]"
                :players="players"
                :currentPlayerIndex="currentPlayerIndex"
                :gamePhase="gamePhase"
                :currentPhase="currentPhase"
                :isStrengthPotionTargetSelection="isStrengthPotionTargetSelection"
                @skip-phase="skipPhase"
                @buy-tool="buyToolCard"
                @use-tool="useTool"
                @use-ability="useAbility"
                @select-strength-potion-target="selectStrengthPotionTarget"
            />
            <div v-else>{{ ' ' }}</div>
        </template>
        <template #food>
            <!-- 5x5食物牌桌面 -->
            <div class="food-cards-grid">
                <FoodCard
                    v-for="card in foodCards"
                    :key="card.id"
                    :card="card"
                    :current-phase="currentPhase"
                    :is-debug-mode="isDebugMode"
                    :is-shuffling="isShuffling"
                    @reveal="revealFoodCard"
                />
            </div>
        </template>
        <template #log>
            <GameLog :logs="logs" />
        </template>
        <template #footer>{{ ' ' }}</template>
    </Layout_Play>

    <!-- 强运甘露选择道具modal框 - 使用独立组件 -->
    <GoodLuckDewSelectionModal
        :show="isGoodLuckDewSelectionPhase"
        :options="goodLuckDewOptions"
        @select-option="emit('selectGoodLuckDewOption', $event)"
    />
</template>

<style scoped>
/* 5x5食物牌桌面 - 减小10%大小 */
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
</style>
