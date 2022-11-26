<template>
  <component
      v-if="activeComponent"
      :is="activeComponent"
      :key="activeComponent.__file"
  ></component>
</template>
<script>
export default {
  name: "result-list",
};
</script>
<script setup>
import {watch, shallowRef, onBeforeMount} from "vue";
import {useRoute} from "vue-router";
import ResultListTheses from "@/components/theses/results/ResultList.vue";
import ResultListPersonnes from "@/components/personnes/results/ResultList.vue";

const activeComponent = shallowRef(ResultListTheses);
const currentRoute = useRoute();

async function updateComponent(domaine) {
  if (domaine && domaine == "personnes") {
    activeComponent.value = ResultListPersonnes
  } else if (domaine && domaine == "theses") {
    activeComponent.value = ResultListTheses
  }
}

onBeforeMount(() => {
  updateComponent(currentRoute.query.domaine)
});

watch(() => currentRoute.query.domaine, () => {
  updateComponent(currentRoute.query.domaine)
});

</script>