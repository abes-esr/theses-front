<template>
  <div class="chips-list">
        <v-chip
          v-for="facet in facets"
          :key="`facet-chip-${facet.label}`"
          label
          closable
          variant="outlined"
          size="small"
          @click:close="deleteFilter(facet)"
        >
          <label v-if="facet.filter.facetName === 'datedebut'" :title="facet.label" class="chip-label">
            {{ $t("results.chips.from") }} {{ facet.label }}
          </label>
          <label v-else-if="facet.filter.facetName === 'datefin'" :title="`à ${facet.label}`" class="chip-label">
            {{ $t("results.chips.to") }} {{ facet.label }}
          </label>
          <label v-else :title="facet.label" class="chip-label">
            {{ facet.label }}
          </label>
        </v-chip>
  </div>
</template>
<script setup>
import { APIService } from "@/services/StrategyAPI";

const { setWorkingFacetName } = APIService();

defineProps({
  facets: {
    type: Object
  }
});

const emit = defineEmits('deleteFilter');

function deleteFilter(facet) {
  setWorkingFacetName('');
  emit('deleteFilter', facet);
}
</script>

<style scoped lang="scss">
  .chips-list {
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
  }
</style>