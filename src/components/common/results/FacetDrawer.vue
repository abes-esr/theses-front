<template>
  <v-expansion-panels rounded variant="popout">
    <v-expansion-panel>
      <v-expansion-panel-title class="checkboxes">
        {{ facet.name }}
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

const marginOffset = ref(0);
const facetItems = props.facet.checkboxes;

const emit = defineEmits(['update:facetsArray', 'updateFacetData']);
const props = defineProps({
    facetsArray: {
      type: Array
    },
    facet: {
      type: Object
    }
  });

/**
 * Fonctions
 */
function updateFacetData(filterData) {
  filterData.facetName = props.facet.name;
  emit("updateFacetData", filterData);
}
</script>

<style scoped>
  .checkboxes {
    text-transform: capitalize;
  }
</style>