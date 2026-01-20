<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['close']);

const handleClose = () => {
    emit('close');
};
</script>

<template>
    <div v-if="visible" class="modal-backdrop" @click="handleClose">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h3>游戏说明</h3>
                <button class="close-btn" @click="handleClose">×</button>
            </div>
            <div class="modal-body">
                <h4>游戏简介</h4>
                <p>《女巫的毒药》是一款多人桌面卡牌游戏，支持2到4人游戏。玩家抽取具有不同技能的身份牌，然后每回合抽取食物牌，游戏中可以通过积分购买道具牌，需要运用策略和技能来获取积分或让其他玩家出局，最终成为游戏的胜利者。</p>
                
                <h4>游戏流程</h4>
                <ol>
                    <li><strong>身份抽取</strong>：玩家设置游戏人数并依次抽取身份牌</li>
                    <li><strong>游戏开始</strong>：每位玩家获得初始3积分</li>
                    <li><strong>回合流程</strong>：
                        <ul>
                            <li>行动一阶段：使用身份技能或道具（如果有）</li>
                            <li>行动二阶段：翻开一张食物牌，有的直接获得积分，有的具有特殊效果</li>
                            <li>行动三阶段：可以使用金币购买道具牌，也可以不购买</li>
                        </ul>
                    </li>
                    <li><strong>游戏结束</strong>：抽到毒药牌时，玩家出局，当只剩一名玩家或毒药牌用完，游戏结束；若仅剩毒药牌，则积分最高者获胜，结算时道具牌按4积分计算。</li>
                </ol>
                
                <h4>身份类型</h4>
                <ul>
                    <li>学者：游戏开始时，获得5点积分，而不是3点</li>
                    <li>魔术师：使用道具牌时，你可以查看桌上一张食物牌</li>
                    <li>少女：你可以跳过你的回合(一局游戏一次)</li>
                    <li>小女孩：你购买道具时只需花费4积分而不是5积分</li>
                    <li>守墓人：当你翻到“女巫的毒药”时，免出局一次</li>
                    <li>女仆：游戏开始时，获得一张道具牌</li>
                    <li>老流氓：你可以获得一名其他玩家的3点积分(一局游戏一次)</li>
                    <li>长老：购买道具时，抽二保留一</li>
                    <li>纯白之女：可以将所有食物牌重新洗牌(一局游戏一次)</li>
                    <li>弓箭手：下一张食物牌的积分翻倍(一局游戏一次)</li>
                </ul>
                
                <h4>食物牌</h4>
                <ul>
                    <li>女巫的毒药：抽到即出局，一共3张</li>
                    <li>苹果，获取1积分，一共6张</li>
                    <li>苹果派，获取2积分，一共3张</li>
                    <li>甜甜圈，获取3积分，一共2张</li>
                    <li>糖果，获取5积分，一共1张</li>
                    <li>棒棒糖，获得其他玩家的3积分，一共2张</li>
                    <li>曲奇饼干，下一张食物牌的积分翻倍，一共2张</li>
                    <li>放大镜，立即查看场上一张食物牌，一共2张</li>
                    <li>魔法草药，立即拿取一张道具牌，一共2张</li>
                    <li>能量饮料，立即再翻一张食物牌，一共2张</li>
                </ul>
                
                <h4>道具牌</h4>
                <ul>
                    <li>窥视：查看3张食物牌</li>
                    <li>移形换影：选择2张食物牌偷偷交换位置</li>
                    <li>解毒剂：当你翻到”女巫的毒药“时，免出局一次</li>
                    <li>强运甘露：摸取道具牌堆顶2张牌，然后选择1张加入手牌，另一张放回堆底</li>
                    <li>护身符：在你的下一个回合开始前，不会出局</li>
                    <li>力量药剂：选择一名其他玩家，你来帮他翻开一张食物牌，效果由他承担</li>
                    <li>点石成金：立即获取7点积分</li>
                    <li>妙手空空：获得一名其他玩家的3点积分</li>
                </ul>
                
                <h4>操作指南</h4>
                <ol>
                    <li>点击道具卡片选择道具</li>
                    <li>按照提示完成操作</li>
                    <li>观察结果并调整策略</li>
                </ol>
            </div>
            <div class="modal-footer">
                <button class="debug-btn normal" @click="handleClose">关闭</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 模态窗口样式 */
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    animation: modalFadeIn 0.3s ease;
    text-align: left;
}

@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #e8e8e8;
    background-color: #f5f5f5;
    border-radius: 8px 8px 0 0;
}

.modal-header h3 {
    margin: 0;
    color: #8b0000;
    font-size: 1.2em;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #999;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.3s ease;
}

.close-btn:hover {
    background-color: #e8e8e8;
    color: #333;
}

.modal-body {
    padding: 20px;
    line-height: 1.6;
    max-height: 50vh;
    overflow-y: auto;
    background-color: white;
    color: #333;
    text-align: left;
}

/* 自定义滚动条样式 */
.modal-body::-webkit-scrollbar {
    width: 8px;
}

.modal-body::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
    background: #555;
}

.modal-body h4 {
    color: #8b0000;
    margin-top: 20px;
    margin-bottom: 10px;
}

.modal-body p {
    margin-bottom: 10px;
}

.modal-body ul {
    margin-bottom: 15px;
    padding-left: 20px;
}

.modal-body li {
    margin-bottom: 5px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    padding: 16px 20px;
    border-top: 1px solid #e8e8e8;
    background-color: #f5f5f5;
    border-radius: 0 0 8px 8px;
}

/* 按钮样式 */
.debug-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
}

.debug-btn.normal {
    background-color: #4caf50;
    color: white;
}

.debug-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .modal-content {
        width: 95%;
        margin: 20px;
    }
}
</style>