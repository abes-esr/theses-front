<template>
  <v-select class="select-box" v-model="tri" return-object :items=items item-title="nom" item-value="cle"
    density="compact" flat single-line variant="solo" menu-icon="mdi-chevron-down" :aria-label="$t('results.ariaSortBy')">
    <template v-slot:menu-icon>
      <v-icon>
        mdi-chevron-down
      </v-icon>
    </template>
  </v-select>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const currentRoute = useRoute();
const { t } = useI18n();
const emit = defineEmits(['updatePageNumberFromSortingSelect', 'search']);
const { setSorting, getItemsTri, getCurrentSorting, getTriMap } = useStrategyAPI();

const items = ref();
const tri = ref();
let noDoubleUpdates = false;

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
  const itemsTriMap = getTriMap() ? getTriMap() : new Map();
  const startingTriName = itemsTriMap.get(startingTri) ? itemsTriMap.get(startingTri) : "Pertinence";
  return { nom: startingTriName, cle: startingTri ? startingTri : "pertinence" };
}

/**
 * Watchers
 */

watch(tri, async (newSortingArray, previousSortingArray) => {
  if (typeof previousSortingArray !== 'undefined' && !noDoubleUpdates) { // Pas de mise à jour de la page à la première initialisation
    setSorting(newSortingArray.cle);
    emit("updatePageNumberFromSortingSelect", 1);
    emit("search");
  }
  noDoubleUpdates = false;
});


// Mise à jour des valeurs de tri
watch(() => currentRoute.query.domaine, () => {
  setSorting('pertinence');
  items.value = getItemsTri();
  tri.value = getCurrentSortName();
});

watch(() => currentRoute.query.tri, () => {
  noDoubleUpdates = true;
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
    padding-top: 1px;
    padding-inline-start: 7px;
    align-content: flex-start;
  }

  :deep(.v-field__append-inner) {
    padding-top: 5px;
    align-content: flex-start;
    flex-wrap: wrap;

    i {
      opacity: 1 !important;
    }
  }
}
</style>
