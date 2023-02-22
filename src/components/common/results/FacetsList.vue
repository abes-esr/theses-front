<template>
  <div class="facets">
      <facet-drawer
        v-for="facet in facets"
        :key="`facet-${facet.name}`"
        :facet="facet"
        class="my-3"
      />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { thesesAPIService } from "@/services/ThesesAPI";
import FacetDrawer from "@/components/common/results/FacetsDrawer.vue";

defineProps({
  facets: {
    type: Object
  }
})


const { modifierFiltres } = thesesAPIService();

let filtres = ref([]);

watch(filtres, async (newFiltres, oldFiltres) => {
  if (oldFiltres.includes("soutenues") && !newFiltres.includes("soutenues")) {
    filtres.value = newFiltres.filter(e => e !== 'accessible');

  } else if (newFiltres.includes("accessible")) {
    filtres.value.push("soutenues")
  }

  modifierFiltres(newFiltres);
});
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