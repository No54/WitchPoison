<script setup>
//    —————————————————————————————
//    |            1              |
//    |———————————————————————————|
//    |                           |
//    |            2              |
//    |___________________________|
//    |                           |
//    |            3              |
//    |___________________________|
//    |                           |
//    |            4              |
//    |___________________________|
//    |                           |
//    |            5              |
//    |___________________________| 

import { onMounted, ref, } from 'vue';

const inPara = defineProps({
    ColumnGap: String, //列间距
    RowGap: String, //行间距 
});

const layout_style = ref({});

const playerCount_style = ref({});
const playerCards_style = ref({});
const roleCards_style = ref({});
const button_style = ref({});
const footer_style = ref({});

onMounted(() => {
    refresh();
});


function refresh() {
    layout_style.value = {
        display: 'grid',
        gridTemplateColumns: '100%',
        gridTemplateRows: '54px 110px 320px 70px auto',
        width: '100%',
        height: '100%',
        rowGap: inPara.RowGap,
        columnGap: inPara.ColumnGap,
        border: 'unset',
    };
    playerCount_style.value = {
        gridColumn: '1 / 2',
        gridRow: '1 / 2',
        padding: '20px',
        border: 'unset',
    };
    playerCards_style.value = {
        gridColumn: '1 / 2',
        gridRow: '2 / 3',
        padding: '20px',
        border: 'unset',
    };
    roleCards_style.value = {
        gridColumn: '1 / 2',
        gridRow: '3 / 4',
        overflow: 'auto',
        paddingLeft: '20px',
        paddingRight: '20px',
        border: 'unset',
    };
    button_style.value = {
        gridColumn: '1 / 2',
        gridRow: '4 / 5',
        padding: '20px',
        border: 'unset',
    };
    footer_style.value = {
        gridColumn: '1 / 2',
        gridRow: '5 / 6',
        padding: '20px',
        border: 'unset',
    };
}
</script>
<template>
    <div :style="layout_style">
        <div :style="playerCount_style">
            <slot name="playerCount">1</slot>
        </div>
        <div :style="playerCards_style">
            <slot name="playerCards">2</slot>
        </div>
        <div :style="roleCards_style">
            <slot name="roleCards">3</slot>
        </div>
        <div :style="button_style">
            <slot name="button">4</slot>
        </div>
        <div :style="footer_style">
            <slot name="footer">5</slot>
        </div>

    </div>
</template>
<style scoped></style>
