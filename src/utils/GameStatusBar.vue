<script setup>
// 接收props
const props = defineProps({
  gameState: {
    type: String,
    required: true
  },
  round: {
    type: Number,
    default: 1
  },
  currentPlayerName: {
    type: String,
    default: ''
  },
  currentPhase: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="game-status-bar">
    <div class="game-phase">
      游戏阶段:
      <span v-if="gameState === 'playerSetup'">玩家设置</span>
      <span v-else-if="gameState === 'identitySelection'">身份抽取</span>
      <span v-else-if="gameState === 'playing'">游戏进行中</span>
      <span v-else-if="gameState === 'gameOver'">游戏结束</span>
    </div>
    <div class="round-info" v-if="gameState === 'playing'">
      回合: {{ round }}
    </div>
    <div class="current-player-info" v-if="gameState === 'playing'">
      当前玩家: {{ currentPlayerName }}
    </div>
    <div class="current-phase" v-if="gameState === 'playing'">
      当前行动: {{ currentPhase }}
    </div>
  </div>
</template>

<style scoped>
.game-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 15px;
  background-color: #d4a76a;
  color: #333;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.game-phase,
.round-info,
.current-player-info,
.current-phase {
  margin: 0 32px;
}
</style>