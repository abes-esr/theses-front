<template>
  <v-select class="select-box" v-model="tri" return-object :items=items item-title="nom" item-value="cle"
    density="compact" flat single-line variant="solo" menu-icon="mdi-chevron-down">
    <template v-slot:menu-icon>
      <v-icon>
        mdi-chevron-down
      </v-icon>
    </template>
  </v-select>
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref, watch } from "vue";
import { APIService } from "@/services/StrategyAPI";

const currentRoute = useRoute();

const emit = defineEmits(['updatePageNumberFromSortingSelect', 'search']);
const { setSorting, getItemsTri, getCurrentSorting, getTriMap } = APIService();

const items = ref();
const tri = ref();

onMounted(() => {
  items.value = getItemsTri();
  tri.value = getCurrentSortName();
});

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

watch(tri, async (newSortingArray, previousSortingArray) => {
  if (typeof previousSortingArray !== 'undefined') { // Pas de mise à jour de la page à la première initialisation
    setSorting(newSortingArray.cle);
    emit("updatePageNumberFromSortingSelect", 1);
    emit("search");
  }
});


// Mise à jour des valeurs de tri
watch(() => currentRoute.query.domaine, () => {
  setSorting('pertinence');
  items.value = getItemsTri();
  tri.value = getCurrentSortName();
});



</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.select-box {
  :deep(.v-field--appended) {
    padding-inline-end: 0 !important;
  }

  :deep(.v-field--variant-solo) {
    box-shadow: unset;
    outline: solid 1px rgb(var(--v-theme-gris-fonce));
    height: 30px;
  }

  :deep(.v-field__input) {
    padding-top: 5px;
    padding-inline-start: 7px;
  }

  :deep(.v-field__append-inner) {
    padding-top: 5px;
    color: rgb(var(--v-theme-orange-abes));

    i {
      opacity: 1 !important;
    }
  }
}
</style>
