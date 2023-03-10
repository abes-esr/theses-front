<template>
  <v-expansion-panels rounded>
    <v-expansion-panel :eager="true">
      <v-expansion-panel-title :ripple="true" class="facet-title-panel">
        <h4 class="facet-title">
          {{ facet.name }}
        </h4>
        <v-btn @click.stop="" @click="reinitializeCheckboxes" class="reinitialize-button" size="small" depressed="true"
          elevation="0" color="primary">
          <v-icon>mdi-reload</v-icon>
        </v-btn>
      </v-expansion-panel-title>
      <v-expansion-panel-text :eager="true" class="pe-0">
        <div class="facet-sub-menu">
          <v-text-field v-if="facet.searchBar" :label='$t("rechercher")' v-model="filterSearchText" variant="outlined"
            append-inner-icon="mdi-magnify" density="compact" single-line hide-details
            class="facet-search-bar"></v-text-field>
        </div>
        <div class="panel-text">
          <div v-for="facetItem in facetItems" :key="`facet-${facetItem.name}`">
            <facet-checkbox v-if="facetItem.selected" :facets-array="facetsArray" :facet-name="facet.name"
              :facet-item="facetItem" @updateFilterData="updateFilterData" :margin-offset="marginOffset" />
          </div>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import FacetCheckbox from "@/components/common/results/FacetCheckbox.vue";
import { computed, ref, watch } from "vue";

const emit = defineEmits(['update:facetsArray', 'updateFilterData', 'reinitializeCheckboxes']);
const props = defineProps({
  facetsArray: {
    type: Array
  },
  facet: {
    type: Object
  }
});
const marginOffset = ref(0);
const filterSearchText = ref("");

let facetItems = computed(() => {
  let filters = props.facet.checkboxes;
  // Initialisation des booleans selected pour la barre de recherche
  filters.forEach((filter) => {
    filter.selected = true;
  });
  return filters;
});
/**
 * Fonctions
 */

function searchIntoFacet() {
  facetItems.value.forEach(function (facetItem) {
    const filterLowerCase = facetItem.label.toLowerCase();
    const searchTextLowerCase = filterSearchText.value.toLowerCase();
    facetItem.selected = filterLowerCase.includes(searchTextLowerCase);
  });
}

/**
 * Watchers
 */
watch(filterSearchText, () => {
  searchIntoFacet();
});

/**
 * Emits
 */
function updateFilterData(filterData) {
  filterData.facetName = props.facet.name; // Nom de la facette
  emit("updateFilterData", filterData);
}

function reinitializeCheckboxes() {
  emit("reinitializeCheckboxes", props.facet.name);
}
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.facet-title-panel {
  gap: 10px;
  flex-wrap: wrap;
}

.v-expansion-panel-title :deep(.v-expansion-panel-title__icon) {
  order: 1;
}

.reinitialize-button {
  width: 28px;
  min-width: 28px;
  order: 3;
}

.facet-title {
  text-align: start;
  text-transform: uppercase;
  flex-grow: 2;
  order: 2;
  overflow-wrap: break-word;
  hyphens: auto;
}

.panel-text {
  overflow: auto;
  padding-left: 10px;
  max-height: 60vh;
}

.v-expansion-panel-text :deep(.v-expansion-panel-text__wrapper) {
  padding: 0;
  padding-bottom: 10px;
}

.facet-sub-menu {
  padding: 10px;
}

.facet-sub-menu:empty {
  padding: 0;
}
</style>