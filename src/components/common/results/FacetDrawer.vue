<template>
  <v-expansion-panels>
    <v-expansion-panel class="elevation-0">
      <v-expansion-panel-title class="facet-title-panel">
        <h4 class="facet-title">
          {{ facet.name }}
        </h4>
        <v-btn @click.stop="" @click="reinitializeCheckboxes" class="reinitialize-button" size="small" depressed
          elevation="0" color="primary">
          <v-icon>mdi-reload</v-icon>
        </v-btn>
      </v-expansion-panel-title>
      <v-expansion-panel-text class="pe-0">
        <div class="facet-sub-menu">
          <v-text-field v-if="facet.searchBar" :label='$t("rechercher")' v-model="filterSearchText" variant="outlined"
            append-inner-icon="mdi-magnify" density="compact" single-line hide-details
            class="facet-search-bar"></v-text-field>
        </div>
        <div class="panel-text" ref="`facet-${facet.name}`">
          <div v-if="date" class="flex-container">
            <span class="flex-item">
              {{ $t("results.drawer.from") }}<VueDatePicker v-model="dateFrom" :teleport="true" locale="fr" auto-apply :clearable="false" year-picker
                model-type="yyyy" format="yyyy" :enable-time-picker="false" text-input placeholder="AAAA">
              </VueDatePicker>
            </span>
            <span class="flex-item pl-4 pr-4">
              {{ $t("results.drawer.to") }}<VueDatePicker v-model="dateTo" :teleport="true" locale="fr" auto-apply :clearable="false" year-picker
                model-type="yyyy" format="yyyy" :enable-time-picker="false" text-input placeholder="AAAA">
              </VueDatePicker>
            </span>
          </div>
          <div v-else v-for="(facetItem, index) in facetItems" :key="`facet-${facetItem.name}`">
            <facet-checkbox v-if="facetItem.selected" :key="`${facet.name}-value-${index}`" :facets-array="facetsArray"
              :facet-name="facet.name" :facet-item="facetItem" @updateFilterData="updateFilterData"
              :margin-offset="marginOffset" />
          </div>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import FacetCheckbox from "@/components/common/results/FacetCheckbox.vue";
import { computed, ref, watch } from "vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const emit = defineEmits(['update:facetsArray', 'updateFilterData', 'updateFilterDateOnly', 'reinitializeCheckboxes']);
const props = defineProps({
  facetsArray: {
    type: Array
  },
  facet: {
    type: Object
  },
  date: {
    type: Boolean,
    default: false
  },
  reinitializeDateFieldsTrigger: {
    type: Number
  },
  reinitializeDateFromTrigger: {
    type: Number
  },
  reinitializeDateToTrigger: {
    type: Number
  },
  parametersLoaded: {
    type:Number
  }
});

const marginOffset = ref(0);
const filterSearchText = ref("");

const dateFrom = ref();
const dateTo = ref(new Date().getFullYear());

/**
 * Initialisation
 */

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

fillDateDrawerFields();

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

watch(dateFrom, () => {
  updateFilterDateOnly();
});

watch(dateTo, () => {
  updateFilterDateOnly();
});

/**
 * Emits
 */
function updateFilterData(filterData) {
  filterData.facetName = props.facet.name; // Nom de la facette
  emit("updateFilterData", filterData);
}

function updateFilterDateOnly() {
  emit("updateFilterDateOnly", [dateFrom.value, dateTo.value]);
}

function reinitializeDateFields() {
  if (props.date)
    dateFrom.value = dateTo.value = "";
}

function reinitializeCheckboxes() {
  reinitializeDateFields();
  emit("reinitializeCheckboxes", props.facet.name);
}

function reinitializeDateFromField() {
  if (props.date)
    dateFrom.value = "";
}

function reinitializeDateToField() {
  if (props.date)
    dateTo.value = "";
}

/**
 * Watchers
 */
watch(() => props.reinitializeDateFieldsTrigger,
  () => {
  reinitializeDateFields();
});

watch(() => props.reinitializeDateFromTrigger,
  () => {
    reinitializeDateFromField();
  });

watch(() => props.reinitializeDateToTrigger,
  () => {
    reinitializeDateToField();
  });

function fillDateDrawerFields() {
  if (props.date) {
    props.facetsArray.forEach((filter) => {
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
  }
}

/**
 * Initialisation des valeurs dates depuis chargées l'url
 */
watch(() => props.parametersLoaded,
  () => {
      fillDateDrawerFields();
  });
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.v-expansion-panel-title {
  gap: 10px;
  flex-wrap: nowrap;
  padding: 0 10px;
  overflow: hidden;
}

.v-expansion-panel :deep(.v-expansion-panel__shadow) {
  box-shadow: none;
}

.v-expansion-panel-title :deep(.v-expansion-panel-title__icon) {
  order: 1;
  color: rgb(var(--v-theme-orange-abes));
}

.reinitialize-button {
  width: 28px;
  min-width: 28px;
  order: 3;
}

.facet-title {
  text-align: start;
  text-transform: uppercase;
  overflow: hidden;
  font-size: 16px;
  flex-grow: 2;
  order: 2;
  background-color: transparent;
  //hyphens: auto;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    font-size: 13px;
  }
}

.panel-text {
  overflow: auto;
  padding-left: 10px;
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

.facet-title-panel {
  background-color: rgb(var(--v-theme-gris-clair));
}

.flex-container {
  display: flex;
}

.flex-item {
  flex: 1;
}

:deep(.dp__input) {
  font-size: 0.9rem !important;
  padding-left: 30px;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-right: 2px;
}
</style>