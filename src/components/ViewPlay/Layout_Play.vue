<script setup>
//    ———————————————————————————————————————————————————
//    |        |      |                |                | 
//    |   1    |  2   |                |                | 
//    |________|______|        5       |        6       |
//    |        |      |                |                | 
//    |   3    |  4   |                |                | 
//    |________|______|________________|________________|
//    |                                                 |
//    |                    7                            |
//    |_________________________________________________|

import { onMounted, ref, } from 'vue';

const inPara = defineProps({
    ColumnGap: String, //列间距
    RowGap: String, //行间距 
});

const layout_style = ref({});

const player1_style = ref({});
const player2_style = ref({});
const player3_style = ref({});
const player4_style = ref({});
const food_style = ref({});
const log_style = ref({});
const footer_style = ref({});

onMounted(() => {
    refresh();
});


function refresh() {
    layout_style.value = {
        display: 'grid',
        gridTemplateColumns: '320px 320px auto 300px',
        gridTemplateRows: '49% 49% 2%',
        width: '100%',
        height: '100%',
        rowGap: inPara.RowGap,
        columnGap: inPara.ColumnGap,
        border: 'unset',
    };
    player1_style.value = {
        gridColumn: '1 / 2',
        gridRow: '1 / 2',
        padding: '10px',
        border: 'unset',
    };
    player2_style.value = {
        gridColumn: '2 / 3',
        gridRow: '1 / 2',
        padding: '10px',
        border: 'unset',
    };
    player3_style.value = {
        gridColumn: '1 / 2',
        gridRow: '2 / 3',
        padding: '10px',
        border: 'unset',
    };
    player4_style.value = {
        gridColumn: '2 / 3',
        gridRow: '2 / 3',
        padding: '10px',
        border: 'unset',
    };
    food_style.value = {
        gridColumn: '3 / 4',
        gridRow: '1 / 3',
        overflow: 'auto',
        padding: '10px',
        border: 'unset',
    };
    log_style.value = {
        gridColumn: '4 / 5',
        gridRow: '1 / 3',
        padding: '10px',
        border: 'unset',
    };
    footer_style.value = {
        gridColumn: '1 / 5',
        gridRow: '3 / 4',
        padding: '10px',
        border: 'unset',
    };
}
</script>
<template>
    <div :style="layout_style">
        <div :style="player1_style">
            <slot name="player1">1</slot>
        </div>
        <div :style="player2_style">
            <slot name="player2">2</slot>
        </div>
        <div :style="player3_style">
            <slot name="player3">3</slot>
        </div>
        <div :style="player4_style">
            <slot name="player4">4</slot>
        </div>
        <div :style="food_style">
            <slot name="food">5</slot>
        </div>
        <div :style="log_style">
            <slot name="log">6</slot>
        </div>
        <div :style="footer_style">
            <slot name="footer">7</slot>
        </div>

    </div>
</template>
<style scoped></style>
