<template>
  <v-select v-model="tri" return-object :items=items item-title="nom" item-value="cle" density="compact"
            variant="underlined" color="orange-abes">
  </v-select>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, watch } from "vue";
import { APIService } from "@/services/StrategyAPI";

const currentRoute = useRoute();

const emit = defineEmits('updatePageNumber')
const { setSorting, getItemsTri, getCurrentSorting, getTriMap } = APIService();

const items = ref();
const tri = ref();

const startingTri = currentRoute.query.tri;
items.value = getItemsTri();
const itemsTriMap = getTriMap();
const startingTriName = itemsTriMap.get(startingTri) ? itemsTriMap.get(startingTri) : "Pertinence";
tri.value = { nom: startingTriName, cle: startingTri ? startingTri : "pertinence" };

/**
 * Fonctions
 */

/**
 * Récupère les clés/valeurs du tri pour le domaine actuel
 * @returns {{nom: (*|string), cle: (*|string)}}
 */
function getCurrentSortName() {
  const startingTri = getCurrentSorting();
  const itemsTriMap = getTriMap();
  const startingTriName = itemsTriMap.get(startingTri) ? itemsTriMap.get(startingTri) : "Pertinence";
  return { nom: startingTriName, cle: startingTri ? startingTri : "pertinence" };
}

/**
 * Watchers
 */

watch(tri, async (newTri) => {
  setSorting(newTri.cle);
  emit("updatePageNumber", 1);
});


// Mise à jour des valeurs de tri
watch(() => currentRoute.query.domaine, () => {
  setSorting('pertinence');
  items.value = getItemsTri();
  tri.value = getCurrentSortName();
});



</script>

<style scoped>

</style>