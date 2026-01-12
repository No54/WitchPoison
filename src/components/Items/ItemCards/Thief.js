// 妙手空空道具牌
import { stealScoreFromPlayer } from '../../../utils/scoreUtils.js';

const Thief = {
    name: '妙手空空',
    description: '获得一名其他玩家的3点积分',

    // 使用道具效果
    use: (gameStateManager, currentPlayer) => {
        // 从玩家手牌中移除该道具牌
        const cardIndex = currentPlayer.hand.indexOf('妙手空空');
        if (cardIndex > -1) {
            currentPlayer.hand.splice(cardIndex, 1);
        }

        // 从gameStateManager获取players，注意是响应式对象
        const { players } = gameStateManager;

        // 使用通用积分窃取函数，传入players.value（响应式对象的实际值）
        const result = stealScoreFromPlayer(players.value, currentPlayer, 3, 'item', '妙手空空');

        return result;
    },
};

export default Thief;
