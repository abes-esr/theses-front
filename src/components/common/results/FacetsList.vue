<template>
  <div class="facets">
    <facet-drawer v-if="domaine === 'theses' && Object.keys(facets).length > 0" date key="facet-date"
                  :facet="{ 'name': 'Date' }" :facets-array="facetsArray" :parameters-loaded="parametersLoaded"
                  :reinitialize-date-fields-trigger="reinitializeDateFieldsTrigger"
                  :reinitialize-date-from-trigger="reinitializeDateFromTrigger"
                  :reinitialize-date-to-trigger="reinitializeDateToTrigger" @updateFilterDateOnly="updateFilterDateOnly($event)"
                  @reinitializeCheckboxes="reinitializeDates">
    </facet-drawer>
    <facet-drawer v-for="facet in facets" :key="`facet-${facet.name}`" :facet="facet"
                  :facets-array="facetsArray" @updateFilterData="updateFilterData" @reinitializeCheckboxes="reinitializeCheckboxes">
    </facet-drawer>
    <v-btn v-if="mobile" class="filters-btn" @click="update">Appliquer les filtres</v-btn>
    <v-skeleton-loader v-if="loading" v-for="i in 6" :key="i" type="list-item" class="skeleton"></v-skeleton-loader>
  </div>
</template>

<script setup>
import FacetDrawer from "@/components/common/results/FacetDrawer.vue";
import { APIService } from "@/services/StrategyAPI";
import { ref, watch } from "vue";
import { useDisplay } from "vuetify";

const { setCheckedFilters, getFacetsArrayFromURL, setWorkingFacetName } = APIService();

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
const emit = defineEmits(['update', 'searchAndReinitialize', 'loadChips']);
const facetsArray = ref([]);
const facetsChipsArray = ref([]);
const reinitializeDateFieldsTrigger = ref(0);

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
  return Object.keys(facetFilter)[0].startsWith("date");
}

// Retourne l'index de l'objet courant dans le tableau facetsArray
function getFacetItemIndex(lastFacetFilter) {
  return facetsArray.value.findIndex(function (facetFilter) {
    return filtersAreEqual(facetFilter, lastFacetFilter);
  });
}

/**
 * Compare les chaines de caractères contenues dans les Array
 * Pour les dates on ne compare que le nom du filtre ( datedebut | datefin )
 * @param comparedObject
 * @param currentObject
 * @returns {boolean}
 */
function filtersAreEqual(comparedObject, currentObject) {
  return (isDateFilter(currentObject)
      && Object.keys(comparedObject)[0] === Object.keys(currentObject)[0])
    || (Object.keys(comparedObject)[0] === Object.keys(currentObject)[0]
      && Object.values(comparedObject)[0] === Object.values(currentObject)[0]);
}

function getChipFacetItemIndex(lastFacetFilter) {
  return facetsChipsArray.value.findIndex(function (facetFilter) {
    return chipFiltersAreEqual(facetFilter, lastFacetFilter);
  });
}

function chipFiltersAreEqual(comparedChipObject, currentObject) {
  return (isDateFilter(currentObject)
      && comparedChipObject.filter.filterName === Object.keys(currentObject)[0])
    || (comparedChipObject.filter.facetName === Object.keys(currentObject)[0]
      && comparedChipObject.filter.filterName === Object.values(currentObject)[0]);
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

function getFacetChipsItemsIndexes(facetName) {
  let selectedFiltersIndexes = [];

  facetsChipsArray.value.forEach(function (facetFilter, index) {
    if (facetFilter.filter.facetName === facetName) {
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

function handleSpecialCase(label) {
  if (label === "enCours") return  "En préparation";
  if (label === "soutenue") return  "Soutenues";
  return label;
}

function addToChips(filterData) {
  let chipData = {};

  if (isDateFilter(filterData)) {
    chipData = {
      'label': Object.values(filterData)[0],
      'filter': {
        'facetName': Object.keys(filterData)[0],
        'filterName': Object.keys(filterData)[0]
      }
    };
  } else {
    // Cas Particuliers
    filterData.label = handleSpecialCase(filterData.label);

    chipData = {
      'label': filterData.label,
      'filter': {
        'facetName': filterData.facetName,
        'filterName': filterData.filterName
      }
    };
  }

  facetsChipsArray.value.splice(facetsChipsArray.value.length, 0, chipData);
}

function deleteFromChips(itemIndex) {
  facetsChipsArray.value.splice(itemIndex, 1);
}

function deleteFromFilters(itemIndex) {
  facetsArray.value.splice(itemIndex, 1);
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
    addToFilters(lastFacetFilter);
    addToChips(filterData);
  } else {
    // Suppression
    let itemIndex = getFacetItemIndex(lastFacetFilter);
    if (itemIndex > -1) {
      deleteFromFilters(itemIndex);
    }

    itemIndex = getChipFacetItemIndex(lastFacetFilter);
    if (itemIndex > -1) {
      deleteFromChips(itemIndex);
    }
  }

  setCheckedFilters(facetsArray.value);
  emit('update', facetsChipsArray.value);
}

/**
 * WorkingFacetName est la facette qui est en cours d'utilisation/séléction
 * @param filterObject
 */
function addToFilters(filterObject) {
  setWorkingFacetName(Object.keys(filterObject)[0]);
  facetsArray.value.splice(0, 0, filterObject);
}

function addOrOverwriteDate(datesArray) {
  let dateFiltersNames = [
    'datedebut',
    'datefin'
  ];

  datesArray.forEach((dateData, key) => {
    const filterDateDebut = { [dateFiltersNames[key]]: dateData };
    let itemIndex = -1;

    itemIndex = getFacetItemIndex(filterDateDebut);
    if (itemIndex > -1) {
      deleteFromFilters(itemIndex);
    }

    itemIndex = getChipFacetItemIndex(filterDateDebut);
    if (itemIndex > -1) {
      deleteFromChips(itemIndex);
    }

    if (Object.values(filterDateDebut)[0]) {
      addToFilters(filterDateDebut);
      addToChips(filterDateDebut);
    }
  });
}

function updateFilterDateOnly(datesArray) {
  //Ajoute les dates courantes dans la liste des filtres, si elles sont définies
  addOrOverwriteDate(datesArray);

  setCheckedFilters(facetsArray.value);
  emit('update', facetsChipsArray.value);
}

function reinitializeCheckboxes(facetName) {
  let selectedFiltersIndexes = getFacetItemsIndexes(facetName);
  // Facettes
  selectedFiltersIndexes.reverse().forEach(function (key) {
    facetsArray.value.splice(key, 1);
  });

  // Chips
  selectedFiltersIndexes = getFacetChipsItemsIndexes(facetName);
  selectedFiltersIndexes.reverse().forEach(function (key) {
    deleteFromChips(key);
  });

  setCheckedFilters(facetsArray.value);
  emit('update');
}

function reinitializeDates() {
  clearDates();
  setCheckedFilters(facetsArray.value);
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
    reinitializeDateFieldsTrigger.value++;
    resetArray(facetsArray.value);
    resetArray(facetsChipsArray.value);
    setCheckedFilters(facetsArray.value);
  });

/**
 * watch: suppression d'un v-chip
 * Nécessite un timer pour attendre la mise à jour des filtres imbriqués
 */
watch(() => props.filterToBeDeleted,
  (newValue) => {
    updateFilterData(newValue.filter);
    setCheckedFilters(facetsArray.value)
  });

/**
 * Met à jour les chips selon les paramètres filtres de l'url
 */
watch(() => props.parametersLoaded, () => {
  facetsArray.value = getFacetsArrayFromURL();

  if (Object.keys(facetsArray.value).length > 0) {
    facetsArray.value.forEach((facet) => {
      const filterData = {
        facetName: facet.facetName,
        filterName: facet.filterName,
        label: facet.label
      };
      addToChips(filterData);
    });

    emit('loadChips', facetsChipsArray.value);
  }
});

</script>

<style scoped lang="scss">
@use '../../../../node_modules/vuetify/settings';

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