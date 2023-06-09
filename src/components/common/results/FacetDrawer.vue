<template>
  <v-expansion-panels v-if="date || Object.keys(facet.checkboxes).length > 0">
    <v-expansion-panel class="elevation-0">
      <v-expansion-panel-title class="facet-title-panel">
        <template v-slot:actions="{ expanded }">
          <v-icon :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'" size="x-large">
          </v-icon>
        </template>
        <h3 class="facet-title">
          {{ facet.name }}
        </h3>
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
          <div v-if="date" class="date-container">
            <span class="date-item">
              <p>{{ $t("results.drawer.from") }}</p>
              <vue-date-picker v-model="dateFrom" @update:model-value="updateFilterDateOnly" :teleport="true" locale="fr" auto-apply
                :clearable="false" year-picker model-type="yyyy" format="yyyy" :enable-time-picker="false" text-input
                placeholder="AAAA" :max-date="dateFromMax" :teleport-center="teleportCenter">
              </vue-date-picker>
            </span>
            <span class="date-item">
              <p>{{ $t("results.drawer.to") }}</p>
              <vue-date-picker v-model="dateTo" @update:model-value="updateFilterDateOnly" :teleport="true" locale="fr" auto-apply
                :clearable="false" year-picker model-type="yyyy" format="yyyy" :enable-time-picker="false" text-input
                placeholder="AAAA" :max-date="dateToMax" :min-date="dateToMin" :teleport-center="teleportCenter">
              </vue-date-picker>
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
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
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
    type: Number
  }
});

const marginOffset = ref(0);
const filterSearchText = ref("");

const dateFrom = ref();
const dateTo = ref(new Date().getFullYear());

let dateFromMax = computed(() => {
  return dateTo.value && (dateTo.value <= (new Date()).getFullYear())
    ? new Date(dateTo.value + '-12-31')
    : new Date();
});

let dateToMin = computed(() => {
  return dateFrom.value
    ? new Date(dateFrom.value + '-01-01')
    : new Date('1900-01-01');
});

let dateToMax = computed(() => {
  return new Date();
});

const teleportCenter = ref(mobile);

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
    const filterLowerCase = facetItem.label;
    const searchTextLowerCase = filterSearchText.value;
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

function updateFilterDateOnly() {
  emit("updateFilterDateOnly", [dateFrom.value, dateTo.value]);
}

function reinitializeDateFields() {
  if (props.date)
    dateFrom.value = dateTo.value = "";
}

function reinitializeCheckboxes() {
  if(props.date) {
    reinitializeDateFields();
    updateFilterDateOnly();
  } else {
    emit("reinitializeCheckboxes", props.facet.name);
  }
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
  flex-grow: 2;
  order: 2;
  background-color: transparent;
  padding-top: 5px;
  padding-bottom: 5px;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    font-size: 15px;
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

.facet-title-panel {
  background-color: rgb(var(--v-theme-gris-clair));
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

.v-field__field > .v-label {
  font-size: 17px !important;
  font-family: Roboto-Medium, sans-serif;
  font-weight: 500;
}

.dp__input {
  padding: 3px 0 3px 35px;
  font-size: 14px;
}
</style>