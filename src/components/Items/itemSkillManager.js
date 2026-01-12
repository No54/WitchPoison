// 道具技能管理模块

// 导入所有道具技能实现
import Amulet from './ItemCards/Amulet.js'
import Antidote from './ItemCards/Antidote.js'
import GoodLuckDew from './ItemCards/GoodLuckDew.js'
import MidasTouch from './ItemCards/MidasTouch.js'
import Peek from './ItemCards/Peek.js'
import ShapeShift from './ItemCards/ShapeShift.js'
import StrengthPotion from './ItemCards/StrengthPotion.js'
import Thief from './ItemCards/Thief.js'

// 道具技能映射
export const itemSkills = {
  '护身符': Amulet,
  '解毒剂': Antidote,
  '强运甘露': GoodLuckDew,
  '点石成金': MidasTouch,
  '窥视': Peek,
  '移形换影': ShapeShift,
  '力量药剂': StrengthPotion,
  '妙手空空': Thief
}

// 创建道具技能管理器
export const createItemSkillManager = () => {
  // 执行道具技能
  const executeItemSkill = (gameStateManager, playerId, itemName) => {
    const { players, addGameLog, foodCards } = gameStateManager
    const currentPlayer = players.value.find(p => p.id === playerId)

    if (!currentPlayer) return { success: false, message: `找不到玩家：${playerId}` }

    // 获取道具技能实现
    const itemSkill = itemSkills[itemName]
    if (!itemSkill) return { success: false, message: `未知道具：${itemName}` }

    // 执行道具技能，不检查道具是否在手牌中，因为调用方已经处理了道具的移除
    const result = itemSkill.use ? itemSkill.use(gameStateManager, currentPlayer) : { success: false, message: `道具${itemName}没有使用效果` }

    if (result.success) {
      addGameLog(`${currentPlayer.name}使用了道具：${itemSkill.name}`, 'player')
      return result
    }

    return result
  }

  // 使用道具技能（兼容旧版接口）
  const useItemSkill = (gameStateManager, playerId, itemName) => {
    return executeItemSkill(gameStateManager, playerId, itemName)
  }

  // 获取道具技能描述
  const getItemDescription = (itemName) => {
    const itemSkill = itemSkills[itemName]
    return itemSkill ? itemSkill.description : ''
  }

  // 返回道具技能管理器的API
  return {
    executeItemSkill,
    useItemSkill,
    getItemDescription
  }
}