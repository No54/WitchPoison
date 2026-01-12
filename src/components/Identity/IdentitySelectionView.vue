<script setup>
import { ref } from 'vue';
// 导入组件
import Tooltip from '../../utils/Tooltip.vue';
import Layout_Setup from './Layout_Setup.vue';

// 接收props
const props = defineProps({
    players: {
        type: Array,
        required: true,
    },
    playerCount: {
        type: Number,
        default: 2,
    },
    currentDrawerIndex: {
        type: Number,
        default: 0,
    },
    availableIdentities: {
        type: Array,
        default: () => [],
    },
    cardBackUrl: {
        type: String,
        default: null,
    },
    identityDescriptions: {
        type: Object,
        default: () => {},
    },
    isDebugMode: {
        type: Boolean,
        default: false,
    },
});

// 定义emit
const emit = defineEmits([
    'changePlayerCount',
    'toggleEditName',
    'savePlayerName',
    'drawIdentity',
    'startGame',
]);

// 显示tooltip的身份索引
const tooltipIdentityIndex = ref(-1);

// 身份选择阶段玩家身份tooltip控制
const showTooltip = ref(false);
const tooltipPlayerId = ref(null);

// 获取身份描述
const getIdentityDescription = (identityName) => {
    return props.identityDescriptions[identityName] || '';
};

// 切换玩家数量
const changePlayerCount = (count) => {
    emit('changePlayerCount', count);
};

// 切换玩家编辑状态
const toggleEditName = (player) => {
    emit('toggleEditName', player);
};

// 保存玩家名字
const savePlayerName = (player) => {
    emit('savePlayerName', player);
};

// 玩家抽取身份
const drawIdentity = (identity) => {
    emit('drawIdentity', identity);
};

// 开始游戏
const startGame = () => {
    emit('startGame');
};
</script>

<template>
    <Layout_Setup>
        <template #playerCount>
            <!-- 顶部信息栏 -->
            <div class="top-info-bar">
                <!-- 玩家数量选择 -->
                <div class="player-count-selector">
                    <span>玩家数量：</span>
                    <button
                        v-for="count in [2, 3, 4]"
                        :key="count"
                        class="count-btn"
                        :class="{ active: playerCount === count }"
                        @click="changePlayerCount(count)"
                    >
                        {{ count }}
                    </button>
                </div>

                <!-- 当前抽取玩家提示 -->
                <div class="current-drawer" v-if="currentDrawerIndex < players.length">
                    <h3>{{ players[currentDrawerIndex].name }} 抽取身份</h3>
                </div>
            </div>
        </template>
        <template #playerCards>
            <!-- 玩家列表 -->
            <div class="players-list">
                <div
                    v-for="(player, index) in players"
                    :key="player.id"
                    class="player-item"
                    :class="{
                        current: index === currentDrawerIndex,
                        drawn: player.identity !== '',
                    }"
                >
                    <!-- 玩家姓名编辑 -->
                    <div class="player-name-section">
                        <div v-if="!player.isEditing" class="player-name-display">
                            <span class="player-name">{{ player.name }}</span>
                            <button class="edit-btn" @click="toggleEditName(player)">编辑</button>
                        </div>
                        <div v-else class="player-name-edit">
                            <input
                                type="text"
                                v-model="player.editName"
                                class="name-input"
                                @keyup.enter="savePlayerName(player)"
                                @blur="savePlayerName(player)"
                                autofocus
                            />
                            <button class="save-btn" @click="savePlayerName(player)">保存</button>
                        </div>
                    </div>

                    <!-- 玩家身份 -->
                    <div
                        class="player-identity"
                        @mouseenter="
                            showTooltip = true;
                            tooltipPlayerId = player.id;
                        "
                        @mouseleave="
                            showTooltip = false;
                            tooltipPlayerId = null;
                        "
                    >
                        {{ player.identity || '未抽取' }}
                        <Tooltip
                            :message="getIdentityDescription(player.identity)"
                            :show="
                                showTooltip &&
                                tooltipPlayerId === player.id &&
                                player.identity !== ''
                            "
                        />
                    </div>
                </div>
            </div>
        </template>
        <template #roleCards>
            <!-- 身份牌列表 -->
            <div class="identity-cards-container">
                <div
                    v-for="(identity, index) in availableIdentities"
                    :key="index"
                    class="identity-card-wrapper"
                    :class="{ disabled: currentDrawerIndex >= players.length }"
                    @click="drawIdentity(identity)"
                    @mouseenter="tooltipIdentityIndex = index"
                    @mouseleave="tooltipIdentityIndex = -1"
                >
                    <div class="identity-card">
                        <div class="card-content">
                            <div
                                class="card-back"
                                :style="
                                    cardBackUrl && !isDebugMode
                                        ? {
                                              backgroundImage: `url(${cardBackUrl})`,
                                              backgroundSize: '100% 100%',
                                              backgroundPosition: 'center',
                                              backgroundRepeat: 'no-repeat',
                                          }
                                        : {}
                                "
                            >
                                <span class="card-back-text" v-if="!cardBackUrl && !isDebugMode">
                                    身份牌
                                </span>
                                <div v-if="isDebugMode" class="card-front">
                                    <div class="identity-name">{{ identity }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 使用Tooltip组件，仅在debug模式下显示 -->
                    <Tooltip
                        :message="getIdentityDescription(identity)"
                        :show="tooltipIdentityIndex === index && isDebugMode"
                    />
                </div>
            </div>
        </template>
        <template #button>
            <!-- 开始游戏按钮 -->
            <button
                class="start-game-btn"
                @click="startGame"
                :disabled="!players.every((player) => player.identity !== '')"
            >
                开始游戏
            </button>
        </template>
        <template #footer>{{ ' ' }}</template>
    </Layout_Setup>
</template>

<style scoped>
/* 玩家数量选择 */
.player-count-selector {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
    font-size: 14px;
    color: #333;
}

.count-btn {
    padding: 6px 12px;
    background-color: #f0e6d2;
    color: #333;
    border: 1px solid #d4a76a;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: bold;
    font-size: 13px;
}

.count-btn:hover {
    background-color: #d4a76a;
    color: #fff;
}

.count-btn.active {
    background-color: #8b0000;
    color: #fff;
    border-color: #8b0000;
}

/* 顶部信息栏 */
.top-info-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 90vw;
    margin-bottom: 8px;
    flex-wrap: wrap;
    gap: 8px;
}

/* 当前抽取玩家提示 */
.current-drawer {
    text-align: right;
    flex-shrink: 0;
}

.current-drawer h3 {
    color: #8b0000;
    margin: 0;
    font-size: 1.5em;
}

/* 调整身份牌大小 - 改为矮矩形 */
.identity-card {
    width: 100px;
    height: 130px;
    font-size: 16px;
}

/* Tooltip样式 */
.tooltip-container {
    position: absolute;
    z-index: 9999;
    pointer-events: none;
    /* 定位在卡牌下方居中 */
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 8px;
}

.tooltip-content {
    background-color: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 10px 15px;
    border-radius: 8px;
    font-size: 0.85em;
    max-width: 200px;
    line-height: 1.4;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    white-space: normal;
    word-wrap: break-word;
    box-sizing: border-box;
}

/* 玩家列表 */
.players-list {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin: 5px 0;
    flex-wrap: wrap;
    width: 100%;
    max-width: 90vw;
}

.player-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
    min-width: 120px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
}

.player-item.current {
    border: 2px solid #8b0000;
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.player-item.drawn {
    background-color: rgba(232, 245, 232, 0.9);
    border: 2px solid #4caf50;
}

/* 玩家姓名编辑 */
.player-name-section {
    margin-bottom: 6px;
    width: 100%;
    text-align: center;
}

.player-name-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.player-name {
    font-size: 14px;
    font-weight: bold;
    color: #333;
}

.edit-btn {
    padding: 3px 6px;
    background-color: #d4a76a;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 11px;
    transition: background-color 0.3s;
}

.edit-btn:hover {
    background-color: #b8944e;
}

.player-name-edit {
    display: flex;
    align-items: center;
    gap: 4px;
    width: 100%;
    justify-content: center;
}

.name-input {
    padding: 4px;
    border: 1px solid #d4a76a;
    border-radius: 4px;
    font-size: 12px;
    width: 80px;
}

.save-btn {
    padding: 3px 6px;
    background-color: #4caf50;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 11px;
    transition: background-color 0.3s;
}

/* 玩家身份 */
.player-identity {
    font-size: 13px;
    color: #666;
    font-style: italic;
    position: relative;
    display: inline-block;
}

/* 身份牌容器 */
.identity-cards-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin: 15px 0;
    flex-wrap: wrap;
    width: 100%;
    max-width: 90vw;
    overflow: visible;
}

.identity-card-wrapper {
    position: relative;
    cursor: pointer;
    transition:
        transform 0.3s,
        box-shadow 0.3s;
    flex-shrink: 0;
}

.identity-card-wrapper:hover:not(.disabled) {
    transform: translateY(-8px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.identity-card-wrapper.disabled {
    opacity: 0.5;
    cursor: default;
}

/* 身份牌样式 - 改为矮矩形 */
.identity-card {
    width: 100px;
    height: 130px;
    color: #fff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    font-weight: bold;
    font-size: 16px;
    text-align: center;
    padding: 0;
    box-sizing: border-box;
    transition: all 0.3s;
    overflow: hidden;
}

.card-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    overflow: hidden;
    padding: 0;
    margin: 0;
}

.card-back {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background-color: transparent !important;
    background-size: cover !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
    padding: 0;
    margin: 0;
    border: none;
}

.card-back-text {
    color: white;
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    font-size: 1.2em;
}

.identity-card:hover {
    transform: scale(1.05);
}

.identity-name {
    font-size: 18px;
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* 开始游戏按钮 */
.start-game-btn {
    padding: 12px 30px;
    font-size: 16px;
    background-color: #8b0000;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s;
    margin: 0 auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    min-width: 150px;
    text-align: center;
}

.start-game-btn:hover:not(:disabled) {
    background-color: #a52a2a;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.start-game-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    box-shadow: none;
}

/* 按钮样式统一 */
button {
    padding: 8px 16px;
    font-size: 14px;
    background-color: #8b0000;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-weight: bold;
}

button:hover:not(:disabled) {
    background-color: #a52a2a;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>
