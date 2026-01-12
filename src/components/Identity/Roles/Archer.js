// 弓箭手身份牌

const Archer = {
    name: '弓箭手',
    description: '下一张食物牌的积分翻倍(一局游戏一次)',

    // 特殊能力 - 主动触发
    onActivate: (gameState, currentPlayer) => {
        // 实现下一张食物牌的积分翻倍(一局游戏一次)的逻辑

        // 检查弓箭手是否已经使用过这个能力
        if (currentPlayer.hasUsedActiveAbility) {
            return {
                success: false,
                message: `${currentPlayer.name}（弓箭手）已经使用过下一张食物牌积分翻倍的能力`,
            };
        }

        // 设置已经使用过这个能力的标志
        currentPlayer.hasUsedActiveAbility = true;

        // 设置下一张食物牌积分翻倍的标志
        currentPlayer.nextCardDouble = true;

        return {
            success: true,
            message: `${currentPlayer.name}（弓箭手）使用了下一张食物牌积分翻倍的能力`,
        };
    },
};

export default Archer;
