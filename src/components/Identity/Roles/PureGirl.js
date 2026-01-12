// 纯白之女身份牌

const PureGirl = {
  name: '纯白之女',
  description: '可以将所有食物牌重新洗牌(一局游戏一次)',
  
  // 特殊能力 - 主动触发
  onActivate: (gameState, currentPlayer, foodCards) => {
    // 实现可以将所有食物牌重新洗牌(一局游戏一次)的逻辑
    
    // 检查纯白之女是否已经使用过这个能力
    if (currentPlayer.hasUsedActiveAbility) {
      return {
        success: false,
        message: `${currentPlayer.name}（纯白之女）已经使用过重新洗牌的能力`
      }
    }
    
    if (foodCards.length === 0) {
      return {
        success: false,
        message: `${currentPlayer.name}（纯白之女）没有食物牌可以重新洗牌`
      }
    }
    
    // 设置已经使用过这个能力的标志
    currentPlayer.hasUsedActiveAbility = true
    
    // 逻辑：将所有食物牌重新洗牌
    
    return {
      success: true,
      message: `${currentPlayer.name}（纯白之女）将所有食物牌重新洗牌`,
      shuffleFoodCards: true
    }
  }
}

export default PureGirl