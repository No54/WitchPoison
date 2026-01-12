// 护身符道具牌

const Amulet = {
  name: '护身符',
  description: '在你的下一个回合开始前，不会出局',
  
  // 使用道具效果
  use: (gameState, currentPlayer) => {
    // 从玩家手牌中移除该道具牌
    const cardIndex = currentPlayer.hand.indexOf('护身符')
    if (cardIndex > -1) {
      currentPlayer.hand.splice(cardIndex, 1)
    }
    
    // 设置玩家一轮免疫状态
    currentPlayer.hasRoundImmunity = true
    
    return {
      success: true,
      message: `${currentPlayer.name}使用了护身符，获得了一轮免疫状态，在你的下一个回合开始前，不会出局`
    }
  }
}

export default Amulet