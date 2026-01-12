// 长老身份牌

const Elder = {
  name: '长老',
  description: '购买道具时，抽2保留1',
  
  // 特殊能力 - 购买道具时触发
  onBuyTool: (gameState, currentPlayer, toolCards) => {
    // 实现购买道具时，抽2保留1的逻辑
    
    // 这里简化处理，随机选择一张道具牌
    // 实际游戏中可以添加选择界面
    const randomTool1 = toolCards[Math.floor(Math.random() * toolCards.length)]
    const randomTool2 = toolCards[Math.floor(Math.random() * toolCards.length)]
    
    // 简化处理，随机选择一张保留
    const selectedTool = Math.random() > 0.5 ? randomTool1 : randomTool2
    
    return {
      success: true,
      message: `${currentPlayer.name}（长老）购买道具时，抽到了${randomTool1.name} 和 ${randomTool2.name}，选择了${selectedTool.name}`
    }
  }
}

export default Elder