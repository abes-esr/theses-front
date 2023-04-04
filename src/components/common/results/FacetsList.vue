<template>
  <div class="facets">
    <facet-drawer date :facet="{ 'name': 'Date' }" class="my-2" @reinitializeCheckboxes="reinitializeDates"
      @updateFilterDateOnly="updateFilterDateOnly($event)"></facet-drawer>
    <facet-drawer v-for="facet in facets" :key="`facet-${facet.name}`" @updateFilterData="updateFilterData"
      @reinitializeCheckboxes="reinitializeCheckboxes" :facet="facet" :facets-array="facetsArray" class="my-2" />
    <v-btn v-if="mobile" @click="update">Appliquer les filtres</v-btn>
  </div>
</template>

<script setup>
import FacetDrawer from "@/components/common/results/FacetDrawer.vue";
import { APIService } from "@/services/StrategyAPI";
import { onMounted, ref, watch } from "vue";
import { useDisplay } from "vuetify";

const { modifierFiltres, getFacetsArrayFromURL } = APIService();

const props = defineProps({
  facets: {
    type: Object
  },
  resetFacets: {
    type: Number
  },
  filterToBeDeleted: {
    type: Object
  }
});

const { mobile } = useDisplay();
const emit = defineEmits(['update', 'searchAndReinitialize']);
const facetsArray = ref([]);
const facetsChipsArray = ref([]);

onMounted(() => {
  setTimeout(() => {
// #TODO se débarasser du timeout, récupérer les labels à la place des noms (code langues et majuscules)
    facetsArray.value = getFacetsArrayFromURL();

    facetsArray.value.forEach((facet) => {
      const filterData = {
        facetName: facet.facetName,
        filterName: facet.filterName,
        label: facet.label
      }
      addToChips(filterData);
    });

    emit('update', facetsChipsArray.value);
  }, 1000)
});

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

// Compare les chaines de caractè1 contenues dans les Array
function filtersAreEqual(object1, object2) {
  return (Object.keys(object1)[0].toLowerCase() === Object.keys(object2)[0].toLowerCase()
    && Object.values(object1)[0].toLowerCase() === Object.values(object2)[0].toLowerCase());
}

function getChipFacetItemIndex(lastFacetFilter) {
  return facetsChipsArray.value.findIndex(function (facetFilter) {
    return chipFiltersAreEqual(facetFilter, lastFacetFilter);
  });
}

function chipFiltersAreEqual(chipObject, filterObject) {
  return (chipObject.filter.facetName.toLowerCase() === Object.keys(filterObject)[0].toLowerCase()
    && chipObject.filter.filterName.toLowerCase() === Object.values(filterObject)[0].toLowerCase());
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

function clearDates() {
  //Supprime les dates précedentes
  facetsArray.value = facetsArray.value.filter(objet => {
    for (let key in objet) {
      if (key.startsWith("date")) {
        return false;
      }
    }
    return true;
  });
}
/**
 * Emit
 */

function update() {
  emit('update', facetsChipsArray.value);
  emit('closeOverlay');
}

function addToChips(filterData) {
  const chipData = {
    'label': filterData.label,
    'filter': {
      'facetName': filterData.facetName,
      'filterName': filterData.filterName
    }
  };

  facetsChipsArray.value.splice(0, 0, chipData);
}

function deleteFromChips(itemIndex) {
  facetsChipsArray.value.splice(itemIndex, 1);
}

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

    addToChips(filterData);
  } else {
    // Suppression
    let itemIndex = getFacetItemIndex(lastFacetFilter);
    if (itemIndex > -1) {
      facetsArray.value.splice(itemIndex, 1);
    }

    itemIndex = getChipFacetItemIndex(lastFacetFilter);
    if (itemIndex > -1) {
      deleteFromChips(itemIndex);
    }
  }

  modifierFiltres(facetsArray.value);
  emit('update', facetsChipsArray.value);
}

function updateFilterDateOnly(datesArray) {
  clearDates();
  //Ajoute les dates courantes dans la liste des filtres, si elles sont définies
  if (datesArray[0]) {
    facetsArray.value.splice(0, 0, { ["dateDebut"]: datesArray[0] });
  }
  if (datesArray[1]) {
    facetsArray.value.splice(0, 0, { ["dateFin"]: datesArray[1] });
  }
  modifierFiltres(facetsArray.value);
  emit('update', facetsChipsArray.value);
}

function reinitializeCheckboxes(facetName) {
  let selectedFiltersIndexes = getFacetItemsIndexes(facetName);

  selectedFiltersIndexes.reverse().forEach(function (key) {
    facetsArray.value.splice(key, 1);
    deleteFromChips(key);
  });

  modifierFiltres(facetsArray.value);
  emit('update');
}

function reinitializeDates() {
  clearDates();
  modifierFiltres(facetsArray.value);
  emit('update');
}

function resetArray(array) {
  array.splice(0, array.length);
}

/**
 * Watchers
 */
/**
 * watch: bouton réinitialiser toutes les facettes
 */
watch(() => props.resetFacets,
  () => {
    resetArray(facetsArray.value);
    resetArray(facetsChipsArray.value);
    modifierFiltres(facetsArray.value);
  });

/**
 * watch: suppression d'un v-chip
 * Nécessite un timer pour attendre la mise à jour des filtres imbriqués
 */
watch(() => props.filterToBeDeleted,
  (newValue) => {
    updateFilterData(newValue.filter);
    modifierFiltres(facetsArray.value);

    setTimeout(() => {
      emit('searchAndReinitialize');
    }, 500);
  });
</script>

<style scoped lang="scss">
@use '../../../../node_modules/vuetify/settings';

.facets {
  display: flex;
  flex-direction: column;
  padding: 1em 0;

  .v-expansion-panels {
    width: 85%;
  }

}
</style>