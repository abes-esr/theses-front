<template>
  <component
      v-if="activeComponent"
      :is="activeComponent"
      :key="activeComponent.__file"
  ></component>
</template>
<script>
export default {
  name: "facets-drawer",
};
</script>
<script setup>
import {watch, shallowRef, onBeforeMount} from "vue";
import {useRoute} from "vue-router";
import FacetsDrawerTheses from "@/components/theses/results/FacetsDrawer.vue";
import FacetsDrawerPersonnes from "@/components/personnes/results/FacetsDrawer.vue";

const activeComponent = shallowRef(FacetsDrawerTheses);
const currentRoute = useRoute();

async function updateComponent(domaine) {
  if (domaine && domaine == "personnes") {
    activeComponent.value = FacetsDrawerPersonnes
  } else if (domaine && domaine == "theses") {
    activeComponent.value = FacetsDrawerTheses
  } else {
    activeComponent.value = FacetsDrawerTheses
  }
}

onBeforeMount(() => {
  updateComponent(currentRoute.query.domaine)
});

watch(() => currentRoute.query.domaine, () => {
  updateComponent(currentRoute.query.domaine)
});

</script>