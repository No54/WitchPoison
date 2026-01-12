// 积分相关工具函数

/**
 * 从其他玩家那里窃取积分
 * @param {Array} players - 玩家数组
 * @param {Object} currentPlayer - 当前使用技能/道具的玩家
 * @param {number} maxStealAmount - 最大窃取积分数量
 * @param {string} sourceType - 来源类型，如 'role' 或 'item'
 * @param {string} sourceName - 来源名称，如 '老流氓' 或 '妙手空空'
 * @returns {Object} - 窃取结果，包含 success 和 message
 */
export const stealScoreFromPlayer = (players, currentPlayer, maxStealAmount = 3, sourceType = 'role', sourceName = '') => {
    // 找到活跃的其他玩家
    const otherPlayers = players.filter(player => player.id !== currentPlayer.id && player.status === 'active');
    
    if (otherPlayers.length === 0) {
        return {
            success: false,
            message: `${currentPlayer.name}使用了${sourceName}，但没有其他活跃玩家可以获取积分`
        };
    }
    
    // 随机选择一名玩家
    const targetPlayer = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
    
    // 获取积分，最多maxStealAmount，最少获取到0为止
    const stolenScore = Math.min(maxStealAmount, targetPlayer.score);
    targetPlayer.score -= stolenScore;
    currentPlayer.score += stolenScore;
    
    // 构造消息
    const sourcePrefix = sourceType === 'role' ? `（${sourceName}）` : `使用了${sourceName}`;
    const targetPrefix = sourceType === 'role' ? '那里' : '手中';
    
    return {
        success: true,
        message: `${currentPlayer.name}${sourcePrefix}从${targetPlayer.name}${targetPrefix}获得了${stolenScore}点积分`
    };
};