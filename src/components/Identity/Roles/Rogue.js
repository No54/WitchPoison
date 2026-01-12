// 老流氓身份牌
import { stealScoreFromPlayer } from '../../../utils/scoreUtils.js';

const Rogue = {
  name: '老流氓',
  description: '你可以获得一名其他玩家的3点积分(一局游戏一次)',
  
  // 特殊能力 - 主动触发
  onActivate: (gameState, currentPlayer, players) => {
    // 实现可以获得一名其他玩家的3点积分(一局游戏一次)的逻辑
    
    // 检查老流氓是否已经使用过这个能力
    if (currentPlayer.hasUsedActiveAbility) {
      return {
        success: false,
        message: `${currentPlayer.name}（老流氓）已经使用过获得其他玩家积分的能力`
      }
    }
    
    // 使用通用积分窃取函数
    const result = stealScoreFromPlayer(players, currentPlayer, 3, 'role', '老流氓');
    
    // 如果窃取成功，设置已经使用过这个能力的标志
    if (result.success) {
      currentPlayer.hasUsedActiveAbility = true;
    }
    
    return result;
  }
}

export default Rogue