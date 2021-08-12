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
    data(): cardPack
    {
        let target = new cardPack();
        //拆成NUMBER陣列
        let p:number[] = this.ary?.split(',').map(v => Number(v)) ?? [];
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
});
</script>

<style>

</style>