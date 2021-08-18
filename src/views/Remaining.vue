<template>
  <div id="tableBoard">
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
  #tableBoard 
      max-width: 746px
      width: 100%
      margin: 0 auto
      padding-top: 18px
</style>