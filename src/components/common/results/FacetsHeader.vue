<template>
  <div class="filter-meta">
    <v-icon color="primary">mdi-filter-menu</v-icon>
    <div class="spacer"></div>
    <h4>{{ $t('results.facetsHeader') }}</h4>
  </div>
  <v-btn @click.stop="" @click="searchAndReinitializeAllFacets" class="reinitialize-button" size="small" depressed
         elevation="0" color="primary">
    Réinitialiser
  </v-btn>
</template>

<script setup>
  const emit = defineEmits('searchAndReinitializeAllFacets');

  function searchAndReinitializeAllFacets() {
    emit('searchAndReinitializeAllFacets');
  }
</script>

<style scoped>
.filter-meta {
  display: flex;
  flex-wrap: nowrap;
}

.v-btn--elevated :deep(.v-btn__content)  {
  text-transform: capitalize;
  letter-spacing: 0.5px;
}

.spacer {
  width: 10px;
}
</style>