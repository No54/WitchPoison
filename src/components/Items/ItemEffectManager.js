import { ref } from 'vue';
import { toolCards } from './toolCards.js';
import { createItemSkillManager } from './itemSkillManager.js';
import { itemSkills } from './itemSkillManager.js';

export function useItemEffects(
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
) {
    // 创建道具技能管理器实例
    const itemSkillManager = createItemSkillManager();

    // 使用道具牌
    const useTool = (data) => {
        const { toolName, index } = data;
        const currentPlayer = players.value[currentPlayerIndex.value];

        // 获取道具技能实现
        const itemSkill = itemSkills[toolName];

        // 如果道具存在且需要特殊交互
        if (itemSkill && itemSkill.hasSpecialInteraction) {
            // 从玩家手牌中移除该道具牌
            currentPlayer.hand.splice(index, 1);

            // 调用道具类的特殊交互处理方法
            const specialInteractionData = {
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
            };

            const result = itemSkill.handleSpecialInteraction(
                currentPlayer,
                specialInteractionData
            );

            // 如果需要等待用户交互，直接返回，不触发魔术师技能
            if (result.needWait) {
                return;
            }

            // 如果道具效果已经完成，且玩家是魔术师，触发魔术师技能
            if (currentPlayer.identity === '魔术师') {
                // 实现魔术师技能：使用道具牌时，查看桌上一张食物牌
                // 找出所有未翻开的食物牌
                const unrevealedCards = foodCards.value.filter((card) => !card.isRevealed);
                if (unrevealedCards.length > 0) {
                    // 显示隐私蒙版，让当前玩家查看一张食物牌
                    currentPrivacyPlayer.value = currentPlayer;
                    privacyMaskTitle.value = '魔术师技能效果';
                    privacyMaskMessage.value = `其他玩家请闭眼，${currentPlayer.name}正在使用魔术师技能查看一张食物牌`;
                    privacyOperationType.value = 'magnifier';
                    showPrivacyMask.value = true;

                    addGameLog(
                        `${currentPlayer.name}（魔术师）使用道具牌时，查看了一张食物牌`,
                        'player'
                    );

                    return;
                }
            }
        } else {
            // 处理不需要特殊交互的道具，使用道具技能管理器
            // 创建游戏状态管理器对象，传递给道具技能
            const gameStateManager = {
                players,
                foodCards,
                addGameLog,
                shuffleArray,
            };

            // 执行道具技能，技能内部会处理道具牌的移除
            const result = itemSkillManager.executeItemSkill(
                gameStateManager,
                currentPlayer.id,
                toolName
            );

            // 处理技能执行结果
            if (result.success) {
                // 技能执行成功，添加日志
                addGameLog(result.message, 'player');
            } else {
                // 技能执行失败，添加日志
                addGameLog(result.message, 'system');
            }

            // 检查玩家是否是魔术师，如果是，触发魔术师技能
            if (currentPlayer.identity === '魔术师') {
                // 实现魔术师技能：使用道具牌时，查看桌上一张食物牌
                // 找出所有未翻开的食物牌
                const unrevealedCards = foodCards.value.filter((card) => !card.isRevealed);
                if (unrevealedCards.length > 0) {
                    // 显示隐私蒙版，让当前玩家查看一张食物牌
                    currentPrivacyPlayer.value = currentPlayer;
                    privacyMaskTitle.value = '魔术师技能效果';
                    privacyMaskMessage.value = `其他玩家请闭眼，${currentPlayer.name}正在使用魔术师技能查看一张食物牌`;
                    privacyOperationType.value = 'magnifier';
                    showPrivacyMask.value = true;

                    addGameLog(
                        `${currentPlayer.name}（魔术师）使用道具牌时，查看了一张食物牌`,
                        'player'
                    );

                    return;
                }
            }
        }

        // 进入下一个阶段
        nextPhase();
    };

    // 处理使用道具牌事件
    const handleUseToolCard = (data) => {
        const { card, index } = data;
        const currentPlayer = players.value[currentPlayerIndex.value];
        let viewCount = 0;
        let effectType = '';

        // 计算查看牌数
        // 处理魔术师技能：使用道具时可以查看桌上一张食物牌
        if (currentPlayer.identity === '魔术师') {
            viewCount += 1;
        }

        // 处理道具效果
        if (card === '窥视') {
            viewCount += 3;
            effectType = 'peek';
        } else {
            // 其他道具使用普通处理
            useTool({ toolName: card, index });
            return;
        }

        // 显示隐私蒙版，让当前玩家选择食物牌查看
        currentPrivacyPlayer.value = currentPlayer;

        // 设置标题和消息
        if (currentPlayer.identity === '魔术师') {
            privacyMaskTitle.value = '魔术师+窥视效果';
            privacyMaskMessage.value = `其他玩家请闭眼，${currentPlayer.name}正在使用魔术师技能+窥视查看${viewCount}张食物牌`;
        } else {
            privacyMaskTitle.value = '窥视效果';
            privacyMaskMessage.value = `其他玩家请闭眼，${currentPlayer.name}正在使用窥视查看${viewCount}张食物牌`;
        }

        privacyOperationType.value = effectType;
        showPrivacyMask.value = true;

        // 添加游戏日志
        if (currentPlayer.identity === '魔术师') {
            addGameLog(
                `${currentPlayer.name}使用了${card}，触发了魔术师技能+${card}效果，需要查看${viewCount}张食物牌`,
                'player'
            );
        } else {
            addGameLog(
                `${currentPlayer.name}使用了${card}，需要查看${viewCount}张食物牌`,
                'player'
            );
        }

        // 从玩家手牌中移除该道具牌（仅窥视）
        if (card === '窥视') {
            currentPlayer.hand.splice(index, 1);
        }

        // 不调用nextPhase()，等待玩家查看完卡片后再继续
        return;
    };

    // 使用道具牌
    const useToolCard = (card) => {
        const currentPlayer = players.value[currentPlayerIndex.value];
        // 找到道具在手牌中的索引
        const cardIndex = currentPlayer.hand.indexOf(card);
        if (cardIndex !== -1) {
            // 移除道具牌
            currentPlayer.hand.splice(cardIndex, 1);
            // 添加道具使用日志
            addGameLog(`${currentPlayer.name}使用了道具：${card}`, 'player');
            // 这里可以添加道具牌的具体效果逻辑
            if (card === '护身符') {
                currentPlayer.hasUsedAmulet = true;
                addGameLog(
                    `${currentPlayer.name}获得了护身符保护，下一个回合开始前不会出局`,
                    'player'
                );
            } else {
                addGameLog('使用道具:', card, 'player');
            }
            // 使用完道具后，直接进入下一个阶段
            nextPhase();
        }
    };

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
                const tool1 = drawToolCard();
                const tool2 = drawToolCard();

                // 显示隐私蒙版，让当前玩家选择道具
                currentPrivacyPlayer.value = currentPlayer;
                privacyMaskTitle.value = '选择道具';
                privacyMaskMessage.value = `其他玩家请闭眼，${currentPlayer.name}正在选择道具牌`;
                privacyOperationType.value = 'good_luck_dew'; // 使用与强运甘露相同的操作类型
                // 保存选择选项和使用者
                goodLuckDewOptions.value = [tool1, tool2];
                goodLuckDewUser.value = currentPlayer;
                isGoodLuckDewSelectionPhase.value = true;
                showPrivacyMask.value = true;
                addGameLog(`长老抽二保留一，获得了选择道具的机会`, 'player');
                // 不调用nextPhase()，等待玩家选择道具
                return;
            } else {
                // 从道具牌堆中抽取一张道具牌
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
                    addGameLog(`${currentPlayer.name}想购买道具，但道具牌堆已空`, 'player');
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

    // 处理强运甘露道具选择
    const handleGoodLuckDewSelect = (toolIndex) => {
        if (
            isGoodLuckDewSelectionPhase.value &&
            goodLuckDewOptions.value.length > 0 &&
            goodLuckDewUser.value
        ) {
            // 获取选中的道具和未选中的道具
            const selectedTool = goodLuckDewOptions.value[toolIndex];
            const unselectedTool = goodLuckDewOptions.value[toolIndex === 0 ? 1 : 0];

            if (selectedTool.name === '解毒剂') {
                // 解毒剂特殊处理：立即触发效果，从手牌中移除，获得免疫状态
                addGameLog(
                    `${goodLuckDewUser.value.name}获得了道具：${selectedTool.name}，立即触发效果`,
                    'player'
                );
                goodLuckDewUser.value.hasImmunity++;
                addGameLog(
                    `${goodLuckDewUser.value.name}获得了解毒剂，立即获得了免疫状态，解毒剂从手牌中移除`,
                    'player'
                );
            } else {
                // 普通道具处理：添加到手牌
                goodLuckDewUser.value.hand.push(selectedTool.name);
                addGameLog(
                    `${goodLuckDewUser.value.name}获得了道具：${selectedTool.name}`,
                    'player'
                );
            }

            // 将未选中的道具放回道具牌堆底
            if (unselectedTool) {
                toolCardDeck.value.push(unselectedTool);
                addGameLog(
                    `${goodLuckDewUser.value.name}将${unselectedTool.name}放回了道具牌堆底`,
                    'player'
                );
            }

            // 结束选择阶段
            isGoodLuckDewSelectionPhase.value = false;
            goodLuckDewOptions.value = [];
            goodLuckDewUser.value = null;
            nextPhase();
        }
    };

    // 处理力量药剂目标玩家选择
    const handleStrengthPotionTargetSelect = (playerId) => {
        if (isStrengthPotionTargetSelection.value) {
            const targetPlayer = players.value.find((p) => p.id === playerId);
            if (targetPlayer && targetPlayer.id !== strengthPotionUser.value.id) {
                // 选择目标玩家成功
                strengthPotionTarget.value = targetPlayer;
                isStrengthPotionTargetSelection.value = false;

                // 显示力量药剂模态窗口，让玩家选择要翻开的食物牌
                showStrengthPotionModal.value = true;
                strengthPotionModalTitle.value = '力量药剂效果';
                strengthPotionModalMessage.value = `${strengthPotionUser.value.name}正在为${targetPlayer.name}选择一张要翻开的食物牌`;

                addGameLog(
                    `${strengthPotionUser.value.name}选择了${targetPlayer.name}作为力量药剂的目标`,
                    'player'
                );
            }
        }
    };

    // 处理力量药剂翻牌选择
    const handleStrengthPotionCardSelect = (card) => {
        if (isStrengthPotionCardSelection.value && strengthPotionTarget.value) {
            // 结束选择阶段
            isStrengthPotionCardSelection.value = false;

            // 处理翻牌效果，由目标玩家承担
            const targetPlayer = strengthPotionTarget.value;
            const userPlayer = strengthPotionUser.value;

            addGameLog(`${userPlayer.name}为${targetPlayer.name}翻开了一张食物牌`, 'player');

            // 揭示选中的卡片
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

            // 重置力量药剂状态
            strengthPotionUser.value = null;
            strengthPotionTarget.value = null;

            // 进入下一个阶段
            nextPhase();
        }
    };

    return {
        useTool,
        handleUseToolCard,
        useToolCard,
        buyToolCard,
        handleGoodLuckDewSelect,
        handleStrengthPotionTargetSelect,
        handleStrengthPotionCardSelect,
    };
}
