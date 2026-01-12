// 学者身份牌

const Scholar = {
  name: '学者',
  description: '游戏开始时，获得5点积分，而不是3点',
  
  // 特殊能力 - 游戏开始时触发
  onGameStart: (gameState, currentPlayer) => {
    // 实现游戏开始时，获得5点积分的逻辑
    currentPlayer.score = 5
    
    return {
      success: true,
      message: `${currentPlayer.name}（学者）游戏开始时，获得5点积分，而不是3点`
    }
  }
}

export default Scholar