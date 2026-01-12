// 小女孩身份牌

const LittleGirl = {
  name: '小女孩',
  description: '你购买道具时只需花费4积分而不是5积分',
  
  // 特殊能力 - 购买道具前触发
  onBuyToolBefore: (gameState, currentPlayer) => {
    // 实现购买道具时只需花费4积分而不是5积分的逻辑
    
    const originalCost = 5
    const adjustedCost = 4
    
    return {
      success: true,
      message: `${currentPlayer.name}（小女孩）购买道具时，积分消耗从${originalCost}调整为${adjustedCost}`,
      adjustedCost: adjustedCost
    }
  }
}

export default LittleGirl