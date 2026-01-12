// 角色技能管理模块

// 导入所有角色技能实现
import Archer from './Roles/Archer.js';
import Elder from './Roles/Elder.js';
import Girl from './Roles/Girl.js';
import LittleGirl from './Roles/LittleGirl.js';
import Magician from './Roles/Magician.js';
import Maid from './Roles/Maid.js';
import PureGirl from './Roles/PureGirl.js';
import Rogue from './Roles/Rogue.js';
import Scholar from './Roles/Scholar.js';
import Watchman from './Roles/Watchman.js';

// 角色技能映射
export const roleSkills = {
    弓箭手: Archer,
    长老: Elder,
    少女: Girl,
    小女孩: LittleGirl,
    魔法师: Magician,
    女仆: Maid,
    纯白之女: PureGirl,
    老流氓: Rogue,
    学者: Scholar,
    守墓人: Watchman,
};

// 创建角色技能管理器
export const createRoleSkillManager = () => {
    // 执行角色技能
    const executeRoleSkill = (gameStateManager, playerId, abilityName) => {
        const { players, addGameLog, foodCards } = gameStateManager;
        const currentPlayer = players.value.find((p) => p.id === playerId);

        if (!currentPlayer) return { success: false, message: `找不到玩家：${playerId}` };

        // 获取角色技能实现
        const roleSkill = roleSkills[currentPlayer.identity];
        if (!roleSkill) return { success: false, message: `未知角色：${currentPlayer.identity}` };

        // 技能使用阶段检查已在外部处理，这里不再重复检查

        // 根据技能类型执行不同的技能
        let result;
        switch (abilityName) {
            case 'skipTurn':
                // 少女：跳过回合
                result = roleSkill.onTurnStart
                    ? roleSkill.onTurnStart(gameStateManager, currentPlayer)
                    : { success: false, message: `角色${currentPlayer.identity}没有回合开始技能` };
                break;
            case 'stealPoints':
                // 老流氓：偷取积分
                result = roleSkill.onActivate
                    ? roleSkill.onActivate(gameStateManager, currentPlayer, players.value)
                    : { success: false, message: `角色${currentPlayer.identity}没有可激活的技能` };
                break;
            case 'reshuffle':
                // 纯白之女：重新洗牌
                result = roleSkill.onActivate
                    ? roleSkill.onActivate(gameStateManager, currentPlayer, foodCards.value)
                    : { success: false, message: `角色${currentPlayer.identity}没有可激活的技能` };
                break;
            case 'doubleNext':
                // 弓箭手：下一张食物牌积分翻倍
                result = roleSkill.onActivate
                    ? roleSkill.onActivate(gameStateManager, currentPlayer)
                    : { success: false, message: `角色${currentPlayer.identity}没有可激活的技能` };
                break;
            default:
                // 默认使用onActivate方法
                result = roleSkill.onActivate
                    ? roleSkill.onActivate(gameStateManager, currentPlayer, players.value)
                    : { success: false, message: `角色${currentPlayer.identity}没有可激活的技能` };
        }

        if (result.success) {
            addGameLog(`${currentPlayer.name}使用了角色技能：${roleSkill.name}`, 'player');
            return result;
        }

        return result;
    };

    // 使用角色技能（兼容旧版接口）
    const useRoleAbility = (gameStateManager, playerId, ability) => {
        return executeRoleSkill(gameStateManager, playerId, ability);
    };

    // 初始化角色相关状态
    const initRoleStates = (player) => {
        // 通用角色技能状态
        player.hasUsedActiveAbility = false; // 主动技能使用状态（一局游戏只能使用一次）
        player.hasUsedGraveKeeperAbility = false; // 守墓人：免死一次
        player.nextCardDouble = false; // 下一张食物牌积分翻倍标记（弓箭手技能或曲奇饼干效果）

        // 免疫状态
        player.hasImmunity = 0; // 守墓人：开场获得免疫状态，使用计数器支持叠加
        player.hasRoundImmunity = false; // 回合免疫状态
        player.hasUsedAntidote = false; // 解毒剂：使用后获得免疫状态
    };

    // 获取角色技能描述
    const getRoleDescription = (roleName) => {
        const roleSkill = roleSkills[roleName];
        return roleSkill ? roleSkill.description : '';
    };

    // 返回角色技能管理器的API
    return {
        executeRoleSkill,
        useRoleAbility,
        initRoleStates,
        getRoleDescription,
    };
};
