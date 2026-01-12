// 力量药剂道具牌

const StrengthPotion = {
    name: '力量药剂',
    description: '选择一名其他玩家，你来帮他翻开一张食物牌，效果由他承担',
    hasSpecialInteraction: true,

    // 使用道具效果
    use: (gameState, currentPlayer, targetPlayer) => {
        // 从玩家手牌中移除该道具牌
        const cardIndex = currentPlayer.hand.indexOf('力量药剂');
        if (cardIndex > -1) {
            currentPlayer.hand.splice(cardIndex, 1);
        }

        // 力量药剂的目标选择由上层组件处理，这里只返回成功消息
        return {
            success: true,
            message: `${currentPlayer.name}使用了力量药剂，准备选择目标玩家`,
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
            isStrengthPotionTargetSelection,
            strengthPotionUser,
        } = data;

        // 进入选择目标玩家阶段
        isStrengthPotionTargetSelection.value = true;
        strengthPotionUser.value = currentPlayer;

        addGameLog(`${currentPlayer.name}使用了力量药剂，需要选择一名目标玩家`, 'player');

        // 返回特殊交互处理结果，指示需要等待用户交互
        return {
            needWait: true,
            message: `${currentPlayer.name}使用了力量药剂，进入目标选择阶段`,
        };
    },
};

export default StrengthPotion;
