import { ref } from 'vue';
import { toolCards } from './Items/toolCards.js';
import { createRoleSkillManager } from './Identity/roleSkillManager.js';
import { CHARACTERS_WITH_ACTIVE_ABILITY, PASSIVE_TOOLS } from '../constants.js';

export function useGameFlow(
    gameState,
    currentPhase,
    currentPlayerIndex,
    round,
    players,
    foodCards,
    addGameLog,
    shuffleArray,
    drawToolCard
) {
    // 通用隐私操作相关状态
    const showPrivacyMask = ref(false);
    const privacyMaskTitle = ref('');
    const privacyMaskMessage = ref('');
    const privacyOperationType = ref(''); // magnifier, reshuffle, swap_cards等
    const currentPrivacyPlayer = ref(null);

    // 放大镜功能相关状态
    const isMagnifierSelectionPhase = ref(false);
    const selectedMagnifierCard = ref(null);
    const magnifierCountdown = ref(0);
    const magnifierCountdownInterval = ref(null);

    // 移形换影功能相关状态
    const isSwapSelectionPhase = ref(false);
    const selectedSwapCards = ref([]);

    // 强运甘露功能相关状态
    const isGoodLuckDewSelectionPhase = ref(false);
    const goodLuckDewOptions = ref([]);
    const goodLuckDewUser = ref(null);

    // 力量药剂功能相关状态
    const isStrengthPotionTargetSelection = ref(false);
    const isStrengthPotionCardSelection = ref(false);
    const strengthPotionUser = ref(null);
    const strengthPotionTarget = ref(null);

    // 洗牌功能相关状态
    const isShuffling = ref(false);

    // 创建角色技能管理器实例
    const roleSkillManager = createRoleSkillManager();

    // 开始游戏
    const startGame = () => {
        // 确保所有玩家都已抽取身份
        if (players.value.every((player) => player.identity !== '')) {
            // 洗牌食物牌
            shuffleArray(foodCards.value);

            // 为每个玩家添加技能相关的初始状态
            players.value.forEach((player) => {
                // 使用角色技能管理器初始化角色状态
                roleSkillManager.initRoleStates(player);

                // 被动技能：守墓人 - 游戏开始时获得免疫状态
                if (player.identity === '守墓人') {
                    player.hasImmunity = 1;
                }

                // 被动技能：学者 - 游戏开始时获得5点积分
                if (player.identity === '学者') {
                    player.score = 5;
                } else {
                    player.score = 3;
                }

                // 被动技能：女仆 - 游戏开始时获得一张道具牌
                if (player.identity === '女仆') {
                    // 从道具牌堆中抽取一张道具牌
                    const drawnTool = drawToolCard();
                    if (drawnTool !== null) {
                        if (drawnTool.name === '解毒剂') {
                            // 解毒剂特殊处理：立即触发效果，从手牌中移除，获得免疫状态
                            addGameLog(
                                `${player.name}获得了一张道具牌：${drawnTool.name}，立即触发效果`,
                                'system'
                            );
                            player.hasImmunity++;
                            addGameLog(
                                `${player.name}获得了解毒剂，立即获得了免疫状态，解毒剂从手牌中移除`,
                                'system'
                            );
                        } else {
                            // 普通道具处理：添加到手牌
                            player.hand.push(drawnTool.name);
                            addGameLog(
                                `${player.name}获得了一张道具牌：${drawnTool.name}`,
                                'system'
                            );
                        }
                    } else {
                        // 道具牌堆已空
                        addGameLog(`${player.name}想获得道具，但道具牌堆已空`, 'system');
                    }
                }
            });

            // 开始游戏
            gameState.value = 'playing';
            currentPhase.value = '行动一';

            // 添加游戏开始日志
            addGameLog('游戏开始！', 'system');
            players.value.forEach((player) => {
                addGameLog(`${player.name} 抽取了身份：${player.identity}`, 'system');
            });
            addGameLog(
                `当前回合：第${round.value}回合，当前玩家：${players.value[currentPlayerIndex.value].name}，当前阶段：${currentPhase.value}`,
                'system'
            );

            // 如果当前玩家没有手牌或只有被动技能道具，直接跳过行动一
            const currentPlayer = players.value[currentPlayerIndex.value];
            // 检查手牌是否全部为被动技能道具
            const hasOnlyPassiveTools =
                currentPlayer.hand.length > 0 &&
                currentPlayer.hand.every((card) => PASSIVE_TOOLS.includes(card));

            // 检查玩家是否有主动技能
            const hasActiveAbility = CHARACTERS_WITH_ACTIVE_ABILITY.includes(
                currentPlayer.identity
            );

            // 检查玩家是否已经使用了主动技能
            const hasUsedActiveAbility = currentPlayer.hasUsedActiveAbility;

            // 如果玩家没有主动技能，或者虽然有主动技能但已经使用了，且没有手牌或只有被动技能道具，才跳过行动一阶段
            if (
                (!hasActiveAbility || hasUsedActiveAbility) &&
                (currentPlayer.hand.length === 0 || hasOnlyPassiveTools)
            ) {
                // 添加日志说明跳过原因
                addGameLog(
                    `${currentPlayer.name}${currentPlayer.hand.length === 0 ? '没有手牌' : '只有被动技能道具'}，跳过行动一阶段`,
                    'player'
                );
                // 使用setTimeout延迟调用，避免组件更新时的无限循环
                setTimeout(() => {
                    nextPhase();
                }, 100);
            }
        }
    };

    // 进入下一个行动阶段
    const nextPhase = () => {
        const currentPlayer = players.value[currentPlayerIndex.value];

        if (currentPhase.value === '行动一') {
            currentPhase.value = '行动二';
            addGameLog(`${currentPlayer.name}进入行动二阶段`, 'player');
        } else if (currentPhase.value === '行动二') {
            currentPhase.value = '行动三';
            addGameLog(`${currentPlayer.name}进入行动三阶段`, 'player');

            // 检查当前玩家积分，如果不足购买道具所需积分，直接跳过行动三
            // 小女孩购买道具只需4积分，其他玩家需要5积分
            const requiredPoints = currentPlayer.identity === '小女孩' ? 4 : 5;
            if (currentPlayer.score < requiredPoints) {
                addGameLog(`${currentPlayer.name}积分不足，跳过行动三阶段`, 'player');
                // 使用setTimeout延迟递归调用，给组件足够的时间来更新
                setTimeout(() => {
                    nextPhase();
                }, 100);
            }
        } else if (currentPhase.value === '行动三') {
            // 三个行动都完成，切换到下一个玩家
            nextPlayer();
        }
    };

    // 跳过当前行动阶段
    const skipPhase = () => {
        const currentPlayer = players.value[currentPlayerIndex.value];
        addGameLog(`${currentPlayer.name}手动跳过了${currentPhase.value}阶段`, 'player');
        nextPhase();
    };

    // 切换到下一个玩家
    const nextPlayer = () => {
        const previousIndex = currentPlayerIndex.value;

        do {
            currentPlayerIndex.value = (currentPlayerIndex.value + 1) % players.value.length;
        } while (players.value[currentPlayerIndex.value].status === 'eliminated');

        // 重置行动阶段
        currentPhase.value = '行动一';

        // 只有当切换到第一个玩家时（即完成了一轮），才增加回合数
        if (currentPlayerIndex.value < previousIndex) {
            round.value++;
        }

        // 如果当前玩家没有手牌或只有被动技能道具，直接跳过行动一
        const currentPlayer = players.value[currentPlayerIndex.value];
        // 重置护身符效果，因为回合已经开始
        currentPlayer.hasUsedAmulet = false;
        // 重置一轮免疫状态
        currentPlayer.hasRoundImmunity = false;
        // 检查手牌是否全部为被动技能道具
        const hasOnlyPassiveTools =
            currentPlayer.hand.length > 0 &&
            currentPlayer.hand.every((card) => PASSIVE_TOOLS.includes(card));

        // 检查玩家是否有主动技能
        const hasActiveAbility = CHARACTERS_WITH_ACTIVE_ABILITY.includes(currentPlayer.identity);

        // 检查玩家是否已经使用了主动技能
        const hasUsedActiveAbility = currentPlayer.hasUsedActiveAbility;

        // 添加玩家切换日志
        addGameLog(
            `回合结束！当前回合：第${round.value}回合，当前玩家：${currentPlayer.name}，当前阶段：${currentPhase.value}`,
            'system'
        );

        // 如果玩家没有主动技能，或者虽然有主动技能但已经使用了，且没有手牌或只有被动技能道具，才跳过行动一阶段
        if (
            (!hasActiveAbility || hasUsedActiveAbility) &&
            (currentPlayer.hand.length === 0 || hasOnlyPassiveTools)
        ) {
            addGameLog(
                `${currentPlayer.name}${currentPlayer.hand.length === 0 ? '没有手牌' : '只有被动技能道具'}，跳过行动一阶段`,
                'player'
            );
            // 使用setTimeout延迟调用，避免组件更新时的无限循环
            setTimeout(() => {
                nextPhase();
            }, 100);
        }
    };

    // 检查游戏是否结束
    const checkGameOver = () => {
        const activePlayers = players.value.filter((player) => player.status === 'active');
        if (activePlayers.length === 1) {
            return {
                isOver: true,
                reason: `${activePlayers[0].name} 获胜，其他玩家已全部出局！`,
            };
        }

        // 检查是否只剩毒药牌
        const unrevealedCards = foodCards.value.filter((card) => !card.isRevealed);
        if (unrevealedCards.length > 0 && unrevealedCards.every((card) => card.isPoison)) {
            return {
                isOver: true,
                reason: '桌面上只剩毒药牌，游戏结束！根据积分排名决定胜负。',
            };
        }

        // 检查是否所有食物牌都被翻开了
        const allCardsRevealed = foodCards.value.every((card) => card.isRevealed);
        if (allCardsRevealed) {
            return {
                isOver: true,
                reason: '所有食物牌已被翻开，游戏结束！根据积分排名决定胜负。',
            };
        }

        return { isOver: false };
    };

    return {
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
    };
}
