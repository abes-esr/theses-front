<template>
  <div class="facets">
      <facet-drawer
        v-for="facet in facets"
        :key="`facet-${facet.name}`"
        @updateFacetData="updateFacetData"
        :facet="facet"
        class="my-3"
      />
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { thesesAPIService } from "@/services/ThesesAPI";
import FacetDrawer from "@/components/common/results/FacetsDrawer.vue";

const props = defineProps({
  facetsArray: {
    type: Array
  },
  facets: {
    type: Object
  }
});

const emit = defineEmits(['update:facetsArray', 'updateFacetData']);

const facetsArray = computed({
  get() {
    return props.facetsArray;
  },
  set(value) {
    emit('update:facetsArray', value);
  }
});

/**
 * Watchers
 */

// const { modifierFiltres } = thesesAPIService();
// let filtres = ref([]);
// watch(filtres, async (newFiltres, oldFiltres) => {
//   if (oldFiltres.includes("soutenues") && !newFiltres.includes("soutenues")) {
//     filtres.value = newFiltres.filter(e => e !== 'accessible');
//
//   } else if (newFiltres.includes("accessible")) {
//     filtres.value.push("soutenues")
//   }
//
//   modifierFiltres(newFiltres);
// });

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