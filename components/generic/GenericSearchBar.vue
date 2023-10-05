<template>
  <component v-if="activeComponent" :is="activeComponent" :key="activeComponent.__file"></component>
</template>
<script>
export default {
  name: "search-bar",
};
</script>
<script setup>
import { watch, shallowRef } from "vue";
import SearchBarTheses from "../theses/search/SearchBar.vue";
import SearchBarPersonnes from "../personnes/search/SearchBar.vue";

const activeComponent = shallowRef(SearchBarTheses);
activeComponent.value = SearchBarTheses;

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

watch(() => currentRoute.query.domaine, () => {
  updateComponent(currentRoute.query.domaine)
});

</script>