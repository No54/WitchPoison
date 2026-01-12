// 解毒剂道具牌

const Antidote = {
    name: '解毒剂',
    description: '当你翻到"女巫的毒药"时，免出局一次，随后将它盖回去和其他食物牌重新洗混',

    // 使用道具效果
    use: (gameState, currentPlayer) => {
        // 从玩家手牌中移除该道具牌
        const cardIndex = currentPlayer.hand.indexOf('解毒剂');
        if (cardIndex > -1) {
            currentPlayer.hand.splice(cardIndex, 1);
        }

        // 设置玩家已使用解毒剂标志
        currentPlayer.hasUsedAntidote = true;
        // 给玩家添加免疫状态
        currentPlayer.hasImmunity++;

        return {
            success: true,
            message: `${currentPlayer.name}使用了解毒剂，获得了免疫状态，可以抵消一次毒药效果`,
        };
    },
};

export default Antidote;
