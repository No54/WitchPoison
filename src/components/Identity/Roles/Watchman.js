// 守墓人身份牌

const Watchman = {
  name: '守墓人',
  description: '当你翻到"女巫的毒药"时，免出局一次，随后将它盖回去和其他食物牌重新洗混',
  
  // 特殊能力 - 翻到毒药时触发
  onPoisonRevealed: (gameState, currentPlayer, foodCards) => {
    // 实现翻到"女巫的毒药"时，免出局一次，随后将它盖回去和其他食物牌重新洗混的逻辑
    
    // 检查守墓人是否已经使用过免出局能力
    if (currentPlayer.hasUsedPoisonImmunity) {
      return {
        success: false,
        message: `${currentPlayer.name}（守墓人）已经使用过免出局能力`
      }
    }
    
    // 设置使用过免出局能力的标志
    currentPlayer.hasUsedPoisonImmunity = true
    
    // 逻辑：将毒药盖回去和其他食物牌重新洗混
    
    return {
      success: true,
      message: `${currentPlayer.name}（守墓人）翻到了"女巫的毒药"，免出局一次，并将它盖回去和其他食物牌重新洗混`,
      immuneToPoison: true,
      shuffleFoodCards: true
    }
  }
}

export default Watchman