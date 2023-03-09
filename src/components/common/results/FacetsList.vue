<template>
  <div class="facets">
    <facet-drawer v-for="facet in facets" :key="`facet-${facet.name}`" @updateFilterData="updateFilterData"
      @reinitializeCheckboxes="reinitializeCheckboxes" :facet="facet" :facets-array="facetsArray" class="my-3" />
  </div>
</template>

<script setup>
import FacetDrawer from "@/components/common/results/FacetDrawer.vue";
import { StrategyAPI } from "@/services/StrategyAPI";
import { ref, watch } from "vue";

const { modifierFiltres } = StrategyAPI();

const props = defineProps({
  facets: {
    type: Object
  },
  resetFacets: {
    type: Number
  }
});

const emit = defineEmits(['update', 'searchAndReinitialize']);
const facetsArray = ref([]);

/**
 * Fonctions
 */

/**
 * checkbox cochée
 * @Param filterData
 * @Param lastFacetFilter mise en forme de filterData
 */
function isChecked(filterData, lastFacetFilter) {
  return filterData.value && !arrayContainsFilter(lastFacetFilter);
}

// Retourne l'index de l'objet courant dans le tableau facetsArray
function getFacetItemIndex(lastFacetFilter) {
  return facetsArray.value.findIndex(function (facetFilter) {
    return filtersAreEqual(facetFilter, lastFacetFilter);
  });
}

// Compare les chaines de caractères contenues dans les Array
function filtersAreEqual(object1, object2) {
  return (Object.keys(object1)[0] === Object.keys(object2)[0]
    && Object.values(object1)[0] === Object.values(object2)[0]);
}

function arrayContainsFilter(lastFacetFilter) {
  const countOccurrences = facetsArray.value.filter(function (facetFilter) {
    return filtersAreEqual(facetFilter, lastFacetFilter);
  }).length;
  return countOccurrences > 0;
}


function getFacetItemsIndexes(facetName) {
  let selectedFiltersIndexes = [];

  facetsArray.value.forEach(function (facetFilter, index) {
    if (Object.keys(facetFilter)[0] === facetName) {
      selectedFiltersIndexes.push(index);
    }
  });
  return selectedFiltersIndexes;
}
/**
 * Emit
 */
/**
 * Met à jour l'Array contenant les filtres sélectionnés.
 * Met à plat les niveaux de récursivité en utilisant le nom de la facette en clé dans tous les cas
 * @param filterData objet contenant le nom de la facette et de son filtre correspondant
 */
function updateFilterData(filterData) {
  const lastFacetFilter =
  {
    [filterData.facetName]: filterData.filterName
  };

  if (isChecked(filterData, lastFacetFilter)) {
    // Ajout
    facetsArray.value.splice(0, 0, lastFacetFilter);
  } else {
    // Suppression
    const itemIndex = getFacetItemIndex(lastFacetFilter);
    if (itemIndex > -1) {
      facetsArray.value.splice(itemIndex, 1);
    }
  }
  modifierFiltres(facetsArray.value);
}

function reinitializeCheckboxes(facetName) {
  let selectedFiltersIndexes = getFacetItemsIndexes(facetName);

  selectedFiltersIndexes.reverse().forEach(function (key) {
    facetsArray.value.splice(key, 1);
  });

  modifierFiltres(facetsArray.value);
  emit('update');
}

function resetArray(array) {
  array.splice(0, array.length);
}

/**
 * Watchers
 */
watch(() => props.resetFacets,
  () => {
    resetArray(facetsArray.value);
    modifierFiltres(facetsArray.value);
    // emit('searchAndReinitialize');
  });
</script>

<style scoped lang="scss">
@use '../../../../node_modules/vuetify/settings';

.facets {
  display: flex;
  flex-direction: column;
  padding-top: 2rem;

  .v-expansion-panels {
    width: 80%;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
      width: 100%;
    }
  }

}
</style>