<template>
  <v-select class="select-box" v-model="tri" return-object :items="items" item-title="nom" item-value="cle" density="compact" flat single-line variant="solo" menu-icon="mdi-chevron-down" :aria-label="$t('results.ariaSortBy')">
    <template v-slot:menu-icon>
      <v-icon>
        mdi-chevron-down
      </v-icon>
    </template>
  </v-select>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";

const currentRoute = useRoute();
const { t, locale } = useI18n();
const emit = defineEmits(['updatePageNumberFromSortingSelect', 'search']);
const { setSorting, getItemsTri, getCurrentSorting, getTriMap } = useStrategyAPI();

const items = ref([]);
const tri = ref("");
let noDoubleUpdates = false;

onMounted(() => {
  updateDataTri();
});

/**
 * Fonctions
 */

function updateDataTri() {
  items.value = getTranslatedItemsTri();
  tri.value = getTranslatedCurrentSortName();
}

/**
 * Retourne les éléments de tri traduits
 * @returns {Array}
 */
function getTranslatedItemsTri() {
  const itemsTri = getItemsTri();

  if (!!itemsTri) {
    return itemsTri.map(item => ({
      ...item,
      nom: t(item.nom)
    }));
  }
}

/**
 * Retourne le tri appliqué traduit
 * @returns {Array}
 */
function getTranslatedCurrentSortName() {
  const currentSortName = getCurrentSortName();

  if (!!currentSortName) {
    let obj = getCurrentSortName();
    return {
      ...obj,
      cle: obj.cle,
      nom: t(obj.nom)
    };
  }
}

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

// Surveiller les changements de tri
watch(tri, async (newSortingArray, previousSortingArray) => {
  if (typeof previousSortingArray !== 'undefined' && !noDoubleUpdates) {
    setSorting(newSortingArray.cle);
    emit("updatePageNumberFromSortingSelect", 1);
    emit("search");
  }
  noDoubleUpdates = false;
});

// Surveiller les changements de domaine dans la route
watch(() => currentRoute.query.domaine, () => {
  setSorting('pertinence');
  items.value = getTranslatedItemsTri();
  tri.value = getTranslatedCurrentSortName();
});

// Surveiller les changements de tri dans la route
watch(() => currentRoute.query.tri, () => {
  noDoubleUpdates = true;
  items.value = getTranslatedItemsTri();
  tri.value = getTranslatedCurrentSortName();
});

watch(locale, (newLocale) => {
  updateDataTri();
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
