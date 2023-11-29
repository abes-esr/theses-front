<template>
  <div class="chips-list">
    <v-chip v-for="facet in selectedFacetsArray" :key="`facet-chip-${facet.label}`" label closable variant="outlined" size="small"
      @click:close="deleteFilter(facet)">
      <label v-if="facet.facetName === 'datedebut'" :title="$t('results.chips.from') + ' ' + facet.label"
        class="chip-label">
        {{ $t("results.chips.from") }} {{ facet.label }}
      </label>
      <label v-else-if="facet.facetName === 'datefin'" :title="$t('results.chips.to') + ' ' + facet.label"
        class="chip-label">
        {{ $t("results.chips.to") }} {{ facet.label }}
      </label>
      <label v-else :title="facet.label" class="chip-label">
        {{ facet.label }}
      </label>
    </v-chip>
  </div>
</template>

<script setup>
const router = useRouter();
const currentRoute = useRoute();
const { setWorkingFacetName, updateFilterData } = useStrategyAPI();

defineProps({
  selectedFacetsArray: {
    type: Object,
      default: []
  }
});

function deleteFilter(facet) {
  setWorkingFacetName('');
  console.log('facet')
  console.log(facet)
  updateFilterData(facet);
}
</script>

<style scoped lang="scss">
.chips-list {
  margin: 0 0.5em;
  display: flex;
  flex-wrap: wrap;
  padding: 6px 0 18px;
}

.v-chip {
  margin: 5px 5px;
  color: rgb(var(--v-theme-primary));
  display: inline-flex;
  justify-content: space-between;
  max-width: 300px;
}

.chip-label {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: Roboto-Regular, sans-serif;
  font-weight: 400;
  color: rgb(var(--v-theme-primary));
}

:deep(.v-chip__content) {
  overflow: hidden !important;
}
</style>