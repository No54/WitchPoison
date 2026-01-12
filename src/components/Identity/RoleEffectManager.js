import { ref } from 'vue';
import { createRoleSkillManager } from './roleSkillManager.js';
import { toolCards } from '../Items/toolCards.js';

export function useRoleEffects(
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
) {
    // 创建角色技能管理器实例
    const roleSkillManager = createRoleSkillManager();

    // 处理使用角色主动技能事件
    const handleUseAbility = (data) => {
        const { ability, playerId } = data;

        // 创建游戏状态管理器对象，传递给角色技能
        const gameStateManager = {
            players,
            foodCards,
            addGameLog,
            shuffleArray,
        };

        // 执行角色技能
        const result = roleSkillManager.executeRoleSkill(gameStateManager, playerId, ability);

        // 处理技能执行结果
        if (result.success) {
            // 技能执行成功，添加日志
            addGameLog(result.message, 'player');

            // 根据技能类型执行后续操作
            if (ability === 'skipTurn') {
                // 少女：跳过回合，进入下一个玩家
                nextPlayer();
            } else if (result.shuffleFoodCards || ability === 'reshuffle') {
                // 纯白之女：重新洗牌，只洗牌没有翻开的牌
                const currentPlayer = players.value.find((p) => p.id === playerId);

                // 执行洗牌操作
                if (currentPlayer) {
                    // 触发动画
                    isShuffling.value = true;

                    // 重新洗牌场上未翻开的所有牌，保留已翻开牌的位置
                    const allFoodCards = [...foodCards.value];

                    // 找出所有未翻开的牌
                    const unrevealedCards = allFoodCards.filter((card) => !card.isRevealed);

                    // 对未翻开的牌进行洗牌
                    shuffleArray(unrevealedCards);

                    // 将洗牌后的未翻开牌放回原位
                    let unrevealedIndex = 0;
                    for (let i = 0; i < allFoodCards.length; i++) {
                        if (!allFoodCards[i].isRevealed) {
                            allFoodCards[i] = unrevealedCards[unrevealedIndex];
                            unrevealedIndex++;
                        }
                    }

                    foodCards.value = allFoodCards;

                    // 动画结束后重置状态
                    setTimeout(() => {
                        isShuffling.value = false;
                        // 继续游戏流程
                        nextPhase();
                    }, 1000);
                }
            } else {
                // 其他技能（弓箭手、老流氓等）：技能使用后自动进入下一阶段
                nextPhase();
            }
        } else {
            // 技能执行失败，添加日志
            addGameLog(result.message, 'system');
        }
    };

    // 通用方法：显示食物牌并在指定时间后翻回
    const showFoodCardsTemporarily = (cardsToShow, duration = 3000) => {
        // 翻开卡片
        cardsToShow.forEach((card) => {
            card.isRevealed = true;
        });

        // 倒计时结束后将卡片翻回
        setTimeout(() => {
            cardsToShow.forEach((card) => {
                card.isRevealed = false;
            });
            // 继续游戏流程
            nextPhase();
        }, duration);
    };

    // 开始倒计时（通用方法）
    const startCountdown = (duration = 3, onComplete) => {
        magnifierCountdown.value = duration;
        // 清除可能存在的旧定时器
        if (magnifierCountdownInterval.value) {
            clearInterval(magnifierCountdownInterval.value);
        }
        // 创建新定时器
        magnifierCountdownInterval.value = setInterval(() => {
            magnifierCountdown.value--;
            if (magnifierCountdown.value <= 0) {
                // 清除定时器
                clearInterval(magnifierCountdownInterval.value);
                magnifierCountdownInterval.value = null;
                // 执行回调函数
                if (onComplete) {
                    onComplete();
                }
            }
        }, 1000);
    };

    // 处理隐私蒙版关闭
    const handlePrivacyMaskClose = () => {
        showPrivacyMask.value = false;

        // 保存当前隐私玩家，用于后续检查是否需要触发魔术师技能
        const privacyPlayer = currentPrivacyPlayer.value;

        switch (privacyOperationType.value) {
            case 'magnifier':
                // 放大镜：立即查看场上一张食物牌
                if (privacyPlayer) {
                    // 确保不是选择阶段，避免事件冲突
                    isMagnifierSelectionPhase.value = false;

                    // 使用食物查看模态窗口显示所有卡片，允许查看1张
                    foodViewModalTitle.value = '放大镜效果';
                    foodViewModalMessage.value = `${privacyPlayer.name}正在使用放大镜查看1张食物牌`;
                    foodViewModalMaxViewCount.value = 1;
                    showFoodViewModal.value = true;

                    // 关闭隐私蒙版
                    showPrivacyMask.value = false;
                    addGameLog(`${privacyPlayer.name}使用了放大镜，可查看1张食物牌`, 'player');
                }
                break;

            case 'reshuffle':
                // 执行洗牌操作
                if (privacyPlayer && !privacyPlayer.hasReshuffled) {
                    privacyPlayer.hasReshuffled = true;
                    // 重新洗牌场上未翻开的所有牌，保留已翻开牌的位置
                    const allFoodCards = [...foodCards.value];

                    // 找出所有未翻开的牌
                    const unrevealedCards = allFoodCards.filter((card) => !card.isRevealed);

                    // 对未翻开的牌进行洗牌
                    shuffleArray(unrevealedCards);

                    // 将洗牌后的未翻开牌放回原位
                    let unrevealedIndex = 0;
                    for (let i = 0; i < allFoodCards.length; i++) {
                        if (!allFoodCards[i].isRevealed) {
                            allFoodCards[i] = unrevealedCards[unrevealedIndex];
                            unrevealedIndex++;
                        }
                    }

                    foodCards.value = allFoodCards;
                    addGameLog(
                        `${privacyPlayer.name}（纯白之女）重新洗了场上未翻开的食物牌`,
                        'player'
                    );
                    // 纯白之女技能不应该跳过回合，所以不调用nextPhase()
                }
                break;

            case 'swap_cards':
                // 显示移形换影模态窗口
                if (privacyPlayer) {
                    // 使用移形换影模态窗口显示所有卡片，允许选择2张进行交换
                    shapeShiftModalTitle.value = '移形换影效果';
                    shapeShiftModalMessage.value = `${privacyPlayer.name}正在使用移形换影选择两张食物牌交换位置`;
                    showShapeShiftModal.value = true;

                    // 关闭隐私蒙版
                    showPrivacyMask.value = false;
                    addGameLog(
                        `${privacyPlayer.name}使用了移形换影，可选择两张食物牌交换位置`,
                        'player'
                    );
                }
                break;

            case 'peek':
                // 窥视：查看食物牌，考虑魔术师技能加成
                if (privacyPlayer) {
                    // 计算查看牌数
                    let viewCount = 3;

                    // 处理魔术师技能：使用道具时可以查看桌上一张食物牌
                    if (privacyPlayer.identity === '魔术师') {
                        viewCount += 1;
                    }

                    // 找出所有未翻开的食物牌
                    const unrevealedCards = foodCards.value.filter((card) => !card.isRevealed);
                    if (unrevealedCards.length >= viewCount) {
                        // 使用食物查看模态窗口显示所有卡片，允许查看相应数量的卡片
                        if (privacyPlayer.identity === '魔术师') {
                            foodViewModalTitle.value = '魔术师+窥视效果';
                            foodViewModalMessage.value = `${privacyPlayer.name}正在使用魔术师技能+窥视查看${viewCount}张食物牌`;
                        } else {
                            foodViewModalTitle.value = '窥视效果';
                            foodViewModalMessage.value = `${privacyPlayer.name}正在使用窥视，可查看${viewCount}张食物牌`;
                        }
                        foodViewModalMaxViewCount.value = viewCount;
                        showFoodViewModal.value = true;

                        // 关闭隐私蒙版
                        showPrivacyMask.value = false;
                        addGameLog(
                            `${privacyPlayer.name}使用了窥视，可查看${viewCount}张食物牌`,
                            'player'
                        );
                    } else {
                        addGameLog(
                            `${privacyPlayer.name}使用了窥视，但场上未翻开的食物牌不足${viewCount}张`,
                            'player'
                        );
                        // 关闭隐私蒙版
                        showPrivacyMask.value = false;
                        // 继续游戏流程
                        nextPhase();
                    }
                }
                break;

            case 'good_luck_dew':
            case 'elder_choice':
                // 强运甘露或长老技能：进入道具选择阶段
                // 注意：道具牌已经在之前抽取好了，这里只需要进入选择阶段
                isGoodLuckDewSelectionPhase.value = true;
                break;

            default:
                addGameLog('未知的隐私操作类型:', privacyOperationType.value, 'system');
        }

        // 检查是否需要触发魔术师技能：如果当前隐私玩家是魔术师，并且操作类型不是已经处理过的窥视或放大镜
        if (
            privacyPlayer &&
            privacyPlayer.identity === '魔术师' &&
            privacyOperationType.value !== 'peek' &&
            privacyOperationType.value !== 'magnifier'
        ) {
            // 实现魔术师技能：使用道具牌时，查看桌上一张食物牌
            // 找出所有未翻开的食物牌
            const unrevealedCards = foodCards.value.filter((card) => !card.isRevealed);
            if (unrevealedCards.length > 0) {
                // 显示隐私蒙版，让当前玩家查看一张食物牌
                currentPrivacyPlayer.value = privacyPlayer;
                privacyMaskTitle.value = '魔术师技能效果';
                privacyMaskMessage.value = `其他玩家请闭眼，${privacyPlayer.name}正在使用魔术师技能查看一张食物牌`;
                privacyOperationType.value = 'magnifier';
                showPrivacyMask.value = true;

                addGameLog(
                    `${privacyPlayer.name}（魔术师）使用道具牌时，查看了一张食物牌`,
                    'player'
                );
            }
        }
    };

    // 处理放大镜卡片选择 - 已迁移到统一的食物查看模态窗口
    const handleMagnifierCardSelect = (card) => {
        // 此函数已不再使用，放大镜效果现在直接通过FoodViewModal显示
    };

    // 处理移形换影卡片选择
    const handleSwapCardSelect = (card) => {
        if (isSwapSelectionPhase.value && !card.isRevealed) {
            // 如果还没有选择两张卡片
            if (selectedSwapCards.value.length < 2) {
                // 揭示选中的卡片
                card.isRevealed = true;
                selectedSwapCards.value.push(card);

                // 如果已经选择了两张卡片，执行交换操作
                if (selectedSwapCards.value.length === 2) {
                    // 结束选择阶段
                    isSwapSelectionPhase.value = false;

                    // 保存两张卡片的索引
                    const index1 = foodCards.value.indexOf(selectedSwapCards.value[0]);
                    const index2 = foodCards.value.indexOf(selectedSwapCards.value[1]);

                    if (index1 !== -1 && index2 !== -1) {
                        // 交换两张卡片
                        const temp = foodCards.value[index1];
                        foodCards.value[index1] = foodCards.value[index2];
                        foodCards.value[index2] = temp;

                        // 将两张卡片翻回去
                        selectedSwapCards.value.forEach((swapCard) => {
                            swapCard.isRevealed = false;
                        });

                        addGameLog(
                            `${currentPrivacyPlayer.value.name}使用移形换影交换了两张食物牌`,
                            'player'
                        );

                        // 清空选中的卡片
                        selectedSwapCards.value = [];

                        // 继续游戏流程
                        nextPhase();
                    }
                }
            }
        }
    };

    return {
        handleUseAbility,
        handlePrivacyMaskClose,
        handleMagnifierCardSelect,
        handleSwapCardSelect,
        startCountdown,
    };
}
