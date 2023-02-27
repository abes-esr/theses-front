<template>
  <div class="facets">
      <facet-drawer
        v-for="facet in facets"
        :key="`facet-${facet.name}`"
        @updateFacetData="updateFacetData"
        :facet="facet"
        :facets-array="facetsArray"
        class="my-3"
      />
  </div>
</template>

<script setup>
import FacetDrawer from "@/components/common/results/FacetDrawer.vue";
import { reactive } from "vue";
import { thesesAPIService } from "@/services/ThesesAPI";
const { modifierFiltres } = thesesAPIService();

defineProps({
  facets: {
    type: Object
  }
});

// const facetsArray = reactive([]);
let facetsArray = [];

/**
 * Fonctions
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
    facetsArray.splice(0,0, lastFacetFilter)
  } else {
    const itemIndex = getFacetItemIndex(lastFacetFilter);
    facetsArray.splice(itemIndex, 1);
  }

  modifierFiltres(facetsArray);

  console.log(lastFacetFilter)
  console.info("Filtres sélectionnés :")
  console.log(facetsArray)
}

// checkbox cochée
function isChecked(facetData, lastFacetFilter) {
  return facetData.value && !arrayContainsFilter(lastFacetFilter);
}

// Retourne l'index de l'objet courant dans le tableau facetsArray
function getFacetItemIndex(lastFacetFilter) {
  return facetsArray.findIndex(function(facetFilter) {
    console.info(facetFilter);
    return filtersAreEqual(facetFilter, lastFacetFilter);
  });
}

// Compare les chaines de caractères contenues dans les Array
function filtersAreEqual(object1, object2) {
  return  ( Object.keys(object1)[0] === Object.keys(object2)[0]
    && Object.values(object1)[0] === Object.values(object2)[0] );
}

function arrayContainsFilter(lastFacetFilter) {
  const countOccurrences = facetsArray.filter(function(facetFilter) {
    return filtersAreEqual(facetFilter, lastFacetFilter)
  }).length;

  return countOccurrences > 0;
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