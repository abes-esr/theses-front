<template>
  <div class="result-pagination">

  </div>
</template>
<script>
export default {
  name: "action-bar-personnes"
};
</script>
<script setup>

</script>
<style scoped lang="scss">
@use 'vuetify/settings';

.result-pagination {
  background-color: rgb(var(--v-theme-gris-clair));
  max-height: 4rem;
  display: grid;
  width: 100%;
}
</style>