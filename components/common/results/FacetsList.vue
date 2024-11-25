<template>
  <div class="facets" role="list">
    <CommonResultsFacetDrawer v-if="domaine === 'theses' && Object.keys(facets).length > 0" date key="facet-date"
      :facet="{ 'name': 'Date' }" :selected-facets-array="selectedFacetsArray"
      @reinitializePageNumber="reinitializePageNumber"
    index="-1"
    >
    </CommonResultsFacetDrawer>
    <CommonResultsFacetDrawer v-for="(facet, index) in facets" :key="`facet-${facet.name}`" :facet="facet"
      :selected-facets-array="selectedFacetsArray"
      :reset-text-fields="resetTextFields"
      @reinitializePageNumber="reinitializePageNumber"
      :index="index"
    >
    </CommonResultsFacetDrawer>
    <v-btn v-if="mobile" class="filters-btn" variant="outlined" color="primary" @click="closeOverlay">{{ $t('results.facet.applyFilters') }}</v-btn>
    <v-skeleton-loader v-if="loading" v-for="i in 6" :key="i" type="list-item" class="skeleton"></v-skeleton-loader>
  </div>
</template>

<script setup>
import { useDisplay } from "vuetify";

const currentRoute = useRoute();
const { mobile } = useDisplay();
const emit = defineEmits(['closeOverlay', 'reinitializePageNumber']);

const props = defineProps({
  facets: {
    type: Object,
    default: []
  },
  selectedFacetsArray: {
    type: Array,
    default: []
  },
  domaine: {
    type: String,
    default: "these"
  },
  loading: {
    type: Boolean,
    default: true
  },
  resetTextFields: {
    type: Number,
    default: 0
  }
});

function closeOverlay() {
  emit('closeOverlay');
}

/**
 * Emits
 */
function reinitializePageNumber() {
  emit('reinitializePageNumber');
}
</script>

<style scoped lang="scss">
@use '../../../node_modules/vuetify/settings';

.facets {
  display: flex;
  flex-direction: column;

  .skeleton {
    height: 48px !important;
    width: 85%;
    background-color: rgb(var(--v-theme-gris-clair));
    margin-bottom: 1em;
  }

  .filters-btn {
    margin-top: 15px;

  }
}

:deep(.v-expansion-panel-title--active:hover > .v-expansion-panel-title__overlay) {
  opacity: 0.04;
}

:deep(.v-expansion-panel) {
  color: rgb(var(--v-theme-text-dark-blue)) !important;
}
</style>