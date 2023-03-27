<template>
  <div class="chips-list">
    <v-chip
      class="chip"
      v-for="facet in facets"
      :key="`facet-chip-${facet.label}`"
      label
      closable
      variant="outlined"
      size="small"
      @click:close="deleteFilter(facet)"
    >
      {{ facet.label }}
    </v-chip>
  </div>
</template>
<script setup>
defineProps({
  facets: {
    type: Object
  }
});

const emit = defineEmits('deleteFilter');

function deleteFilter(facet) {
  emit('deleteFilter', facet);
}
</script>

<style scoped lang="scss">
  .chips-list {
    display: flex;
    padding: 6px 0 18px;
  }

  .chip {
    margin: 0 5px;
    color: rgb(var(--v-theme-primary));
  }
</style>