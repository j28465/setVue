<template>
    <div class="msgBox" v-show="this.$store.state.msg.msgShow">
        <div class="msgBg"></div>
        <div class="msgLayout">
            <b class="msgClose" @click="this.$store.commit('closeMsg')">x</b>
            <div class="msgTitle">{{this.$store.state.msg.msgTitle}}</div>
            <div class="msgDesc">{{desc}}</div>
            <div class="msgCmd">
                <button type="button" @click="this.$store.commit('closeMsg')">確定</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
}
</script>

<style lang="sass">
.msgBox
    z-index: 999
    .msgBg
        background: #000 
        height: 100vh
        left: 0
        opacity: 0.4
        position: absolute
        top: 0
        width: 100vw
    .msgLayout
        background-color: #eaeaea
        border: 3px solid #ccc
        -webkit-border-radius: 4px
        -moz-border-radius: 4px
        border-radius: 4px
        left: 50%
        margin-left: -175px
        max-width: 350px
        padding: 10px
        position: absolute
        top: 100px
        width: 90%
        z-index: 1001
        .msgClose
            cursor: pointer
            font-size: 20px
            position: absolute
            right: 16px
        .msgTitle
            font-size: 16px
            margin-top: 26px
            color: #df0202
        .msgDesc
            font-size: 13px
        .msgCmd
            border-top: 1px solid #ccc
            margin-top: 6px
            padding-top: 6px
            text-align: right 
            button
                cursor: pointer
</style>