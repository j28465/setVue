<template>
    <div :style="style" :data-ary="dt" class="card">
        <div @click="this.$parent.choose($event.target)">
            <i v-for="i in ct" :key="i" :class="color" v-html="iconfont"></i>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CSS from 'csstype';

class cardPack{
    color: string;
    iconfont: string;
    style: CSS.Properties;
    dt: string;
    ct: number;

    constructor(){
        this.color = "";
        this.iconfont = "";
        this.style = {};
        this.dt = "";
        this.ct = 0;
    }
}
export default defineComponent({
    props:{
        ary: String
    },
    setup(props): cardPack{
        let target = new cardPack();
        //拆成NUMBER陣列
        let p:number[] = props.ary?.split(',').map(v => Number(v)) ?? [];
        //形狀, 填充
        switch(p[0]) {
            //circle
            case 1: target.iconfont = "&#xa00"+p[2]; target.style.transform = "rotate(180deg)"; break;
            //square
            case 2: target.iconfont = "&#xb00"+p[2]; break;
            //star
            case 3: target.iconfont = "&#xc00"+p[2]; target.style.fontWeight = "bolder"; break;
        }
        //顏色
        switch (p[1]) {
            case 1: target.color = "red"; break;
            case 2: target.color = "green"; break;
            case 3: target.color = "blue"; break;
        }
        //數量
        target.ct = p[3];
        //data
        target.dt = p.join(',');
        return target;
    }
    // data(): cardPack
    // {
    //     let target = new cardPack();
    //     //拆成NUMBER陣列
    //     let p:number[] = this.ary?.split(',').map(v => Number(v)) ?? [];
    //     //形狀, 填充
    //     switch(p[0]) {
    //         //circle
    //         case 1: target.iconfont = "&#xa00"+p[2]; target.style.transform = "rotate(180deg)"; break;
    //         //square
    //         case 2: target.iconfont = "&#xb00"+p[2]; break;
    //         //star
    //         case 3: target.iconfont = "&#xc00"+p[2]; target.style.fontWeight = "bolder"; break;
    //     }
    //     //顏色
    //     switch (p[1]) {
    //         case 1: target.color = "red"; break;
    //         case 2: target.color = "green"; break;
    //         case 3: target.color = "blue"; break;
    //     }
    //     //數量
    //     target.ct = p[3];
    //     //data
    //     target.dt = p.join(',');
    //     return target;
    // }
});
</script>

<style lang="sass">
    @font-face
        font-family: 'icomoon'
        src: url('../css/fonts/icomoon.eot?v00024'), url('../css/fonts/icomoon.eot?#iefixv00024') format('embedded-opentype'), url('../css/fonts/icomoon.woff?v00024') format('woff'), url('../css/fonts/icomoon.ttf?v00024') format('truetype'), url('../css/fonts/icomoon.svg?v00024#icomoon') format('svg')
        font-weight: normal
        font-style: normal
    i
        font-family: 'icomoon'
        font-style: normal
        font-weight: normal
        font-variant: normal
        text-transform: none
        line-height: 1
        -webkit-text-rendering: optimizeLegibility
        -webkit-font-smoothing: antialiased
        -moz-text-rendering: optimizeLegibility
        -moz-font-smoothing: antialiased
        -ms-text-rendering: optimizeLegibility
        -ms-font-smoothing: antialiased
        -o-text-rendering: optimizeLegibility
        -o-font-smoothing: antialiased
        text-rendering: optimizeLegibility
        /*font-smoothing: antialiased;*/
        margin: 0 1px
    .red 
        color: #c90202
    .green 
        color: #1b6206
    .blue 
        color: #001eca
    .card 
        cursor: pointer
        font-size: calc(3.8vw)
        line-height: 2em
        width: 25%
        float: left
        user-select: none
        -webkit-user-select: none
        -moz-user-select: none
        > div 
            border: 1px solid #ccc
            margin: 1px
            height: 2em
</style>