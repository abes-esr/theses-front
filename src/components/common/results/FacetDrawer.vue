<template>
  <v-expansion-panels rounded>
      <v-expansion-panel>
        <v-expansion-panel-title ripple="true" class="facet-title-panel">
              <h4 class="facet-title">
                {{ facet.name }}
              </h4>
              <v-btn
                @click.stop=""
                @click="reinitializeCheckboxes"
                class="reinitialize-button"
                size="small"
                depressed="true"
                elevation="0"
                color="primary"
              >
                <v-icon>mdi-reload</v-icon>
              </v-btn>
        </v-expansion-panel-title>
        <v-expansion-panel-text class="pe-0">
          <div class="facet-sub-menu">
              <facet-search-bar v-if="facet.searchBar" class="facet-search-bar"></facet-search-bar>
          </div>
          <div class="panel-text">
            <div
              v-for="facetItem in facetItems"
              :key="`facet-${facetItem.name}`"
            >
              <facet-checkbox
                :facets-array="facetsArray"
                :facet-name="facet.name"
                :facet-item="facetItem"
                @updateFacetData="updateFacetData"
                :margin-offset="marginOffset"
              />
            </div>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import FacetCheckbox from "@/components/common/results/FacetCheckbox.vue";
import FacetSearchBar from "@/components/common/results/FacetSearchBar.vue";
import { computed, ref } from "vue";
import { sortByAlphaNumericOrder } from "@/services/Common";

const emit = defineEmits(['update:facetsArray', 'updateFacetData', 'reinitializeCheckboxes']);
const props = defineProps({
  facetsArray: {
    type: Array
  },
  facet: {
    type: Object
  }
});
const marginOffset = ref(0);

let facetItems = computed(() => {
  return sortByAlphaNumericOrder(props.facet.checkboxes);
});

/**
 * Fonctions
 */
function updateFacetData(filterData) {
  filterData.facetName = props.facet.name; // Nom de la facette
  emit("updateFacetData", filterData);
}

function reinitializeCheckboxes() {
  emit("reinitializeCheckboxes", props.facet.name)
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
    //max-height: 80vh;
    height: 20vh; // #TODO bloqué à 20vh pour tests
  }

  .v-expansion-panel-text :deep(.v-expansion-panel-text__wrapper) {
    padding: 0;
  }

  .facet-sub-menu {
    padding: 10px;
  }

  .facet-sub-menu:empty {
    padding: 0;
  }
</style>