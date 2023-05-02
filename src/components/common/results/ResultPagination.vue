<template>
  <div class="result-pagination">
      <div v-if="type === 'top'" class="first-bar-element">
          <span class="show-span no-wrap-text">{{ $t('results.show') }}</span>
          <v-select :items="['10', '25', '50']" v-model="currentShowingNumber" density="compact" variant="solo"
                     class="left-select" menu-icon="mdi-chevron-down">
            <template v-slot:menu-icon>
              <v-icon>
                mdi-chevron-down
              </v-icon>
            </template>
          </v-select>
          <span class="results-number-span no-wrap-text">{{ $t('results.resultsPerPage') }}</span>
      </div>
      <v-pagination
            class="middle-bar-element"
            :length="nbPages"
            total-visible="2"
            v-model="currentPageNumber"
            @update:modelValue="bottomScrollsToTop">
      </v-pagination>
    <div v-if="type === 'top'" class="last-bar-element">
      <span class="sort-by-span no-wrap-text">{{ $t('results.sortBy') }}</span>
      <sorting-select class="right-select" @updatePageNumberFromSortingSelect="updatePageNumberFromSortingSelect" @search="search">
      </sorting-select>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { APIService } from "@/services/StrategyAPI";
import { scrollToTop } from "@/services/Common";
import { useRoute } from "vue-router";
import SortingSelect from "@/components/common/results/SortingSelect.vue";

const currentRoute = useRoute();
const { setPageNumber, setShowingNumber } = APIService();
const emit = defineEmits(['search', 'updatePage', 'updateShowingNumber']);

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

const currentPageNumber = currentRoute.query.page ? ref(parseInt(currentRoute.query.page)) : ref(1);
const currentShowingNumber = currentRoute.query.nb ? ref(parseInt(currentRoute.query.nb)) : ref(10);

const nbPages = computed(() => {
  return Math.ceil(props.nbResults / currentShowingNumber.value);
});

/**
 * Fonctions
 */

function bottomScrollsToTop() {
  if(props.type === "bottom") scrollToTop();
}

function updatePageNumberFromSortingSelect(pageNumber) {
  currentPageNumber.value = pageNumber;
  setPageNumber(pageNumber);
  emit("updatePage", pageNumber);
  emit("search");
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
  emit("updateShowingNumber", newShowingNumber);
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
  font-size: 15px;
}

.show-span{
  padding-top: 22px;
}


.left-select {
  max-width: 50px;
  margin: 10px 8px 0;
  padding-top: 6px;

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

.no-wrap-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.results-number-span {
  padding-top: 22px;
  height: 50px;
}

.middle-bar-element {
  flex: 1;
  margin-top: 5px;
}

.last-bar-element {
  margin-top: 17px;
  margin-right: 20px;
  width: 220px;

  display: inline-flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}

.sort-by-span {
  padding-top: 4px;
}

.right-select {
  max-width: 150px;
  font-size: 15px;
}
</style>