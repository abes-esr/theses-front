<template>
  <v-expansion-panels rounded>
    <v-expansion-panel>
      <v-expansion-panel-title ripple="true">
        <v-row justify="space-between" align="center">
          <v-col cols="7">
            <h4 class="facet-title">
              {{ facet.name }}
            </h4>
          </v-col>
          <v-col cols="2">
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
          </v-col>
          <v-col cols="1"></v-col>
        </v-row>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
<!--        <facet-search-bar></facet-search-bar> #TODO -->
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
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import FacetCheckbox from "@/components/common/results/FacetCheckbox.vue";
// import SearchBar from "@/components/generic/GenericSearchBar.vue";
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
</style>