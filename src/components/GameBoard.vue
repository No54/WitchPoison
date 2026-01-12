<script setup>
import { ref, onMounted, watch } from 'vue';
import GameOverModal from '../utils/GameOverModal.vue';
import GameStatusBar from '../utils/GameStatusBar.vue';
import IdentitySelectionView from './Identity/IdentitySelectionView.vue';
import GamePlayView from './ViewPlay/GamePlayView.vue';
import PunishmentModal from './Punishment/PunishmentModal.vue';
import PrivacyMask from '../utils/PrivacyMask.vue';
import { getCardBackUrl } from '../utils/cardBackLoader.js';
import { identityDescriptions } from './Identity/identityCards.js';
import { toolCards } from './Items/toolCards.js';
import { useGameState } from './GameStateManager.js';
import { useGameFlow } from './GameFlowManager.js';
import { useFoodEffects } from './Food/FoodEffectManager.js';
import { useItemEffects } from './Items/ItemEffectManager.js';
import { useRoleEffects } from './Identity/RoleEffectManager.js';

// 导入ToolCardOrderModal组件
import ToolCardOrderModal from './Items/ToolCardOrderModal.vue';
// 导入食物查看模态窗口组件
import FoodViewModal from '../utils/FoodViewModal.vue';
// 导入移形换影模态窗口组件
import ShapeShiftModal from '../utils/ShapeShiftModal.vue';
// 导入力量药剂模态窗口组件
import StrengthPotionModal from '../utils/StrengthPotionModal.vue';

// 卡背图片URL
const cardBackUrl = ref(null);

// 食物查看模态窗口相关状态
const showFoodViewModal = ref(false);
const foodViewModalTitle = ref('查看食物牌');
const foodViewModalMessage = ref('请选择要查看的食物牌');
const foodViewModalCards = ref([]);
const foodViewModalMaxViewCount = ref(1);
const foodViewModalIsSelectionMode = ref(true);

// 移形换影模态窗口相关状态
const showShapeShiftModal = ref(false);
const shapeShiftModalTitle = ref('移形换影效果');
const shapeShiftModalMessage = ref('请选择两张要交换位置的食物牌');

// 力量药剂模态窗口相关状态
const showStrengthPotionModal = ref(false);
const strengthPotionModalTitle = ref('力量药剂效果');
const strengthPotionModalMessage = ref('请选择一张要翻开的食物牌');

// 初始化游戏状态
const {
    gameState,
    currentPhase,
    currentPlayerIndex,
    round,
    gameOverReason,
    isDebugMode,
    players,
    playerCount,
    currentDrawerIndex,
    allIdentities,
    availableIdentities,
    foodCards,
    logs,
    addGameLog,
    resetGame,
    changePlayerCount,
    drawIdentity,
    shuffleArray,
    toolCardDeck,
    drawToolCard,
    updateToolCardDeck,
} = useGameState();

// 定义props和emit，合并所有属性和事件
const props = defineProps(['isDebugMode', 'showToolCardOrderModal']);
const emit = defineEmits([
    'use-tool',
    'toggle-debug',
    'open-tool-card-order-modal',
    'close-tool-card-order-modal',
    'update:toolCards',
]);

// 打开调整道具牌顺序模态窗口
const openToolCardOrderModal = () => {
    emit('open-tool-card-order-modal');
};

// 关闭调整道具牌顺序模态窗口
const closeToolCardOrderModal = () => {
    emit('close-tool-card-order-modal');
};

// 更新道具牌顺序
const updateToolCards = (newToolCards) => {
    // 更新道具牌堆
    updateToolCardDeck(newToolCards);
    // 更新调试模式下的道具牌副本
    debugToolCards.value = [...newToolCards];
    addGameLog('调试模式：道具牌顺序已更新', 'system');
    emit('update:toolCards', [...newToolCards]);
};

// 调试模式下的道具牌副本，使用完整的道具牌堆
const debugToolCards = ref([...toolCardDeck.value]);

// 监听toolCardDeck变化，同步更新debugToolCards
watch(
    () => toolCardDeck.value,
    (newDeck) => {
        debugToolCards.value = [...newDeck];
    },
    { deep: true }
);

// 加载卡背图片
const loadCardBack = async () => {
    const url = await getCardBackUrl('identity');
    cardBackUrl.value = url;
};

// 初始化游戏流程控制
const {
    showPrivacyMask,
    privacyMaskTitle,
    privacyMaskMessage,
    privacyOperationType,
    currentPrivacyPlayer,
    isMagnifierSelectionPhase,
    selectedMagnifierCard,
    magnifierCountdown,
    magnifierCountdownInterval,
    isSwapSelectionPhase,
    selectedSwapCards,
    isGoodLuckDewSelectionPhase,
    goodLuckDewOptions,
    goodLuckDewUser,
    isStrengthPotionTargetSelection,
    isStrengthPotionCardSelection,
    strengthPotionUser,
    strengthPotionTarget,
    isShuffling,
    startGame,
    nextPhase,
    skipPhase,
    nextPlayer,
    checkGameOver,
} = useGameFlow(
    gameState,
    currentPhase,
    currentPlayerIndex,
    round,
    players,
    foodCards,
    addGameLog,
    shuffleArray,
    drawToolCard
);

// 初始化食物牌效果处理
const { currentPunishment, showPunishmentModal, revealFoodCard, handlePunishmentClose } =
    useFoodEffects(
        players,
        currentPlayerIndex,
        foodCards,
        addGameLog,
        nextPhase,
        nextPlayer,
        checkGameOver,
        shuffleArray,
        currentPhase,
        currentPrivacyPlayer,
        privacyMaskTitle,
        privacyMaskMessage,
        privacyOperationType,
        showPrivacyMask,
        isStrengthPotionCardSelection,
        strengthPotionTarget,
        strengthPotionUser,
        isDebugMode,
        drawToolCard
    );

// 初始化道具牌效果处理
const {
    useTool,
    handleUseToolCard,
    handleStrengthPotionTargetSelect,
    handleStrengthPotionCardSelect,
    handleGoodLuckDewSelect,
} = useItemEffects(
    players,
    currentPlayerIndex,
    foodCards,
    addGameLog,
    nextPhase,
    shuffleArray,
    currentPrivacyPlayer,
    privacyMaskTitle,
    privacyMaskMessage,
    privacyOperationType,
    showPrivacyMask,
    isGoodLuckDewSelectionPhase,
    goodLuckDewOptions,
    goodLuckDewUser,
    isStrengthPotionTargetSelection,
    isStrengthPotionCardSelection,
    strengthPotionUser,
    strengthPotionTarget,
    drawToolCard,
    toolCardDeck,
    showFoodViewModal,
    foodViewModalTitle,
    foodViewModalMessage,
    foodViewModalCards,
    foodViewModalMaxViewCount,
    foodViewModalIsSelectionMode,
    showStrengthPotionModal,
    strengthPotionModalTitle,
    strengthPotionModalMessage
);

// 初始化角色技能效果处理
const {
    handleUseAbility,
    handleMagnifierCardSelect,
    handleSwapCardSelect,
    startCountdown,
    handlePrivacyMaskClose,
} = useRoleEffects(
    players,
    currentPlayerIndex,
    foodCards,
    addGameLog,
    nextPhase,
    nextPlayer,
    shuffleArray,
    currentPrivacyPlayer,
    privacyMaskTitle,
    privacyMaskMessage,
    privacyOperationType,
    showPrivacyMask,
    isMagnifierSelectionPhase,
    selectedMagnifierCard,
    magnifierCountdown,
    magnifierCountdownInterval,
    isSwapSelectionPhase,
    selectedSwapCards,
    isGoodLuckDewSelectionPhase,
    goodLuckDewOptions,
    goodLuckDewUser,
    isShuffling,
    showFoodViewModal,
    foodViewModalTitle,
    foodViewModalMessage,
    foodViewModalCards,
    foodViewModalMaxViewCount,
    foodViewModalIsSelectionMode,
    showShapeShiftModal,
    shapeShiftModalTitle,
    shapeShiftModalMessage
);

// 购买道具牌
const buyToolCard = () => {
    const currentPlayer = players.value[currentPlayerIndex.value];

    // 被动技能：小女孩 - 购买道具只需花费4积分
    const cost = currentPlayer.identity === '小女孩' ? 4 : 5;

    if (currentPlayer.score >= cost) {
        currentPlayer.score -= cost;
        addGameLog(`${currentPlayer.name}花费${cost}积分购买了一张道具牌`, 'player');

        // 被动技能：长老 - 购买道具时，抽二保留一
        if (currentPlayer.identity === '长老') {
            // 从道具牌堆中抽取两张道具牌
            const randomTool1 = drawToolCard();
            const randomTool2 = drawToolCard();

            // 显示隐私蒙版，让当前玩家选择道具
            currentPrivacyPlayer.value = currentPlayer;
            privacyMaskTitle.value = '长老技能效果';
            privacyMaskMessage.value = `其他玩家请闭眼，${currentPlayer.name}正在使用长老技能选择道具牌`;
            privacyOperationType.value = 'elder_choice';
            // 保存选择选项和使用者
            goodLuckDewOptions.value = [randomTool1, randomTool2];
            goodLuckDewUser.value = currentPlayer;
            showPrivacyMask.value = true;
            addGameLog(`长老抽二保留一，获得了选择道具的机会`, 'player');
            // 不调用nextPhase()，等待玩家选择道具
            return;
        } else {
            // 从道具牌堆中抽取一张道具牌
            const drawnTool = drawToolCard();
            if (drawnTool === null) {
                // 道具牌堆已空
                addGameLog(`${currentPlayer.name}想购买道具，但道具牌堆已空`, 'player');
            } else if (drawnTool.name === '解毒剂') {
                // 解毒剂特殊处理：立即触发效果，从手牌中移除，获得免疫状态
                addGameLog(
                    `${currentPlayer.name}获得了一张道具牌：${drawnTool.name}，立即触发效果`,
                    'player'
                );
                currentPlayer.hasImmunity++;
                addGameLog(
                    `${currentPlayer.name}获得了解毒剂，立即获得了免疫状态，解毒剂从手牌中移除`,
                    'player'
                );
            } else {
                // 普通道具处理：添加到手牌
                currentPlayer.hand.push(drawnTool.name);
                addGameLog(`${currentPlayer.name}获得了一张道具牌：${drawnTool.name}`, 'player');
            }
            // 进入下一个阶段
            nextPhase();
        }
    } else {
        addGameLog(`${currentPlayer.name}积分不足，无法购买道具牌`, 'player');
        // 进入下一个阶段
        nextPhase();
    }
};

// 切换玩家编辑状态
const toggleEditName = (player) => {
    player.isEditing = !player.isEditing;
    if (player.isEditing) {
        player.editName = player.name;
    }
};

// 保存玩家名字
const savePlayerName = (player) => {
    if (player.editName.trim()) {
        player.name = player.editName.trim();
    }
    player.isEditing = false;
};

// 处理食物查看模态窗口关闭
const handleFoodViewModalClose = () => {
    showFoodViewModal.value = false;
    // 继续游戏流程
    nextPhase();
};

// 处理食物查看模态窗口卡片选择
const handleFoodViewModalCardSelect = (index) => {
    // 这里可以处理卡片选择逻辑
    // 关闭模态窗口
    showFoodViewModal.value = false;
    // 继续游戏流程
    nextPhase();
};

// 处理移形换影模态窗口关闭
const handleShapeShiftModalClose = () => {
    showShapeShiftModal.value = false;
    // 继续游戏流程
    nextPhase();
};

// 处理移形换影卡片交换
const handleShapeShiftSwapCards = (indices) => {
    if (indices.length === 2) {
        const [index1, index2] = indices;

        // 交换两张卡片
        const temp = foodCards.value[index1];
        foodCards.value[index1] = foodCards.value[index2];
        foodCards.value[index2] = temp;

        // 添加游戏日志
        addGameLog(`${currentPrivacyPlayer.value.name}使用移形换影交换了两张食物牌`, 'player');

        // 关闭模态窗口
        showShapeShiftModal.value = false;
        // 继续游戏流程
        nextPhase();
    }
};

// 处理力量药剂模态窗口关闭
const handleStrengthPotionModalClose = () => {
    showStrengthPotionModal.value = false;
    // 继续游戏流程
    nextPhase();
};

// 处理力量药剂卡片选择
const handleStrengthPotionSelectCard = (index) => {
    if (strengthPotionTarget.value && strengthPotionUser.value) {
        // 获取选中的卡片
        const card = foodCards.value[index];

        // 处理翻牌效果，由目标玩家承担
        const targetPlayer = strengthPotionTarget.value;
        const userPlayer = strengthPotionUser.value;

        addGameLog(`${userPlayer.name}为${targetPlayer.name}翻开了一张食物牌`, 'player');

        // 揭示选中的卡片（实际游戏窗口的卡片）
        card.isRevealed = true;

        // 如果是毒药
        if (card.isPoison) {
            addGameLog(`${targetPlayer.name}抽到了毒药！`, 'player');

            // 检查目标玩家是否有解毒剂、守墓人技能或护身符效果
            const hasAntidote = targetPlayer.hand.includes('解毒剂');
            const isGraveKeeper =
                targetPlayer.identity === '守墓人' && !targetPlayer.hasUsedGraveKeeperAbility;
            const hasAmulet = targetPlayer.hasUsedAmulet || targetPlayer.hasRoundImmunity;
            const hasImmunity = targetPlayer.hasImmunity > 0;

            if (hasAntidote || hasImmunity || isGraveKeeper || hasAmulet) {
                let immunitySource = '';

                if (hasAntidote) {
                    // 使用解毒剂，避免出局
                    const cardIndex = targetPlayer.hand.indexOf('解毒剂');
                    targetPlayer.hand.splice(cardIndex, 1);
                    targetPlayer.hasImmunity--;
                    immunitySource = '解毒剂';
                } else if (hasAmulet) {
                    // 护身符效果：一轮免疫
                    targetPlayer.hasUsedAmulet = false;
                    targetPlayer.hasRoundImmunity = false;
                    immunitySource = '护身符';
                } else if (hasImmunity) {
                    // 免疫状态，避免出局
                    targetPlayer.hasImmunity--;
                    immunitySource = '免疫状态';
                } else if (isGraveKeeper) {
                    // 守墓人被动技能：免出局一次
                    targetPlayer.hasUsedGraveKeeperAbility = true;
                    if (targetPlayer.hasImmunity > 0) {
                        targetPlayer.hasImmunity--;
                    }
                    immunitySource = '守墓人技能';
                }

                // 将毒药盖回去和其他食物牌重新洗混
                card.isRevealed = false;
                const allFoodCards = [...foodCards.value];
                shuffleArray(allFoodCards);
                foodCards.value = allFoodCards;

                addGameLog(
                    `${targetPlayer.name}使用了${immunitySource}，避免了出局，毒药被重新洗混`,
                    'player'
                );
            } else {
                // 目标玩家出局
                targetPlayer.status = 'eliminated';
                addGameLog(`${targetPlayer.name}抽到了毒药，没有任何防护，出局了！`, 'player');
            }
        } else {
            // 普通食物牌，计算积分
            let pointsToAdd = card.value;

            // 检查目标玩家是否有翻倍效果（弓箭手技能或曲奇饼干）
            if (targetPlayer.nextCardDouble) {
                pointsToAdd *= 2;
                targetPlayer.nextCardDouble = false;
                addGameLog(`${targetPlayer.name}获得了翻倍效果，积分翻倍！`, 'player');
            }

            targetPlayer.score += pointsToAdd;
            addGameLog(
                `${targetPlayer.name}抽到了${card.name}，获得了${pointsToAdd}积分`,
                'player'
            );
        }

        // 关闭模态窗口
        showStrengthPotionModal.value = false;

        // 重置力量药剂状态
        strengthPotionUser.value = null;
        strengthPotionTarget.value = null;

        // 继续游戏流程
        nextPhase();
    }
};

onMounted(async () => {
    await loadCardBack();
    // 初始化玩家数量为2人
    changePlayerCount(2);
});

// 监听游戏状态变化，确保卡背图片在身份选择阶段也能加载
watch(gameState, async (newState) => {
    if (newState === 'identitySelection' && !cardBackUrl.value) {
        await loadCardBack();
    }
});

// 监听外部传入的isDebugMode变化，同步到内部状态
watch(
    () => props.isDebugMode,
    (newVal) => {
        // 这里需要将外部的debug模式同步到游戏状态中
        // 由于useGameState返回的是ref，我们可以直接修改它
        if (typeof isDebugMode !== 'undefined') {
            isDebugMode.value = newVal;
        }
    },
    { immediate: true }
);

// 监听cardBackUrl变化
watch(cardBackUrl, (newValue) => {});

// 移除了updateGameInfo事件监听，不再向父组件发送游戏信息
</script>

<template>
    <!-- 游戏状态显示 -->
    <GameStatusBar
        :gameState="gameState"
        :round="round"
        :currentPlayerName="players[currentPlayerIndex]?.name || ''"
        :currentPhase="currentPhase"
    />

    <!-- 身份抽取界面 -->
    <IdentitySelectionView
        v-if="gameState === 'identitySelection'"
        :players="players"
        :playerCount="playerCount"
        :currentDrawerIndex="currentDrawerIndex"
        :availableIdentities="availableIdentities"
        :cardBackUrl="cardBackUrl"
        :identityDescriptions="identityDescriptions"
        :is-debug-mode="isDebugMode"
        @changePlayerCount="changePlayerCount"
        @toggleEditName="toggleEditName"
        @savePlayerName="savePlayerName"
        @drawIdentity="drawIdentity"
        @startGame="startGame"
    />

    <!-- 游戏主界面 -->
    <GamePlayView
        v-if="gameState === 'playing'"
        :players="players"
        :currentPlayerIndex="currentPlayerIndex"
        :foodCards="foodCards"
        :currentPhase="currentPhase"
        :gamePhase="gameState"
        :isMagnifierSelectionPhase="isMagnifierSelectionPhase"
        :isSwapSelectionPhase="isSwapSelectionPhase"
        :isStrengthPotionTargetSelection="isStrengthPotionTargetSelection"
        :isStrengthPotionCardSelection="isStrengthPotionCardSelection"
        :isGoodLuckDewSelectionPhase="isGoodLuckDewSelectionPhase"
        :goodLuckDewOptions="goodLuckDewOptions"
        :is-debug-mode="isDebugMode"
        :isShuffling="isShuffling"
        @skipPhase="skipPhase"
        @buyToolCard="buyToolCard"
        @useTool="useTool"
        @useToolCard="handleUseToolCard"
        @revealFoodCard="revealFoodCard"
        @useAbility="handleUseAbility"
        @selectMagnifierCard="handleMagnifierCardSelect"
        @selectSwapCard="handleSwapCardSelect"
        @selectStrengthPotionTarget="handleStrengthPotionTargetSelect"
        @selectStrengthPotionCard="handleStrengthPotionCardSelect"
        @selectGoodLuckDewOption="handleGoodLuckDewSelect"
        :logs="logs"
    />

    <!-- 游戏结束显示 - 使用Modal窗口 -->
    <GameOverModal
        :show="gameState === 'gameOver'"
        :players="players"
        :game-over-reason="gameOverReason"
        @close="gameState = 'identitySelection'"
    />

    <!-- 惩罚牌显示模态框 -->
    <PunishmentModal
        :show="showPunishmentModal"
        :punishment="currentPunishment"
        :playerName="players[currentPlayerIndex]?.name || ''"
        @close="handlePunishmentClose"
    />

    <!-- 隐私操作蒙版 - 用于放大镜、移形换影、洗牌等功能 -->
    <PrivacyMask
        :show="showPrivacyMask"
        :title="privacyMaskTitle"
        :message="privacyMaskMessage"
        @close="handlePrivacyMaskClose"
    />

    <!-- 食物查看模态窗口 - 用于魔术师、窥视和放大镜效果 -->
    <FoodViewModal
        :show="showFoodViewModal"
        :title="foodViewModalTitle"
        :message="foodViewModalMessage"
        :food-cards="foodCards"
        :max-view-count="foodViewModalMaxViewCount"
        :is-debug-mode="isDebugMode"
        @close="handleFoodViewModalClose"
    />

    <!-- 移形换影模态窗口 - 用于移形换影效果 -->
    <ShapeShiftModal
        :show="showShapeShiftModal"
        :title="shapeShiftModalTitle"
        :message="shapeShiftModalMessage"
        :food-cards="foodCards"
        :is-debug-mode="isDebugMode"
        @close="handleShapeShiftModalClose"
        @swap-cards="handleShapeShiftSwapCards"
    />

    <!-- 力量药剂模态窗口 - 用于力量药剂效果 -->
    <StrengthPotionModal
        :show="showStrengthPotionModal"
        :title="strengthPotionModalTitle"
        :message="strengthPotionModalMessage"
        :food-cards="foodCards"
        :is-debug-mode="isDebugMode"
        @close="handleStrengthPotionModalClose"
        @select-card="handleStrengthPotionSelectCard"
    />

    <!-- 倒计时显示 - 可用于多种需要倒计时的场景 -->
    <!-- 放大镜效果已迁移到统一的食物查看模态窗口，不再需要倒计时 -->
    <div v-if="magnifierCountdown > 0 && false" class="countdown-display">
        <p>卡片将在 {{ magnifierCountdown }} 秒后翻回去</p>
    </div>

    <!-- 调试模式：调整道具牌顺序模态窗口 -->
    <ToolCardOrderModal
        :show="props.showToolCardOrderModal"
        :toolCards="debugToolCards"
        @close="closeToolCardOrderModal"
        @update:toolCards="updateToolCards"
    />
</template>

<style scoped></style>
