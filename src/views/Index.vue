<template>
    <!-- <div id="nav">
        <router-link to="/">首頁</router-link> |
        <router-link to="/park">遊藝場</router-link> |
        <router-link to="/remaining">剩下牌組</router-link>
    </div> -->
    <router-link to="/park" @click="this.$store.commit('pushCard')">遊戲開始</router-link>
</template>

<script>
export default {

}
</script>

<style>

</style>