<template>
  <div class="facets">
    <CommonResultsFacetDrawer v-if="domaine === 'theses' && Object.keys(facets).length > 0" date key="facet-date"
      :facet="{ 'name': 'Date' }" :selected-facets-array="selectedFacetsArray" :parameters-loaded="parametersLoaded"
      :reinitialize-date-fields-trigger="reinitializeDateFieldsTrigger"
      :reinitialize-date-from-trigger="reinitializeDateFromTrigger"
      :reinitialize-date-to-trigger="reinitializeDateToTrigger" @updateFilterDateOnly="updateFilterDateOnly($event)"
      >
    </CommonResultsFacetDrawer>
    <CommonResultsFacetDrawer v-for="facet in facets" :key="`facet-${facet.name}`" :facet="facet"
      :selected-facets-array="selectedFacetsArray" @reinitializeCheckboxes="reinitializeCheckboxes">
    </CommonResultsFacetDrawer>
    <v-btn v-if="mobile" class="filters-btn" variant="outlined" color="primary" @click="closeOverlay">Appliquer les
      filtres</v-btn>
    <v-skeleton-loader v-if="loading" v-for="i in 6" :key="i" type="list-item" class="skeleton"></v-skeleton-loader>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useDisplay } from "vuetify";
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'


const currentRoute = useRoute();
const emit = defineEmits('closeOverlay');

const props = defineProps({
  facets: {
    type: Object
  },
  selectedFacetsArray: {
    type: Array,
    default: []
  },
  resetFacets: {
    type: Number
  },
  domaine: {
    type: String
  },
  parametersLoaded: {
    type: Number
  },
  reinitializeDateFromTrigger: {
    type: Number
  },
  reinitializeDateToTrigger: {
    type: Number
  },
  loading: {
    type: Boolean
  }
});

const { mobile } = useDisplay();
const reinitializeDateFieldsTrigger = ref(0);

/**
 * Emits
 */

function closeOverlay() {
  emit('closeOverlay');
}

/**
 * Watchers
 */
/**
 * watch: bouton réinitialiser toutes les facettes
 */
watch(() => props.resetFacets,
  () => {
    reinitializeDateFieldsTrigger.value++;
  });
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
</style>