<template>
  <v-expansion-panels rounded>
      <v-expansion-panel>
        <v-expansion-panel-title ripple="true">
              <h4 class="facet-title">
                {{ facet.name }}
              </h4>
        </v-expansion-panel-title>
        <v-expansion-panel-text class="pe-0">
          <div class="facet-sub-menu">
              <v-btn
                @click.stop=""
                @click="reinitializeCheckboxes"
                class="reinitialize"
                depressed="true"
                elevation="0"
                color="primary"
              >
                <v-icon>mdi-reload</v-icon>
              </v-btn>
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

  .facet-header {
    align-items: center;
  }

  .facet-title {
    text-transform: capitalize;
  }

  .reinitialize {
    width: 36px;
    min-width: 36px;
  }

  .panel-text {
    overflow: auto;
    padding-left: 10px;
    //max-height: 80vh;
    height: 20vh;
  }

  .v-expansion-panel-text :deep(.v-expansion-panel-text__wrapper) {
    padding-right: 0;
    padding-bottom: 0;
    padding-left: 0;
  }

  .facet-search-bar {
    width: 60%;
    margin-left: 10px;
  }

  .facet-sub-menu {
    width: 100%;
    padding: 10px;
    padding-top: 0px;
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
  }
</style>