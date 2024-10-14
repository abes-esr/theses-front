<template>
  <div class="chips-list" role="list">
    <v-chip role="listitem" tabindex="0" v-for="facet in selectedFacetsArray" :key="`facet-chip-${facet.label}`" label append-icon="mdi-close-circle" variant="outlined" size="small"
      @click="deleteFilter(facet)">
      <label :id="'facet-chip-' + facet.label" v-if="facet.facetName === 'datedebut'" :title="$t('results.chips.from') + ' ' + facet.label"
        class="chip-label">
        <p class="sr-only">{{ $t('results.chips.suppress') }}</p>
        {{ $t("results.chips.from") }} {{ facet.label }}
      </label>
      <label :id="'facet-chip-' + facet.label" v-else-if="facet.facetName === 'datefin'" :title="$t('results.chips.suppress') + $t('results.chips.to') + ' ' + facet.label"
        class="chip-label">
        <p class="sr-only">{{ $t('results.chips.suppress') }}</p>
        {{ $t("results.chips.to") }} {{ facet.label }}
      </label>
      <label v-else :id="'facet-chip-' + facet.label" class="chip-label" :title="$t('results.chips.suppress') + facet.label">
        <p class="sr-only">{{ $t('results.chips.suppress') }}</p>
        {{ $t(facet.label) }}
      </label>
    </v-chip>
  </div>
</template>

<script setup>
import { useI18n} from "vue-i18n";
const { t } = useI18n();

const { setWorkingFacetName, updateFilterData } = useStrategyAPI();

defineProps({
  selectedFacetsArray: {
    type: Object,
      default: []
  }
});

const emit = defineEmits('reinitializePageNumber');

function deleteFilter(facet) {
  setWorkingFacetName(facet.facetName);
  updateFilterData(facet);
  emit('reinitializePageNumber');
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