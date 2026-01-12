// 食物牌数据
export const foodCardDefinitions = [
  {
    name: '女巫的毒药',
    description: '抽到即出局',
    count: 3,
    type: 'poison',
    value: 0
  },
  {
    name: '苹果',
    description: '获取1积分',
    count: 6,
    type: 'normal',
    value: 1
  },
  {
    name: '苹果派',
    description: '获取2积分',
    count: 3,
    type: 'normal',
    value: 2
  },
  {
    name: '甜甜圈',
    description: '获取3积分',
    count: 2,
    type: 'normal',
    value: 3
  },
  {
    name: '糖果',
    description: '获取5积分',
    count: 1,
    type: 'normal',
    value: 5
  },
  {
    name: '棒棒糖',
    description: '获得其他玩家的3积分',
    count: 2,
    type: 'special',
    value: 0,
    effect: 'steal_points'
  },
  {
    name: '曲奇饼干',
    description: '下一张食物牌的积分翻倍',
    count: 2,
    type: 'special',
    value: 0,
    effect: 'double_next'
  },
  {
    name: '放大镜',
    description: '立即查看场上一张食物牌',
    count: 2,
    type: 'special',
    value: 0,
    effect: 'view_card'
  },
  {
    name: '魔法草药',
    description: '立即拿取一张道具牌',
    count: 2,
    type: 'special',
    value: 0,
    effect: 'get_tool'
  },
  {
    name: '能量饮料',
    description: '立即再翻一张食物牌',
    count: 2,
    type: 'special',
    value: 0,
    effect: 'draw_again'
  }
]

// 生成完整的食物牌数组
export const generateFoodCards = () => {
  let cards = []
  let id = 1
  
  foodCardDefinitions.forEach(def => {
    for (let i = 0; i < def.count; i++) {
      cards.push({
        id: id++,
        name: def.name,
        description: def.description,
        type: def.type,
        value: def.value,
        effect: def.effect,
        isPoison: def.type === 'poison',
        isRevealed: false
      })
    }
  })
  
  return cards
}
