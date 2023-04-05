<template>
  <div class="facets">
    <facet-drawer v-if="domaine === 'theses'" date :facet="{ 'name': 'Date' }" class="my-2" @reinitializeCheckboxes="reinitializeDates"
      @updateFilterDateOnly="updateFilterDateOnly($event)"></facet-drawer>
    <facet-drawer v-for="facet in facets" :key="`facet-${facet.name}`" @updateFilterData="updateFilterData"
      @reinitializeCheckboxes="reinitializeCheckboxes" :facet="facet" :facets-array="facetsArray" class="my-2" />
    <v-btn v-if="mobile" @click="update">Appliquer les filtres</v-btn>
  </div>
</template>

<script setup>
import FacetDrawer from "@/components/common/results/FacetDrawer.vue";
import { APIService } from "@/services/StrategyAPI";
import { ref, watch } from "vue";
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
  },
  domaine: {
    type: String
  },
  parametersLoaded: {
    type: Number
  }
});

const { mobile } = useDisplay();
const emit = defineEmits(['update', 'searchAndReinitialize']);
const facetsArray = ref([]);
const facetsChipsArray = ref([]);

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

function isDateFilter(facetFilter) {
  console.info("function isfacetfilter : "+Object.keys(facetFilter)[0].startsWith("date"))
  return Object.keys(facetFilter)[0].startsWith("date");
}

// Retourne l'index de l'objet courant dans le tableau facetsArray
function getFacetItemIndex(lastFacetFilter) {
  return facetsArray.value.findIndex(function (facetFilter) {
    return isDateFilter(facetFilter) || filtersAreEqual(facetFilter, lastFacetFilter);
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

function chipFiltersAreEqual(chipObject, lastFacetFilter) {
  console.log('chipobject') //#TODO mercredi 05/04 écraser la bonne date pour les deux arrays
  console.log(chipObject) //#TODO mercredi 05/04
  console.log('lastFacetFilter') //#TODO mercredi 05/04
  console.log(lastFacetFilter) //#TODO mercredi 05/04
  console.info("isDateFilter : " + isDateFilter(lastFacetFilter) && chipObject.filter.filterName.toLowerCase() === Object.keys(lastFacetFilter)[0].toLowerCase())
  return ( isDateFilter(lastFacetFilter)
            && chipObject.filter.filterName.toLowerCase() === Object.keys(lastFacetFilter)[0].toLowerCase() )
  ||      (chipObject.filter.facetName.toLowerCase() === Object.keys(lastFacetFilter)[0].toLowerCase()
            && chipObject.filter.filterName.toLowerCase() === Object.values(lastFacetFilter)[0].toLowerCase() );
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
var chipData = {};

  if ( isDateFilter(filterData) ) {
    chipData = {
      'label': Object.values(filterData)[0],
      'filter': {
        'facetName': Object.keys(filterData)[0],
        'filterName': Object.keys(filterData)[0]
      }
    }
  } else {
    chipData = {
      'label': filterData.label,
      'filter': {
        'facetName': filterData.facetName,
        'filterName': filterData.filterName
      }
    };
  }

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
  // clearDates();
  let itemIndex = -1;
  //Ajoute les dates courantes dans la liste des filtres, si elles sont définies
  // Date début
  if (datesArray[0]) {
    const filterDateDebut  = { 'dateDebut': datesArray[0] };

    itemIndex = getFacetItemIndex(filterDateDebut);
    console.info("index " + itemIndex)
    if (itemIndex > -1) {
      facetsArray.value.splice(itemIndex, 1);
    }
    facetsArray.value.splice(0, 0, filterDateDebut);

    itemIndex = getChipFacetItemIndex(filterDateDebut);
    console.info("index chip " + itemIndex)
    if (itemIndex > -1) {
      deleteFromChips(itemIndex);
    }
    addToChips(filterDateDebut);
  }

  // Date fin
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

/**
 * Met à jour les chips selon les paramètres filtres de l'url
 */
watch(() => props.parametersLoaded, () => {
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