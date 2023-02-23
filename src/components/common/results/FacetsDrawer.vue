<template>
  <v-expansion-panels rounded>
    <v-expansion-panel>
      <v-expansion-panel-title class="checkboxes">
        {{ facet.name }}
      </v-expansion-panel-title>
      <v-expansion-panel-text>
<!--        <search-bar-facet></search-bar-facet> #TODO -->
        <div
          v-for="facetItem in facetItems"
          :key="`facet-${facetItem.name}`"
        >
          <facet-checkbox :facet-item="facetItem" :margin-offset="marginOffset" />
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import FacetCheckbox from "@/components/common/results/FacetCheckbox.vue";
// import SearchBar from "@/components/generic/GenericSearchBar.vue";
import { ref } from 'vue';

const marginOffset = ref(0);

const props = defineProps({
  facet: {
    type: Object
  }
})

const facetItems = props.facet.checkboxes;
</script>

<style scoped>
  .checkboxes {
    text-transform: capitalize;
  }
</style>