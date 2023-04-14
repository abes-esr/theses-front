<template>
  <div class="result-pagination">
      <div v-if="type === 'top'" class="first-bar-element">
          <span class="pt-5 ">Afficher</span>
          <v-select :items="['10', '25', '50']" v-model="currentShowingNumber" density="compact" variant="underlined"
                     color="orange-abes" class="left-select">
          </v-select>
          <span class="pt-5">résultats par page</span>
      </div>
      <v-pagination
            class="pt-1 middle-bar-element"
            :length="nbPages"
            total-visible="2"
            v-model="currentPageNumber"
            @update:modelValue="bottomScrollsToTop">
      </v-pagination>
      <v-select v-if="type === 'top'" v-model="tri" class="ml-2 pt-2 last-bar-element" return-object :items=items item-title="nom" item-value="cle" density="compact"
                  variant="underlined" color="orange-abes">
      </v-select>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { APIService } from "@/services/StrategyAPI";
import { scrollToTop } from "@/services/Common";
import { useRoute } from "vue-router";

const currentRoute = useRoute();
const { setSorting, setPageNumber, setShowingNumber, getItemsTri, getCurrentPageNumber, getCurrentShowingNumber, getCurrentSorting, getTriMap } = APIService();
const emit = defineEmits(['search', 'updatePage', 'updateNumber']);

const props = defineProps({
  nbResults: {
    type: Number,
    default: 1
  },
  type: {
    Type: String,
    default: 'top'
  },
  currentPageNumber: {
    type: Number,
    default: 1
  },
  currentShowingNumber: {
    type: Number,
    default: 10
  }
});

const items = ref();
const tri = ref();

if (props.type === 'top') {
  items.value = getItemsTri();
  tri.value = getCurrentSortName();
}


const currentShowingNumber = ref(getCurrentShowingNumber());
const currentPageNumber = ref(getCurrentPageNumber());

const nbPages = computed(() => {
  return Math.ceil(props.nbResults / currentShowingNumber.value);
});

/**
 * Fonctions
 */

function bottomScrollsToTop() {
  if(props.type === "bottom") scrollToTop();
}

/**
 * Watchers
 */

watch(currentPageNumber, newCurrentPageNumber => {
  setPageNumber(newCurrentPageNumber);
  emit("updatePage", newCurrentPageNumber);
  if (props.type === "top") {
    emit("search");
  }
});

watch(currentShowingNumber, newShowingNumber => {
  setShowingNumber(newShowingNumber);
  setPageNumber(1);
  emit("updateNumber", newShowingNumber);
  emit("updatePage", 1);
  if (props.type === "top") {
    emit("search");
  }
});

watch(tri, async (newTri) => {
  setPageNumber(1);
  setSorting(newTri.cle);
  emit("updatePage", 1);
  if (props.type === "top") {
    emit("search");
  }
});


/**
 * Watcher des autres barres de pagination
 */
watch(() => props.currentPageNumber, () => {
  currentPageNumber.value = props.currentPageNumber;
});

watch(() => props.currentShowingNumber, () => {
  currentShowingNumber.value = props.currentShowingNumber;
});

function getCurrentSortName() {
  const startingTri = getCurrentSorting();
  const itemsTriMap = getTriMap();
  const startingTriName = itemsTriMap.get(startingTri) ? itemsTriMap.get(startingTri) : "Pertinence";
  return { nom: startingTriName, cle: startingTri ? startingTri : "pertinence" };
}

// Mise à jour des valeurs de tri
watch(() => currentRoute.query.domaine, () => {
  setSorting('pertinence');
  items.value = getItemsTri();
  tri.value = getCurrentSortName();
});

</script>
<style scoped lang="scss">
@use '../../../../node_modules/vuetify/settings';

.result-pagination {
  background-color: rgb(var(--v-theme-gris-clair));
  max-height: 4rem;
  display: flex;
  flex-wrap: nowrap;
}

.v-pagination {
  background-color: transparent;
  width: unset;
}

.first-bar-element {
  margin-left: 1rem;
  display: flex;
  overflow: visible;
}

.middle-bar-element {
  flex: 1;
}

.last-bar-element {
  margin: 0 1rem;
  max-width: 200px;
}

.left-select {
  max-width: 50px;
  margin: 0 8px 0;
  padding-top: 8px;
}
</style>