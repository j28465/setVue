<template>
  <div>
    <Card v-for="v in this.$store.getters.getCards" :key="v" :ary="v.join(',')"></Card>
  </div>
</template>

<script lang="ts">
import Card from '@/components/Card.vue'
export default {
  components: { Card },
}
</script>

<style>

</style>