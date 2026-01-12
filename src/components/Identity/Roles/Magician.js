// 魔术师身份牌

const Magician = {
  name: '魔术师',
  description: '使用道具牌时，你可以查看桌上一张食物牌',
  
  // 特殊能力 - 使用道具牌时触发
  onUseToolCard: (gameState, currentPlayer, foodCards) => {
    // 实现使用道具牌时，可以查看桌上一张食物牌的逻辑
    
    if (foodCards.length === 0) {
      return {
        success: false,
        message: `${currentPlayer.name}（魔术师）没有食物牌可以查看`
      }
    }
    
    // 随机选择一张食物牌查看
    const randomIndex = Math.floor(Math.random() * foodCards.length)
    const selectedCard = foodCards[randomIndex]
    
    return {
      success: true,
      message: `${currentPlayer.name}（魔术师）查看了位置${randomIndex + 1}的食物牌`,
      viewedCardIndex: randomIndex
    }
  }
}

export default Magician