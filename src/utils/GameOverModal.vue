<script setup>
import { computed } from 'vue';

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    players: {
        type: Array,
        required: true,
    },
    gameOverReason: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['close']);

// 计算玩家最终得分并排序
const sortedPlayers = computed(() => {
    // 首先将玩家分为未出局和已出局两组
    const activePlayers = [];
    const eliminatedPlayers = [];

    // 计算每个玩家的最终得分
    props.players.forEach((player) => {
        const finalScore = player.score + player.hand.length * 4;
        const playerWithScore = {
            ...player,
            finalScore,
        };

        if (player.status === 'active') {
            activePlayers.push(playerWithScore);
        } else {
            eliminatedPlayers.push(playerWithScore);
        }
    });

    // 两组分别按积分从高到低排序
    activePlayers.sort((a, b) => b.finalScore - a.finalScore);
    eliminatedPlayers.sort((a, b) => b.finalScore - a.finalScore);

    // 未出局的玩家排在前面，已出局的排在后面
    return [...activePlayers, ...eliminatedPlayers];
});

// 关闭模态窗口
const closeModal = () => {
    // 刷新页面
    location.reload();
};
</script>

<template>
    <div class="modal-overlay" v-if="show" @click="closeModal">
        <div class="modal-content" @click.stop>
            <h2 class="modal-title">游戏结束</h2>

            <div class="game-over-reason">
                <h3>游戏结束原因:</h3>
                <p>{{ gameOverReason }}</p>
            </div>

            <div class="final-rankings">
                <h3>最终排名:</h3>
                <div class="rankings-list">
                    <div
                        v-for="(player, index) in sortedPlayers"
                        :key="player.id"
                        class="ranking-item"
                        :class="{
                            'first-place': index === 0,
                            'second-place': index === 1,
                            'third-place': index === 2,
                        }"
                    >
                        <div class="rank">{{ index + 1 }}</div>
                        <div class="player-info">
                            <div class="player-name">{{ player.name }}</div>
                            <div class="player-status" v-if="player.status === 'eliminated'">
                                已出局
                            </div>
                        </div>
                        <div class="player-scores">
                            <div class="score-detail">积分: {{ player.score }}</div>
                            <div class="score-detail">
                                手牌: {{ player.hand.length }} × 4 = {{ player.hand.length * 4 }}
                            </div>
                            <div class="final-score">
                                最终得分: {{ player.score + player.hand.length * 4 }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-actions">
                <button class="close-btn" @click="closeModal">关闭</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: #fff;
    border-radius: 12px;
    padding: 25px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-title {
    color: #8b0000;
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
}

.game-over-reason {
    margin-bottom: 25px;
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 8px;
    border-left: 4px solid #d4a76a;
}

.game-over-reason h3 {
    color: #333;
    margin-bottom: 8px;
    font-size: 18px;
}

.game-over-reason p {
    color: #666;
    font-size: 16px;
    margin: 0;
}

.final-rankings {
    margin-bottom: 25px;
}

.final-rankings h3 {
    color: #333;
    margin-bottom: 15px;
    font-size: 18px;
}

.rankings-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.ranking-item {
    display: flex;
    align-items: center;
    padding: 12px;
    background-color: #f0e6d2;
    border-radius: 8px;
    transition: all 0.2s;
}

.ranking-item:hover {
    background-color: #e0d4b8;
    transform: translateY(-1px);
}

.ranking-item.first-place {
    background-color: #ffd700;
    border: 2px solid #ffc107;
}

.ranking-item.second-place {
    background-color: #c0c0c0;
    border: 2px solid #a9a9a9;
}

.ranking-item.third-place {
    background-color: #cd7f32;
    border: 2px solid #b87333;
}

.rank {
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #8b0000;
    color: white;
    border-radius: 50%;
    font-weight: bold;
    font-size: 16px;
    margin-right: 15px;
}

.player-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.player-name {
    font-weight: bold;
    color: #333;
    font-size: 16px;
}

.player-status {
    font-size: 12px;
    color: #8b0000;
    font-weight: bold;
    margin-top: 2px;
}

.player-scores {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 3px;
}

.score-detail {
    font-size: 12px;
    color: #666;
}

.final-score {
    font-weight: bold;
    color: #8b0000;
    font-size: 16px;
}

.modal-actions {
    display: flex;
    justify-content: center;
    margin-top: 25px;
}

.close-btn {
    padding: 10px 25px;
    background-color: #8b0000;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.close-btn:hover {
    background-color: #a52a2a;
}
</style>
