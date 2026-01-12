// 窥视道具牌

const Peek = {
    name: '窥视',
    description: '查看3张食物牌',
    hasSpecialInteraction: true,

    // 使用道具效果
    use: (gameState, currentPlayer) => {
        // 从玩家手牌中移除该道具牌
        const cardIndex = currentPlayer.hand.indexOf('窥视');
        if (cardIndex > -1) {
            currentPlayer.hand.splice(cardIndex, 1);
        }

        // 设置玩家已使用窥视标志
        currentPlayer.hasUsedPeek = true;

        return {
            success: true,
            message: `${currentPlayer.name}使用了窥视，可以查看3张未翻开的食物牌`,
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
        } = data;

        // 显示隐私蒙版，让当前玩家查看3张食物牌
        currentPrivacyPlayer.value = currentPlayer;
        privacyMaskTitle.value = '窥视效果';
        privacyMaskMessage.value = `其他玩家请闭眼，${currentPlayer.name}正在使用窥视查看3张食物牌`;
        privacyOperationType.value = 'peek';
        showPrivacyMask.value = true;

        addGameLog(`${currentPlayer.name}使用了窥视，查看了3张食物牌`, 'player');

        // 返回特殊交互处理结果，指示需要等待用户交互
        return {
            needWait: true,
            message: `${currentPlayer.name}使用了窥视，进入查看阶段`,
        };
    },
};

export default Peek;
