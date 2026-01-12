// 移形换影道具牌

const ShapeShift = {
  name: '移形换影',
  description: '选择2张食物牌偷偷交换位置',
  hasSpecialInteraction: true,
  
  // 使用道具效果
  use: (gameState, currentPlayer) => {
    // 从玩家手牌中移除该道具牌
    const cardIndex = currentPlayer.hand.indexOf('移形换影')
    if (cardIndex > -1) {
      currentPlayer.hand.splice(cardIndex, 1)
    }
    
    // 设置玩家已使用移形换影标志
    currentPlayer.hasUsedShapeShift = true
    
    return {
      success: true,
      message: `${currentPlayer.name}使用了移形换影，可以交换两张桌面上的食物牌位置`
    }
  },
  
  // 处理特殊交互
  handleSpecialInteraction: (currentPlayer, data) => {
    const { 
      players, 
      currentPlayerIndex, 
      foodCards, 
      addGameLog, 
      nextPhase, 
      currentPrivacyPlayer, 
      privacyMaskTitle, 
      privacyMaskMessage, 
      privacyOperationType, 
      showPrivacyMask 
    } = data;
    
    // 显示隐私蒙版，让当前玩家选择两张食物牌交换位置
    currentPrivacyPlayer.value = currentPlayer;
    privacyMaskTitle.value = '移形换影效果';
    privacyMaskMessage.value = `其他玩家请闭眼，${currentPlayer.name}正在使用移形换影选择两张食物牌交换位置`;
    privacyOperationType.value = 'swap_cards';
    showPrivacyMask.value = true;
    
    addGameLog(`${currentPlayer.name}使用了移形换影，需要选择两张食物牌交换位置`, 'player');
    
    // 返回特殊交互处理结果，指示需要等待用户交互
    return {
      needWait: true,
      message: `${currentPlayer.name}使用了移形换影，进入选择阶段`
    };
  }
}

export default ShapeShift