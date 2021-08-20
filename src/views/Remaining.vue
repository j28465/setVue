<template>
  <div id="content">
    <Card v-for="v in this.$store.state.card.cards" :key="v" :ary="v.join(',')"></Card>
  </div>
</template>

<script lang="ts">
import Card from '@/components/Card.vue'
export default {
  components: { Card },
}
</script>

<style lang="sass">
  #content 
      padding-top: 18px
</style>