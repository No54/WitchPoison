import { ref } from 'vue';
import { toolCards } from '../Items/toolCards.js';
import { punishmentCards } from '../Punishment/punishmentCards.js';

export function useFoodEffects(
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
    isDebugMode = { value: false },
    drawToolCard,
    gameState,
    gameOverReason
) {
    // 当前展示的惩罚牌
    const currentPunishment = ref(null);
    const showPunishmentModal = ref(false);

    // 翻开食物牌
    const revealFoodCard = (card) => {
        // 只有在行动二阶段且当前玩家是活跃状态才能翻开食物牌
        const currentPlayer = players.value[currentPlayerIndex.value];
        if (
            !card.isRevealed &&
            currentPhase.value === '行动二' &&
            currentPlayer.status === 'active'
        ) {
            card.isRevealed = true;

            addGameLog(`${currentPlayer.name}翻开了一张食物牌`, 'player');

            if (card.isPoison) {
                addGameLog(`${currentPlayer.name}抽到了毒药！`, 'player');
                // 抽到毒药，检查玩家是否有免疫状态、解毒剂道具、守墓人技能或护身符效果
                const hasAntidote = currentPlayer.hand.includes('解毒剂');
                const isGraveKeeper =
                    currentPlayer.identity === '守墓人' && !currentPlayer.hasUsedGraveKeeperAbility;
                const hasAmulet = currentPlayer.hasUsedAmulet || currentPlayer.hasRoundImmunity;
                const hasImmunity = currentPlayer.hasImmunity > 0;

                if (hasAntidote || hasImmunity || isGraveKeeper || hasAmulet) {
                    let immunitySource = '';

                    if (hasAntidote) {
                        // 使用解毒剂，避免出局
                        const cardIndex = currentPlayer.hand.indexOf('解毒剂');
                        currentPlayer.hand.splice(cardIndex, 1);
                        currentPlayer.hasImmunity--;
                        immunitySource = '解毒剂';
                    } else if (hasAmulet) {
                        // 护身符效果：一轮免疫
                        currentPlayer.hasUsedAmulet = false;
                        currentPlayer.hasRoundImmunity = false;
                        immunitySource = '护身符';
                    } else if (hasImmunity) {
                        // 免疫状态，避免出局
                        currentPlayer.hasImmunity--;
                        immunitySource = '免疫状态';
                    } else if (isGraveKeeper) {
                        // 守墓人被动技能：免出局一次
                        currentPlayer.hasUsedGraveKeeperAbility = true;
                        if (currentPlayer.hasImmunity > 0) {
                            currentPlayer.hasImmunity--;
                        }
                        immunitySource = '守墓人技能';
                    }

                    // 将毒药盖回去和其他食物牌重新洗混
                    card.isRevealed = false;
                    const allFoodCards = [...foodCards.value];
                    shuffleArray(allFoodCards);
                    foodCards.value = allFoodCards;

                    addGameLog(
                        `${currentPlayer.name}使用了${immunitySource}，避免了出局，毒药被重新洗混`,
                        'player'
                    );
                    // 进入下一个阶段
                    nextPhase();
                } else {
                    if (isDebugMode.value) {
                        // 调试模式：毒药效果关闭，直接进入下一阶段
                        addGameLog(
                            `${currentPlayer.name}抽到了毒药，但调试模式下毒药效果已关闭`,
                            'player'
                        );
                        // 直接进入下一个阶段
                        nextPhase();
                    } else {
                        // 正常模式：没有解毒剂、守墓人技能或护身符，玩家出局
                        currentPlayer.status = 'eliminated';
                        addGameLog(
                            `${currentPlayer.name}没有解毒剂、守墓人技能或护身符，出局了`,
                            'player'
                        );

                        // 检查游戏是否结束
                        const gameOverResult = checkGameOver();
                        if (gameOverResult.isOver) {
                            // 游戏结束，更新游戏状态
                            if (gameState && gameOverReason) {
                                gameState.value = 'gameOver';
                                gameOverReason.value = gameOverResult.reason;
                            }
                        } else {
                            // 游戏未结束，抽一张惩罚牌
                            const randomIndex = Math.floor(Math.random() * punishmentCards.length);
                            currentPunishment.value = punishmentCards[randomIndex];
                            showPunishmentModal.value = true;
                            // 不调用nextPhase()，等待惩罚模态框关闭后再处理
                        }
                    }
                }
            } else {
                // 处理不同类型的食物牌效果
                switch (card.effect) {
                    case 'steal_points':
                        // 棒棒糖：获得其他玩家的3积分
                        const otherPlayers = players.value.filter(
                            (p) => p.id !== currentPlayer.id && p.status === 'active'
                        );
                        if (otherPlayers.length > 0) {
                            const targetPlayer =
                                otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
                            const stealAmount = Math.min(3, targetPlayer.score);
                            targetPlayer.score -= stealAmount;
                            currentPlayer.score += stealAmount;
                            addGameLog(
                                `${currentPlayer.name}抽到了棒棒糖，从${targetPlayer.name}那里获得了${stealAmount}积分`,
                                'player'
                            );
                        }
                        break;

                    case 'double_next':
                        // 曲奇饼干：下一张食物牌的积分翻倍
                        currentPlayer.nextCardDouble = true;
                        addGameLog(
                            `${currentPlayer.name}获得了下一张食物牌积分翻倍效果（翻倍状态）`,
                            'player'
                        );
                        break;

                    case 'view_card':
                        // 放大镜：立即查看场上一张食物牌
                        currentPrivacyPlayer.value = currentPlayer;
                        privacyMaskTitle.value = '放大镜效果';
                        privacyMaskMessage.value = `其他玩家请闭眼，${currentPlayer.name}正在使用放大镜查看一张食物牌`;
                        privacyOperationType.value = 'magnifier';
                        showPrivacyMask.value = true;
                        addGameLog(
                            `${currentPlayer.name}使用了放大镜，需要查看一张食物牌`,
                            'player'
                        );

                        // 不调用nextPhase()，等待玩家选择完卡片后再继续
                        return;
                        break;

                    case 'get_tool':
                        // 魔法草药：立即拿取一张道具牌
                        const drawnTool = drawToolCard();
                        if (drawnTool !== null) {
                            if (drawnTool.name === '解毒剂') {
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
                                addGameLog(
                                    `${currentPlayer.name}获得了一张道具牌：${drawnTool.name}`,
                                    'player'
                                );
                            }
                        } else {
                            addGameLog(
                                `${currentPlayer.name}尝试获得道具牌，但道具牌堆已空`,
                                'player'
                            );
                        }
                        break;

                    case 'draw_again':
                        // 能量饮料：立即再翻一张食物牌
                        // 这里不需要额外处理，因为函数会继续执行，玩家可以在下一轮翻开另一张牌
                        addGameLog(`${currentPlayer.name}获得了再翻一张食物牌的机会`, 'player');
                        // 不调用nextPhase()，让玩家可以继续翻牌
                        return;

                    default:
                        // 普通食物牌：获取积分
                        let pointsToAdd = card.value;

                        // 检查是否有翻倍效果（弓箭手技能或曲奇饼干）
                        if (currentPlayer.nextCardDouble) {
                            pointsToAdd *= 2;
                            // 重置翻倍状态
                            currentPlayer.nextCardDouble = false;
                            addGameLog(
                                `${currentPlayer.name}的下一张食物牌积分翻倍，获得了${pointsToAdd}积分`,
                                'player'
                            );
                        } else {
                            addGameLog(`${currentPlayer.name}获得了${pointsToAdd}积分`, 'player');
                        }

                        currentPlayer.score += pointsToAdd;
                }

                // 进入下一个阶段
                nextPhase();
            }
        }

        // 检查游戏是否结束
        const gameOverResult = checkGameOver();
        console.log('游戏结束检查结果:', gameOverResult);
        // 更新游戏结束状态
        if (gameOverResult.isOver) {
            // 游戏结束，更新游戏状态
            if (gameState && gameOverReason) {
                gameState.value = 'gameOver';
                gameOverReason.value = gameOverResult.reason;
                console.log('游戏已结束，原因:', gameOverResult.reason);
            }
        }
    };

    // 处理力量药剂食物牌选择
    const handleStrengthPotionCardSelect = (card) => {
        if (isStrengthPotionCardSelection.value && !card.isRevealed) {
            // 结束选择阶段
            isStrengthPotionCardSelection.value = false;

            // 翻开选中的食物牌，效果由目标玩家承担
            card.isRevealed = true;

            const targetPlayer = strengthPotionTarget.value;
            const userPlayer = strengthPotionUser.value;

            addGameLog(`${userPlayer.name}帮${targetPlayer.name}翻开了一张食物牌`, 'player');

            // 处理食物牌效果，与正常翻牌逻辑相同，但目标是被选择的玩家
            if (card.isPoison) {
                // 抽到毒药，检查目标玩家是否有解毒剂道具、守墓人技能或护身符效果
                const hasAntidote = targetPlayer.hand.includes('解毒剂');
                const isGraveKeeper =
                    targetPlayer.identity === '守墓人' && !targetPlayer.hasUsedGraveKeeperAbility;
                const hasAmulet = targetPlayer.hasUsedAmulet || targetPlayer.hasRoundImmunity;
                const hasImmunity = targetPlayer.hasImmunity > 0;

                if (hasAntidote) {
                    // 使用解毒剂，避免出局
                    const cardIndex = targetPlayer.hand.indexOf('解毒剂');
                    targetPlayer.hand.splice(cardIndex, 1);
                    targetPlayer.hasImmunity--;
                    addGameLog(`${targetPlayer.name}使用了解毒剂，避免出局`, 'player');
                    // 进入下一个阶段
                    nextPhase();
                } else if (hasAmulet) {
                    // 使用护身符，避免出局
                    targetPlayer.hasUsedAmulet = false;
                    targetPlayer.hasRoundImmunity = false;
                    addGameLog(`${targetPlayer.name}使用了护身符，避免出局`, 'player');
                    // 进入下一个阶段
                    nextPhase();
                } else if (hasImmunity) {
                    // 免疫状态，避免出局
                    targetPlayer.hasImmunity--;
                    addGameLog(`${targetPlayer.name}使用了免疫状态，避免出局`, 'player');
                    // 进入下一个阶段
                    nextPhase();
                } else if (isGraveKeeper) {
                    // 守墓人被动技能：免出局一次，随后将毒药盖回去和其他食物牌重新洗混
                    targetPlayer.hasUsedGraveKeeperAbility = true;
                    if (targetPlayer.hasImmunity > 0) {
                        targetPlayer.hasImmunity--;
                    }
                    card.isRevealed = false;

                    // 将所有食物牌重新洗混
                    const allFoodCards = [...foodCards.value];
                    shuffleArray(allFoodCards);
                    foodCards.value = allFoodCards;

                    addGameLog(
                        `${targetPlayer.name}（守墓人）使用了免死技能，毒药被重新洗混`,
                        'player'
                    );
                    // 进入下一个阶段
                    nextPhase();
                } else {
                    if (isDebugMode.value) {
                        // 调试模式：毒药效果关闭，直接进入下一阶段
                        addGameLog(
                            `${targetPlayer.name}抽到了毒药，但调试模式下毒药效果已关闭`,
                            'player'
                        );
                        // 直接进入下一个阶段
                        nextPhase();
                    } else {
                        // 正常模式：没有解毒剂、守墓人技能或护身符，目标玩家出局
                        targetPlayer.status = 'eliminated';
                        addGameLog(
                            `${targetPlayer.name}没有解毒剂、守墓人技能或护身符，出局了`,
                            'player'
                        );

                        // 检查游戏是否结束
                        const gameOverResult = checkGameOver();
                        if (gameOverResult.isOver) {
                            // 游戏结束，更新游戏状态
                            if (gameState && gameOverReason) {
                                gameState.value = 'gameOver';
                                gameOverReason.value = gameOverResult.reason;
                            }
                        } else {
                            // 游戏未结束，抽一张惩罚牌
                            const randomIndex = Math.floor(Math.random() * punishmentCards.length);
                            currentPunishment.value = punishmentCards[randomIndex];
                            showPunishmentModal.value = true;
                            // 不调用nextPhase()，等待惩罚模态框关闭后再处理
                        }
                    }
                }
            } else {
                // 处理不同类型的食物牌效果
                switch (card.effect) {
                    case 'steal_points':
                        // 棒棒糖：获得其他玩家的3积分
                        const otherPlayers = players.value.filter(
                            (p) => p.id !== targetPlayer.id && p.status === 'active'
                        );
                        if (otherPlayers.length > 0) {
                            const randomTarget =
                                otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
                            const stealAmount = Math.min(3, randomTarget.score);
                            randomTarget.score -= stealAmount;
                            targetPlayer.score += stealAmount;
                            addGameLog(
                                `${targetPlayer.name}从${randomTarget.name}那里获得了${stealAmount}积分`,
                                'player'
                            );
                        }
                        break;

                    case 'double_next':
                        // 曲奇饼干：下一张食物牌的积分翻倍
                        targetPlayer.nextCardDouble = true;
                        addGameLog(`${targetPlayer.name}获得了下一张食物牌积分翻倍效果`, 'player');
                        break;

                    case 'view_card':
                        // 放大镜：立即查看场上一张食物牌
                        currentPrivacyPlayer.value = targetPlayer;
                        privacyMaskTitle.value = '放大镜效果';
                        privacyMaskMessage.value = `其他玩家请闭眼，${targetPlayer.name}正在使用放大镜查看一张食物牌`;
                        privacyOperationType.value = 'magnifier';
                        showPrivacyMask.value = true;
                        addGameLog(
                            `${targetPlayer.name}使用了放大镜，需要查看一张食物牌`,
                            'player'
                        );
                        // 不调用nextPhase()，等待玩家选择完卡片后再继续
                        return;
                        break;

                    case 'get_tool':
                        // 魔法草药：立即拿取一张道具牌
                        const drawnTool = drawToolCard();
                        if (drawnTool !== null) {
                            if (drawnTool.name === '解毒剂') {
                                // 解毒剂特殊处理：立即触发效果，从手牌中移除，获得免疫状态
                                addGameLog(
                                    `${targetPlayer.name}获得了一张道具牌：${drawnTool.name}，立即触发效果`,
                                    'player'
                                );
                                targetPlayer.hasImmunity++;
                                addGameLog(
                                    `${targetPlayer.name}获得了解毒剂，立即获得了免疫状态，解毒剂从手牌中移除`,
                                    'player'
                                );
                            } else {
                                // 普通道具处理：添加到手牌
                                targetPlayer.hand.push(drawnTool.name);
                                addGameLog(
                                    `${targetPlayer.name}获得了一张道具牌：${drawnTool.name}`,
                                    'player'
                                );
                            }
                        } else {
                            addGameLog(
                                `${targetPlayer.name}尝试获得道具牌，但道具牌堆已空`,
                                'player'
                            );
                        }
                        break;

                    case 'draw_again':
                        // 能量饮料：立即再翻一张食物牌
                        // 这里不需要额外处理，因为力量药剂只允许翻一张牌
                        addGameLog(
                            `${targetPlayer.name}获得了再翻一张食物牌的机会，但力量药剂只允许翻一张牌`,
                            'player'
                        );
                        break;

                    default:
                        // 普通食物牌：获取积分
                        let pointsToAdd = card.value;

                        // 检查是否有翻倍效果（弓箭手技能或曲奇饼干）
                        if (targetPlayer.nextCardDouble) {
                            pointsToAdd *= 2;
                            // 重置翻倍状态
                            targetPlayer.nextCardDouble = false;
                            addGameLog(
                                `${targetPlayer.name}的下一张食物牌积分翻倍，获得了${pointsToAdd}积分`,
                                'player'
                            );
                        } else {
                            addGameLog(`${targetPlayer.name}获得了${pointsToAdd}积分`, 'player');
                        }

                        targetPlayer.score += pointsToAdd;
                }

                // 进入下一个阶段
                nextPhase();
            }

            // 重置力量药剂相关状态
            strengthPotionUser.value = null;
            strengthPotionTarget.value = null;
        }
    };

    // 处理惩罚模态框关闭
    const handlePunishmentClose = () => {
        showPunishmentModal.value = false;
        // 惩罚结束后检查游戏是否结束
        const gameOverResult = checkGameOver();
        if (gameOverResult.isOver) {
            // 游戏结束，更新游戏状态
            if (gameState && gameOverReason) {
                gameState.value = 'gameOver';
                gameOverReason.value = gameOverResult.reason;
            }
        } else {
            // 游戏未结束，切换到下一个玩家
            nextPlayer();
        }
    };

    return {
        currentPunishment,
        showPunishmentModal,
        revealFoodCard,
        handleStrengthPotionCardSelect,
        handlePunishmentClose,
    };
}
