// 女仆身份牌

const Maid = {
  name: '女仆',
  description: '游戏开始时，获得一张道具牌',
  
  // 特殊能力 - 游戏开始时触发
  onGameStart: (gameState, currentPlayer, toolCards) => {
    // 实现游戏开始时，获得一张道具牌的逻辑
    
    if (toolCards.length === 0) {
      return {
        success: false,
        message: `${currentPlayer.name}（女仆）没有道具牌可以获得`
      }
    }
    
    // 随机选择一张道具牌
    const randomTool = toolCards[Math.floor(Math.random() * toolCards.length)]
    
    // 将道具牌添加到玩家手牌
    currentPlayer.hand.push(randomTool.name)
    
    return {
      success: true,
      message: `${currentPlayer.name}（女仆）游戏开始时，获得了一张${randomTool.name}道具牌`
    }
  }
}

export default Maid