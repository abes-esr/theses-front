<template>
  <v-text-field
    v-model="search"
    variant="outlined"
    append-inner-icon="mdi-magnify"
    label="Search"
    density="compact"
    single-line
    hide-details
    class="facet-search-bar"
  ></v-text-field>
</template>

<script setup>

</script>

<style scoped>
  .facet-search-bar {
    width: 10%;
  }
</style>