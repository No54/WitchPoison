// 卡背图片加载工具

// 卡背图片路径 - 使用SVG格式
const cardBackMap = {
  identity: '/CardBack/back-identity.svg',
  food: '/CardBack/back-food.svg',
  punishment: '/CardBack/back-punishment.svg',
  tool: '/CardBack/back-tool.svg'
}

// 检查卡背图片是否存在
const checkCardBackExists = async (path) => {
  try {
    const response = await fetch(path, { method: 'HEAD' })
    return response.ok
  } catch (error) {
    console.error('检查卡背图片失败:', error)
    return false
  }
}

// 获取卡背图片URL
const getCardBackUrl = async (type = 'identity') => {
  const path = cardBackMap[type] || cardBackMap.identity
  const exists = await checkCardBackExists(path)
  return exists ? path : null
}

export { getCardBackUrl }