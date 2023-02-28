<template>
  <div class="facets">
      <facet-drawer
        v-for="facet in facets"
        :key="`facet-${facet.name}`"
        @updateFacetData="updateFacetData"
        @reinitializeCheckboxes="reinitializeCheckboxes"
        :facet="facet"
        :facets-array="facetsArray"
        class="my-3"
      />
  </div>
</template>

<script setup>
import FacetDrawer from "@/components/common/results/FacetDrawer.vue";
// import { reactive } from "vue";
import { thesesAPIService } from "@/services/ThesesAPI";
import { ref } from "vue";

const { modifierFiltres } = thesesAPIService();

defineProps({
  facets: {
    type: Object
  }
});

const facetsArray = ref([]);

/**
 * Fonctions
 */

/**
 * checkbox cochée
 * @Param facetData
 * @Param lastFacetFilter mise en forme de facetData
 */
function isChecked(facetData, lastFacetFilter) {
  return facetData.value && !arrayContainsFilter(lastFacetFilter);
}

// Retourne l'index de l'objet courant dans le tableau facetsArray
function getFacetItemIndex(lastFacetFilter) {
  return facetsArray.value.findIndex(function(facetFilter) {
    return filtersAreEqual(facetFilter, lastFacetFilter);
  });
}

// Compare les chaines de caractères contenues dans les Array
function filtersAreEqual(object1, object2) {
  return  ( Object.keys(object1)[0] === Object.keys(object2)[0]
    && Object.values(object1)[0] === Object.values(object2)[0] );
}

function arrayContainsFilter(lastFacetFilter) {
  const countOccurrences = facetsArray.value.filter(function(facetFilter) {
    return filtersAreEqual(facetFilter, lastFacetFilter)
  }).length;
  return countOccurrences > 0;
}


function getFacetItemsIndexes(facetName) {
  let selectedFiltersIndexes = [];

  facetsArray.value.forEach(function(facetFilter, index) {
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
 * @param facetData objet contenant le nom de la facette et de son filtre correspondant
 */
function updateFacetData(facetData) {
  const lastFacetFilter =
    {
      [facetData.facetName]: facetData.filterName
    };

  if(isChecked(facetData, lastFacetFilter)) {
    // Ajout
    facetsArray.value.splice(0,0, lastFacetFilter)
  } else {
    // Suppression
    const itemIndex = getFacetItemIndex(lastFacetFilter);
    if( itemIndex > -1 ) {
      facetsArray.value.splice(itemIndex, 1);
    }
  }

  console.info(facetsArray.value)

  modifierFiltres(facetsArray.value);
}

function reinitializeCheckboxes(facetName) {
  let selectedFiltersIndexes = getFacetItemsIndexes(facetName);

  selectedFiltersIndexes.reverse().forEach(function(key) {
    facetsArray.value.splice(key, 1);
  });

  modifierFiltres(facetsArray.value)
}
</script>

<style scoped lang="scss">
@use '../../../../node_modules/vuetify/settings';

.facets {
  display: flex;
  flex-direction: column;
  padding-top: 2rem;

  .v-expansion-panels {
    width: 80%;
  }
}
</style>