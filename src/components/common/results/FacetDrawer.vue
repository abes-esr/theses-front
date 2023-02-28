<template>
  <v-expansion-panels rounded>
    <v-expansion-panel>
      <v-expansion-panel-title class="checkboxes" ripple="true">
        <h3 class="facet-title">
          {{ facet.name }}
        </h3>
        <v-btn  @click.stop="" @click="reinitializeCheckboxes" class="reinitialize " density="compact" size="small" max-width="5vw" >
          Réinitialiser
        </v-btn>
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

  .checkboxes {
    display: inline-flex;
    flex-direction: row;
  }

  .facet-title {
    text-transform: capitalize;
  }

  .reinitialize {
    font-size: x-small;
    background-color:  rgb(var(--v-primary-darken-1)) !important;
  }
</style>