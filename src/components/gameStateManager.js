import { ref, watch } from 'vue';
import { generateFoodCards } from './Food/foodCards.js';
import { identityCards } from './Identity/identityCards.js';
import { toolCards } from './Items/toolCards.js';

export function useGameState() {
    // 游戏状态
    const gameState = ref('identitySelection'); // identitySelection, playing, gameOver
    const currentPhase = ref(''); // 行动一, 行动二, 行动三
    const currentPlayerIndex = ref(0);
    const round = ref(1);
    const gameOverReason = ref('');
    const isDebugMode = ref(false); // 调试模式：关闭毒药出局效果

    // 玩家数据
    const players = ref([
        {
            id: 1,
            name: '玩家1',
            identity: '',
            score: 3,
            hand: [],
            status: 'active',
            isEditing: false,
            editName: '',
        },
    ]);

    // 玩家数量选择
    const playerCount = ref(2);

    // 当前抽取身份的玩家索引
    const currentDrawerIndex = ref(0);

    // 身份列表（7个可选身份）
    const allIdentities = ref(identityCards.map((card) => card.name));

    // 可用身份牌（初始为7个）
    const availableIdentities = ref([]);

    // 5x5食物牌桌面 - 使用generateFoodCards生成符合要求的25张食物牌
    const foodCards = ref(generateFoodCards());

    // 游戏日志
    const logs = ref([]);

    // 洗牌函数
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    // 道具牌堆管理
    // 初始化道具牌堆：8种道具，每种3张，共24张
    const initializeToolCardDeck = () => {
        const deck = [];
        // 每种道具添加3张
        toolCards.forEach((card) => {
            for (let i = 0; i < 3; i++) {
                deck.push({ ...card, id: `${card.name}-${i + 1}` });
            }
        });
        // 洗牌：初始化后对道具牌堆进行随机排序
        shuffleArray(deck);
        return deck;
    };

    // 道具牌堆
    const toolCardDeck = ref(initializeToolCardDeck());

    // 添加游戏日志
    const addGameLog = (content, type = 'system') => {
        const now = new Date();
        const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        logs.value.push({ content, type, time });
    };

    // 重置游戏状态
    const resetGame = () => {
        // 重置当前抽取玩家索引
        currentDrawerIndex.value = 0;
        // 重置可用身份牌
        availableIdentities.value = [...allIdentities.value];
        shuffleArray(availableIdentities.value);
        // 重置玩家身份
        players.value.forEach((player) => {
            player.identity = '';
        });
        // 重置道具牌堆
        toolCardDeck.value = initializeToolCardDeck();
    };

    // 切换玩家数量
    const changePlayerCount = (count) => {
        playerCount.value = count;
        // 更新玩家列表
        const newPlayers = Array(count)
            .fill(null)
            .map((_, index) => {
                // 保留已有玩家的名字
                if (players.value[index]) {
                    return {
                        ...players.value[index],
                        identity: '',
                        isEditing: false,
                        editName: '',
                    };
                }
                return {
                    id: index + 1,
                    name: `玩家${index + 1}`,
                    identity: '',
                    score: 3,
                    hand: [],
                    status: 'active',
                    isEditing: false,
                    editName: '',
                };
            });
        players.value = newPlayers;
        // 重置游戏状态
        resetGame();
    };

    // 玩家抽取身份
    const drawIdentity = (identity) => {
        // 确保当前玩家索引有效
        if (currentDrawerIndex.value < players.value.length) {
            // 当前玩家抽取身份
            players.value[currentDrawerIndex.value].identity = identity;
            // 从可用身份中移除已抽取的身份
            const index = availableIdentities.value.indexOf(identity);
            if (index > -1) {
                availableIdentities.value.splice(index, 1);
            }
            // 下一个玩家抽取
            currentDrawerIndex.value++;
        } else {
            // 索引无效，不执行任何操作
            console.warn('尝试抽取身份时索引无效:', currentDrawerIndex.value);
        }
    };

    // 从道具牌堆中抽取一张道具牌
    const drawToolCard = () => {
        if (toolCardDeck.value.length === 0) {
            // 道具牌堆已空，返回null
            return null;
        }
        // 从牌堆顶部抽取一张道具牌（按顺序）
        return toolCardDeck.value.shift();
    };

    // 更新道具牌堆顺序
    const updateToolCardDeck = (newDeck) => {
        toolCardDeck.value = [...newDeck];
    };

    return {
        gameState,
        currentPhase,
        currentPlayerIndex,
        round,
        gameOverReason,
        isDebugMode,
        players,
        playerCount,
        currentDrawerIndex,
        allIdentities,
        availableIdentities,
        foodCards,
        logs,
        addGameLog,
        resetGame,
        changePlayerCount,
        drawIdentity,
        shuffleArray,
        toolCardDeck,
        drawToolCard,
        updateToolCardDeck,
    };
}
