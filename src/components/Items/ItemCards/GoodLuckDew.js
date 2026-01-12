// 强运甘露道具牌

const GoodLuckDew = {
    name: '强运甘露',
    description: '摸取道具牌堆顶2张牌，然后选择1张加入手牌，另一张放回堆底',
    hasSpecialInteraction: true,

    // 使用道具效果
    use: (gameState, currentPlayer) => {
        // 从玩家手牌中移除该道具牌
        const cardIndex = currentPlayer.hand.indexOf('强运甘露');
        if (cardIndex > -1) {
            currentPlayer.hand.splice(cardIndex, 1);
        }

        // 设置玩家已使用强运甘露标志
        currentPlayer.hasUsedGoodLuckDew = true;

        return {
            success: true,
            message: `${currentPlayer.name}使用了强运甘露，摸取道具牌堆顶2张牌，然后选择1张加入手牌，另一张放回堆底`,
        };
    },

    // 处理特殊交互
    handleSpecialInteraction: (currentPlayer, data) => {
        const {
            players,
            currentPlayerIndex,
            foodCards,
            addGameLog,
            nextPhase,
            currentPrivacyPlayer,
            privacyMaskTitle,
            privacyMaskMessage,
            privacyOperationType,
            showPrivacyMask,
            goodLuckDewOptions,
            goodLuckDewUser,
            drawToolCard,
        } = data;

        // 从道具牌堆中抽取两张道具牌
        const tool1 = drawToolCard();
        const tool2 = drawToolCard();

        // 保存选择选项和使用者（注意：这里不直接设置isGoodLuckDewSelectionPhase，而是等待隐私蒙版关闭后设置）
        goodLuckDewOptions.value = [tool1, tool2];
        goodLuckDewUser.value = currentPlayer;

        // 显示隐私蒙版，让当前玩家选择道具
        currentPrivacyPlayer.value = currentPlayer;
        privacyMaskTitle.value = '选择道具';
        privacyMaskMessage.value = `其他玩家请闭眼，${currentPlayer.name}正在选择道具牌`;
        privacyOperationType.value = 'good_luck_dew';
        showPrivacyMask.value = true;

        addGameLog(`${currentPlayer.name}使用了强运甘露，获得了选择道具的机会`, 'player');

        // 返回特殊交互处理结果，指示需要等待用户交互
        return {
            needWait: true,
            message: `${currentPlayer.name}使用了强运甘露，进入选择阶段`,
        };
    },
};

export default GoodLuckDew;
