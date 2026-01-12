// 点石成金道具牌

const MidasTouch = {
  name: '点石成金',
  description: '立即获取7点积分',
  
  // 使用道具效果
  use: (gameState, currentPlayer) => {
    // 从玩家手牌中移除该道具牌
    const cardIndex = currentPlayer.hand.indexOf('点石成金')
    if (cardIndex > -1) {
      currentPlayer.hand.splice(cardIndex, 1)
    }
    
    // 立即获取7点积分
    currentPlayer.score += 7
    
    return {
      success: true,
      message: `${currentPlayer.name}使用了点石成金，立即获取7点积分`
    }
  }
}

export default MidasTouch