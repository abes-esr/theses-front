<template>
  <v-expansion-panels v-if="date || Object.keys(facet.checkboxes).length > 0" v-model="panel">
    <v-expansion-panel :value="facet.name">
      <v-expansion-panel-title class="facet-title-panel">
        <template v-slot:actions="{ expanded }">
          <v-icon :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'" size="x-large">
          </v-icon>
        </template>
        <h2 class="facet-title">
          {{ facet.name }}
        </h2>
        <v-btn @click.stop="" @click="reinitializeCheckboxes(); reinitializeFilterSearchText();" class="reinitialize-button" size="small" depressed
          elevation="0" color="surface" title="Réinitialiser">
          <v-icon>mdi-reload</v-icon>
        </v-btn>
      </v-expansion-panel-title>
      <v-expansion-panel-text class="pe-0">
        <div class="facet-sub-menu">
          <v-text-field v-if="facet.searchBar" :label='$t("rechercher")' v-model="filterSearchText" variant="outlined"
            append-inner-icon="mdi-magnify" density="compact" single-line hide-details
            class="facet-search-bar"></v-text-field>
        </div>
        <div role="list" :aria-label="'Liste des ' + facet.name" class="panel-text" ref="`facet-${facet.name}`">
          <!--          Facette date-->
          <div v-if="date" class="date-container">
            <span class="date-item">
              <p>{{ $t("results.drawer.from") }}</p>
              <vue-date-picker v-model="dateFrom" @focus="allowModification" :teleport="true" locale="fr" auto-apply
                :clearable="false" year-picker model-type="yyyy" format="yyyy" :enable-time-picker="false" text-input
                placeholder="AAAA" :start-date="startDate" :max-date="dateFromMax">
              </vue-date-picker>
            </span>
            <span class="date-item">
              <p>{{ $t("results.drawer.to") }}</p>
              <vue-date-picker v-model="dateTo" @focus="allowModification" :teleport="true" locale="fr" auto-apply
                :clearable="false" year-picker model-type="yyyy" format="yyyy" :enable-time-picker="false"
                start-date="2020" text-input placeholder="AAAA" :max-date="dateToMax" :min-date="dateToMin">
              </vue-date-picker>
            </span>
          </div>
          <!--          Fin Facette date-->
          <!--          Facettes texte-->
          <div role="listitem" v-else v-for="(facetItem, index) in facetItems" :key="`facet-${facetItem.name}`">
            <CommonResultsFacetCheckbox v-if="facetItem.selected" :key="`${facet.name}-value-${index}`"
              :selected-facets-array="selectedFacetsArray" :facet-name="facet.name" :facet-item="facetItem"
              @updateFilterData="updateFilterDataFromDrawer" :margin-offset="marginOffset" />
          </div>
        </div>
        <!--          Fin Facettes texte-->
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const { reinitializeFacetFilters, updateFilterData, addOrOverwriteDate, setWorkingFacetName } = useStrategyAPI();
const emit = defineEmits(['reinitializePageNumber']);
const props = defineProps({
  selectedFacetsArray: {
    type: Array,
    default: []
  },
  facet: {
    type: Object,
    default: {}
  },
  date: {
    type: Boolean,
    default: false
  },
  resetTextFields: {
    type: Number,
    default: 0
  }
});

const marginOffset = ref(0);
const filterSearchText = ref("");

const dateFrom = ref();
const startDate = ref("1980");
const dateTo = ref(new Date().getFullYear());
const resetIsSet = ref(true);

let dateFromMax = computed(() => {
  return dateTo.value && (dateTo.value <= (new Date()).getFullYear())
    ? new Date(dateTo.value + '-12-31')
    : new Date();
});

let dateToMin = computed(() => {
  return dateFrom.value
    ? new Date(dateFrom.value + '-01-01')
    : new Date('1965-01-01');
});

let dateToMax = computed(() => {
  return new Date();
});

/**
 * Initialisation
 */

//Pour avoir le panel "Statut" et "Rôles" ouvert par défaut
const panel = ref(["Statut", "Rôles"])

let facetItems = computed(() => {
  if (props.date)
    return "";
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
    const filterLowerCase = removeAccents(facetItem.label.toLowerCase());
    const searchTextLowerCase = filterSearchText.value.toLowerCase();
    facetItem.selected = filterLowerCase.includes(removeAccents(searchTextLowerCase));
  });
}

// Fonction pour enlever les accents d'une chaîne de caractères
function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function updateFilterDataFromDrawer(filterData) {
  filterData.facetName = props.facet.name; // Nom de la facette
  updateFilterData(filterData);
  emit('reinitializePageNumber');
}

function reinitializeDateFields() {
  if (props.date)
    dateFrom.value = dateTo.value = "";
}

function reinitializeFilterSearchText() {
  filterSearchText.value = "";
}

function reinitializeCheckboxes() {
  emit('reinitializePageNumber');
  setWorkingFacetName("");

  if (props.date) {
    reinitializeDateFields();
    updateFilterDateOnly();
  } else {
    reinitializeFacetFilters(props.facet.name);
    if (props.date) {
      reinitializeFilterSearchText();
    }
  }
}

function fillDateDrawerFields() {
  if (props.date) {
    props.selectedFacetsArray.forEach((filter) => {
      if (filter.datedebut) {
        dateFrom.value = filter.datedebut;
      } else if (filter.datefin) {
        dateTo.value = filter.datefin;
      } else if (filter.facetName === "datedebut") {
        dateFrom.value = filter.label;
      } else if (filter.facetName === "datefin") {
        dateTo.value = filter.label;
      }
    });

    // Réinitialiser les valeurs de dates si non sélectionnées dans le tableau ou réinitialisées
    let dateDebutSelected = props.selectedFacetsArray.filter((filter) => {
      return (filter.datedebut || filter.facetName === "datedebut")
    });
    let dateFinSelected = props.selectedFacetsArray.filter((filter) => {
      return (filter.datefin || filter.facetName === "datefin")
    });

    if (dateDebutSelected.length < 1) {
      dateFrom.value = "";
    }

    if (dateFinSelected.length < 1) {
      dateTo.value = "";
    }
  }
}

function allowModification() {
  resetIsSet.value = false;
}

function updateFilterDateOnly() {
  setWorkingFacetName('');
  //Ajoute les dates courantes dans la liste des filtres, si elles sont définies
  addOrOverwriteDate([dateFrom.value, dateTo.value]);
  emit('reinitializePageNumber');
}

/**
 * Watchers
 */
watch(() => dateFrom.value,
  () => {
    if (!resetIsSet.value) {
      updateFilterDateOnly();
    }
  });

watch(() => dateTo.value,
  () => {
    if (!resetIsSet.value) {
      updateFilterDateOnly();
    }
  });

watch(filterSearchText, () => {
  searchIntoFacet();
});
/**
 * Initialisation des valeurs dates depuis chargées l'url et mise à jour
 */
watch(() => props.selectedFacetsArray,
  () => {
    fillDateDrawerFields();
  });

watch(() => props.resetTextFields,
  () => {
    reinitializeFilterSearchText();
  })
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.v-expansion-panel {
  border-radius: 0;
}

.v-expansion-panel-title {
  gap: 10px;
  flex-wrap: nowrap;
  padding: 0 10px;
  overflow: hidden;
  border-radius: unset;
}

.v-expansion-panel--active>.v-expansion-panel-title {
  min-height: 48px;
}

.v-expansion-panel-title:hover>.v-expansion-panel-title__overlay {
  opacity: 1 !important;
  background-color: rgb(var(--v-theme-surface));
}

.v-expansion-panel :deep(.v-expansion-panel__shadow) {
  box-shadow: none;
}

.v-expansion-panel-title :deep(.v-expansion-panel-title__icon) {
  order: 1;
  color: rgb(var(--v-theme-primary));
}

.reinitialize-button {
  width: 28px;
  min-width: 28px;
  order: 3;
}

.facet-title {
  text-align: start;
  overflow: hidden;
  flex-grow: 2;
  order: 2;
  background-color: transparent;
  padding-top: 5px;
  padding-bottom: 5px;
  font-family: Roboto-Medium, sans-serif;
  font-weight: 600;
  font-size: 15px;
  color: rgba(var(--v-theme-primary));
  opacity: 0.9;
}

.facet-search-bar {
  :deep(.v-field__outline) {
    --v-field-border-opacity: 1;
  }

  :deep(.v-label) {
    opacity: 1 !important;
  }
}

.panel-text {
  overflow: auto;
  padding: 0 10px;
  max-height: 60vh;
}

.v-expansion-panel-text :deep(.v-expansion-panel-text__wrapper) {
  padding: 10px 0 10px;
}

.v-expansion-panel-title--active :deep(.v-expansion-panel-title__overlay) {
  opacity: 0;
}

.facet-sub-menu {
  padding: 0 10px 10px;
}

.facet-sub-menu:empty {
  padding: 0;
}

.date-container {
  display: flex;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    flex-direction: column;
  }
}

.date-item {
  flex: 1;
  padding-right: 5px;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    padding: 0 0;
    display: grid;
    grid-template-columns: 1fr 5fr;
    align-items: center;
    margin-bottom: 5px;
  }

  p {
    @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
      text-align: center;
    }
  }
}
</style>

<style>
.dp__arrow_bottom {
  display: none !important;
}

.dp__arrow_top {
  display: none !important;
}

:deep(.dp__arrow_bottom) {
  display: none !important;
}

:deep(.dp__arrow_top) {
  display: none !important;
}

.v-field__field>.v-label {
  font-size: 17px !important;
  font-family: Roboto-Medium, sans-serif;
  font-weight: 500;
}

.dp__input {
  padding: 3px 0 3px 35px;
  font-size: 14px;
}
</style>