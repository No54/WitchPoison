// 少女身份牌

const Girl = {
  name: '少女',
  description: '可以跳过你的回合(一局游戏一次)',
  
  // 特殊能力 - 回合开始时触发
  onTurnStart: (gameState, currentPlayer) => {
    // 实现可以跳过你的回合(一局游戏一次)的逻辑
    
    // 检查是否已经使用过跳过回合的能力
    if (currentPlayer.hasUsedActiveAbility) {
      return {
        success: false,
        message: `${currentPlayer.name}（少女）已经使用过跳过回合的能力`
      }
    }
    
    // 设置使用过跳过回合的标志
    currentPlayer.hasUsedActiveAbility = true
    
    return {
      success: true,
      message: `${currentPlayer.name}（少女）使用了跳过回合的能力`,
      canSkipTurn: true
    }
  }
}

export default Girl