<template>
    <v-row>
      <v-col v-for="item in result" :key="item.id" cols="12" xs="12" md="6">
        <personnes-card :item="item" />
      </v-col>
    </v-row>
</template>

<script setup>
import PersonnesCard from '@/components/personnes/results/PersonnesCard.vue';

defineProps({
  result: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>

</style>