<template>
    <div id="content">
        遊戲等級：
        <label><input type="radio" value="0" v-model="level" />新手(18張牌)</label>
        <label><input type="radio" value="1" v-model="level" />中級(36張牌)</label>
        <label><input type="radio" value="2" v-model="level" />高級(54張牌)</label>
        <label><input type="radio" value="3" v-model="level" />正式開始(81張牌)</label>
        <br />
        <router-link to="/park" @click="this.$store.commit('pushCard',{level: level})">遊戲開始</router-link>
    </div>
</template>

<script>
// import ap from "..App.vue";
// const {t} = ap();
// console.log("t",t);
export default {
    data(){
        return{
            level: 0
        };
    }
}
</script>

<style lang="sass">
    label
        margin-left: 8px
</style>