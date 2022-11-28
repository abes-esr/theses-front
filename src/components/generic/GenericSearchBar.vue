<template>
  <component
      v-if="activeComponent"
      :is="activeComponent"
      :key="activeComponent.__file"
  ></component>
</template>
<script>
export default {
  name: "search-bar",
};
</script>
<script setup>
import {watch, shallowRef, onBeforeMount} from "vue";
import {useRoute} from "vue-router";
import SearchBarTheses from "@/components/theses/search/SearchBar.vue";
import SearchBarPersonnes from "@/components/personnes/search/SearchBar.vue";

const activeComponent = shallowRef(SearchBarTheses);
const currentRoute = useRoute();

async function updateComponent(domaine) {
  if (domaine && domaine == "personnes") {
    activeComponent.value = SearchBarPersonnes
  } else if (domaine && domaine == "theses") {
    activeComponent.value = SearchBarTheses
  } else {
    activeComponent.value = SearchBarTheses
  }
}

onBeforeMount(() => {
  updateComponent(currentRoute.query.domaine)
});

watch(() => currentRoute.query.domaine, () => {
  updateComponent(currentRoute.query.domaine)
});

</script>