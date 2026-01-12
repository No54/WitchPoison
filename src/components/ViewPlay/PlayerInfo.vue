<script setup>
import { ref, computed, toRefs } from 'vue';
import Tooltip from '../../utils/Tooltip.vue';
import { identityDescriptions } from '../Identity/identityCards.js';
import { toolDescriptions } from '../Items/toolCards.js';
import { CHARACTERS_WITH_ACTIVE_ABILITY } from '../../constants.js';

const props = defineProps({
    player: {
        type: Object,
        required: true,
    },
    players: {
        type: Array,
        required: true,
    },
    currentPlayerIndex: {
        type: Number,
        required: true,
    },
    gamePhase: {
        type: String,
        default: '',
    },
    currentPhase: {
        type: String,
        default: '',
    },
    isStrengthPotionTargetSelection: {
        type: Boolean,
        default: false,
    },
});

// 使用toRefs将props转换为响应式ref对象
const {
    player,
    players,
    currentPlayerIndex,
    gamePhase,
    currentPhase,
    isStrengthPotionTargetSelection,
} = toRefs(props);

// 计算当前玩家是否是当前回合的玩家
const isCurrent = computed(() => {
    return player.value.id === players.value[currentPlayerIndex.value]?.id;
});

const emit = defineEmits([
    'skip-phase',
    'buy-tool',
    'use-tool',
    'use-ability',
    'select-strength-potion-target',
]);

// 显示tooltip的卡片索引
const tooltipIndex = ref(-1);

// 显示身份tooltip的标志
const showIdentityTooltip = ref(false);

// 跳过行动按钮的tooltip状态
const skipTooltip = ref('');

// 获取道具牌描述
const getToolDescription = (toolName) => {
    return toolDescriptions[toolName] || '';
};

// 获取身份描述
const getIdentityDescription = (identityName) => {
    return identityDescriptions[identityName] || '';
};

// 使用道具牌
const useTool = (toolName, index) => {
    emit('use-tool', { toolName, index });
};

// 计算属性：老流氓是否可以使用偷取积分技能
const canRogueSteal = computed(() => {
    // 检查是否已经使用过技能
    if (player.value.hasUsedActiveAbility) {
        return false;
    }

    // 检查是否有其他活跃玩家且积分至少为1（因为可以偷取1-3积分）
    const otherActivePlayers = players.value.filter(
        (p) => p.id !== player.value.id && p.status === 'active'
    );
    const hasValidTarget = otherActivePlayers.some((p) => p.score > 0);

    return hasValidTarget;
});

// 计算属性：技能是否已使用或不可用
const isAbilityUsed = computed(() => {
    switch (player.value.identity) {
        case '老流氓':
            return player.value.hasUsedActiveAbility;
        default:
            return player.value.hasUsedActiveAbility;
    }
});

// 计算属性：获取技能名称
const getAbilityName = computed(() => {
    switch (player.value.identity) {
        case '少女':
            return 'skipTurn';
        case '老流氓':
            return 'stealPoints';
        case '纯白之女':
            return 'reshuffle';
        case '弓箭手':
            return 'doubleNext';
        default:
            return '';
    }
});

// 计算属性：获取技能按钮文本
const getAbilityText = computed(() => {
    switch (player.value.identity) {
        case '少女':
            return '跳过回合';
        case '老流氓':
            return '偷取积分';
        case '纯白之女':
            return '重新洗牌';
        case '弓箭手':
            return '积分翻倍';
        default:
            return '';
    }
});

// 计算属性：获取玩家状态列表
const playerStates = computed(() => {
    const states = [];

    // 翻倍状态（弓箭手技能或曲奇饼干效果）
    if (player.value.nextCardDouble) {
        states.push('翻倍');
    }

    // 免疫状态
    if (player.value.hasImmunity > 0) {
        states.push(`免疫(${player.value.hasImmunity})`);
    }

    // 一轮免疫状态
    if (player.value.hasRoundImmunity) {
        states.push('一轮免疫');
    }

    return states;
});
</script>

<template>
    <div
        class="player-info"
        :class="{
            'current-player': isCurrent,
            eliminated: player.status === 'eliminated',
            'target-selectable':
                isStrengthPotionTargetSelection && !isCurrent && player.status === 'active',
        }"
        @click="
            isStrengthPotionTargetSelection &&
            !isCurrent &&
            player.status === 'active' &&
            $emit('select-strength-potion-target', player.id)
        "
    >
        <!-- 第一行：玩家姓名、积分水平排列 -->
        <div class="player-header">
            <div class="player-name">{{ player.name }}</div>
            <div class="player-score">积分: {{ player.score }}</div>
            <div class="player-status" v-if="player.status === 'eliminated'">已出局</div>
        </div>

        <!-- 第二行：玩家角色名和主动触发按钮 -->
        <div class="player-identity-section">
            <div
                class="player-identity"
                @mouseenter="showIdentityTooltip = true"
                @mouseleave="showIdentityTooltip = false"
            >
                {{ player.identity }}
                <Tooltip
                    :message="getIdentityDescription(player.identity)"
                    :show="showIdentityTooltip"
                />
            </div>

            <!-- 主动触发角色的按钮 -->
            <div class="active-ability-buttons" v-if="isCurrent && gamePhase === 'playing'">
                <!-- 统一的主动技能按钮 -->
                <button
                    v-if="CHARACTERS_WITH_ACTIVE_ABILITY.includes(player.identity)"
                    class="ability-btn"
                    :disabled="isAbilityUsed || currentPhase !== '行动一'"
                    @click="$emit('use-ability', { ability: getAbilityName, playerId: player.id })"
                >
                    {{ getAbilityText }}
                </button>
            </div>
        </div>

        <!-- 第三行：道具手牌 -->
        <div class="player-hand-section" v-if="player.hand.length > 0">
            <div class="hand-title">手牌:</div>
            <div class="hand-cards">
                <div
                    v-for="(card, index) in player.hand"
                    :key="index"
                    class="hand-card-wrapper"
                    @mouseenter="tooltipIndex = index"
                    @mouseleave="tooltipIndex = -1"
                >
                    <!-- 被动技能道具不可点击：解毒剂 -->
                    <span
                        class="hand-card"
                        :class="{ 'passive-tool': ['解毒剂'].includes(card) }"
                        @click="
                            isCurrent &&
                            gamePhase === 'playing' &&
                            currentPhase === '行动一' &&
                            !['解毒剂'].includes(card) &&
                            useTool(card, index)
                        "
                    >
                        {{ card }}
                    </span>
                    <Tooltip :message="getToolDescription(card)" :show="tooltipIndex === index" />
                </div>
            </div>
        </div>

        <!-- 第四行：玩家状态显示 -->
        <div class="player-states" v-if="player.status === 'active'">
            <div class="states-title">状态:</div>
            <div class="states-list">
                <span class="state-tag" v-for="state in playerStates" :key="state">
                    {{ state }}
                </span>
            </div>
        </div>

        <!-- 第五行：操作按钮区域 -->
        <div class="action-buttons" v-if="isCurrent && gamePhase === 'playing'">
            <!-- 行动一：使用道具牌 - 只有当有手牌时显示 -->
            <div v-if="currentPhase === '行动一'" class="action-btn-wrapper">
                <button
                    class="skip-btn-icon"
                    @click="$emit('skip-phase')"
                    @mouseenter="skipTooltip = 'action1'"
                    @mouseleave="skipTooltip = ''"
                >
                    ⏭️
                </button>
                <Tooltip :message="'跳过行动一'" :show="skipTooltip === 'action1'" />
            </div>

            <!-- 行动三：购买道具牌 -->
            <div v-if="currentPhase === '行动三'" class="buy-tool-section">
                <button
                    class="buy-btn"
                    @click="$emit('buy-tool')"
                    :disabled="player.score < (player.identity === '小女孩' ? 4 : 5)"
                >
                    购买道具牌
                </button>
                <div class="action-btn-wrapper">
                    <button
                        class="skip-btn-icon"
                        @click="$emit('skip-phase')"
                        @mouseenter="skipTooltip = 'action3'"
                        @mouseleave="skipTooltip = ''"
                    >
                        ⏭️
                    </button>
                    <Tooltip :message="'跳过行动三'" :show="skipTooltip === 'action3'" />
                </div>
            </div>
        </div>

        <div class="player-status" v-if="player.status === 'eliminated'">已出局</div>

        <!-- 第五行：游戏提示卡片 - 只显示在当前玩家卡片中，缩小样式 -->
        <div class="game-controls-small" v-if="isCurrent && gamePhase === 'playing'">
            <!-- 行动一：使用道具牌 -->
            <div v-if="currentPhase === '行动一'">
                <div class="phase-title">行动一：使用道具牌</div>
                <div class="phase-description-small">点击手牌中的道具牌使用</div>
            </div>

            <!-- 行动二：翻开食物牌 -->
            <div v-else-if="currentPhase === '行动二'">
                <div class="phase-title">行动二：翻开食物牌</div>
                <div class="phase-description-small">点击桌面上的任意一张未翻开的食物牌</div>
            </div>

            <!-- 行动三：购买道具牌 -->
            <div v-else-if="currentPhase === '行动三'">
                <div class="phase-title">行动三：购买道具牌</div>
                <div class="phase-description-small">
                    花费{{ player.identity === '小女孩' ? 4 : 5 }}积分购买一张道具牌
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.player-info {
    width: 300px;
    padding: 15px;
    margin: 0;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    position: relative;
    box-sizing: border-box;
    text-align: left;
}

/* 第一行：玩家姓名、积分水平排列 */
.player-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    flex-wrap: wrap;
    gap: 5px;
}

.player-name {
    font-size: 1.2em;
    font-weight: bold;
    color: #333;
    flex-shrink: 0;
}

.player-score {
    font-size: 1.1em;
    font-weight: bold;
    color: #8b0000;
    flex-shrink: 0;
}

/* 第二行：玩家角色名和主动触发按钮 */
.player-identity-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    flex-wrap: wrap;
    gap: 10px;
}

.player-identity {
    font-size: 0.9em;
    color: #666;
    font-style: italic;
    flex-shrink: 0;
    position: relative;
    display: inline-block;
}

/* 主动触发能力按钮 */
.active-ability-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.ability-btn {
    padding: 6px 12px;
    background-color: #4a6fa5;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;
    font-size: 0.85em;
    white-space: nowrap;
}

.ability-btn:hover {
    background-color: #3a5a8a;
}

.ability-btn:disabled {
    background-color: #cccccc;
    color: #666666;
    cursor: not-allowed;
    opacity: 0.7;
}

.ability-btn:disabled:hover {
    background-color: #cccccc;
}

/* 第三行：道具手牌 */
.player-hand-section {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    flex-wrap: wrap;
    gap: 8px;
}

.player-hand {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9em;
    width: 100%;
}

.hand-title {
    font-weight: bold;
    color: #666;
    white-space: nowrap;
}

.hand-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

.hand-card-wrapper {
    position: relative;
    display: inline-block;
}

.hand-card {
    background-color: #f0e6d2;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 0.85em;
    color: #333;
    cursor: pointer;
    transition: all 0.2s;
}

.hand-card:hover {
    background-color: #d4a76a;
    color: #fff;
}

/* 被动技能道具样式 */
.hand-card.passive-tool {
    background-color: #e0e0e0;
    color: #888;
    cursor: default;
}

.hand-card.passive-tool:hover {
    background-color: #e0e0e0;
    color: #888;
}

/* 第五行：操作按钮区域 */
.action-buttons {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
    width: 100%;
}

.action-buttons > div {
    display: flex;
    gap: 8px;
}

/* 购买道具按钮区域 */
.buy-tool-section {
    display: flex;
    align-items: center;
    gap: 8px;
}

/* 按钮样式 */
.skip-btn,
.buy-btn {
    padding: 6px 12px;
    background-color: #8b0000;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;
    font-size: 0.85em;
    white-space: nowrap;
}

.skip-btn:hover,
.buy-btn:hover {
    background-color: #a52a2a;
}

/* 图标按钮样式 */
.action-btn-wrapper {
    position: relative;
    display: inline-block;
}

.skip-btn-icon {
    padding: 6px;
    background-color: #8b0000;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition:
        background-color 0.3s,
        transform 0.2s;
    font-size: 1.2em;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    white-space: nowrap;
}

.skip-btn-icon:hover {
    background-color: #a52a2a;
    transform: scale(1.1);
}

.skip-btn-icon:active {
    transform: scale(0.95);
}

/* 第三行：游戏提示卡片 - 缩小样式 */
.game-controls-small {
    margin-top: 10px;
    padding: 8px;
    background-color: #f0e6d2;
    border-radius: 6px;
    font-size: 0.85em;
    width: 100%;
    box-sizing: border-box;
}

.phase-title {
    color: #8b0000;
    font-weight: bold;
    margin-bottom: 4px;
    font-size: 0.9em;
}

.phase-description-small {
    font-size: 0.8em;
    color: #666;
    line-height: 1.3;
}

.player-info.current-player {
    border: 2px solid #8b0000;
    box-shadow: 0 0 10px rgba(139, 0, 0, 0.5);
}

.player-info.eliminated {
    opacity: 0.5;
    background-color: #f0f0f0;
}

/* 力量药剂目标选择样式 */
.player-info.target-selectable {
    cursor: pointer;
    animation: pulse 1s infinite;
    border: 2px dashed #4caf50;
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
    100% {
        transform: scale(1);
    }
}

.player-status {
    margin-top: 10px;
    font-weight: bold;
    color: #8b0000;
    text-align: center;
}

/* 第四行：玩家状态显示 */
.player-states {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    flex-wrap: wrap;
    font-size: 0.9em;
}

.states-title {
    font-weight: bold;
    color: #666;
    white-space: nowrap;
}

.states-list {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

.state-tag {
    background-color: #4caf50;
    color: white;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 0.8em;
    font-weight: bold;
    white-space: nowrap;
}
</style>
