<template>
  <div class="facets">
      <facet-drawer
        v-for="facet in facets"
        :key="`facet-${facet.name}`"
        @updateFacetData="updateFacetData"
        :facet="facet"
        :facets-array="facetsArray"
        class="my-3"
      />
  </div>
</template>

<script setup>
import FacetDrawer from "@/components/common/results/FacetDrawer.vue";

const props = defineProps({
  facetsArray: {
    type: Array
  },
  facets: {
    type: Object
  }
});

const emit = defineEmits(['update:facetsArray', 'updateFacetData']);

/**
 * Functions
 */
function updateFacetData(facetData) {
  emit("updateFacetData", facetData);
}
</script>

<style scoped lang="scss">
@use '../../../../node_modules/vuetify/settings';

.facets {
  display: flex;
  flex-direction: column;
  padding-top: 2rem;

  .v-expansion-panels {
    width: 80%;
  }
}
</style>