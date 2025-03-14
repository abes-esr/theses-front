<template>
  <div class="result-pagination">
    <div class="first-bar-element">
      <v-select :items="['10', '25', '50']" v-model="currentShowingNumber" density="compact" variant="solo" :aria-label="$t('results.ariaResultsPerPage')"
        class="left-select v-selects" menu-icon="mdi-chevron-down">
        <template v-slot:menu-icon>
          <v-icon>
            mdi-chevron-down
          </v-icon>
        </template>
      </v-select>
      <span class="results-number-span no-wrap-text">{{ $t('results.resultsPerPage') }}</span>
    </div>
    <div class="middle-bar-element">
      <v-pagination :length="nbPages" v-model="currentPageNumber" :total-visible="totalVisible" size="x-large"
        @update:modelValue="bottomScrollsToTop">
      </v-pagination>
    </div>
    <div class="last-bar-element">
      <span class="sort-by-span no-wrap-text">{{ $t('results.sortBy') }}</span>
      <CommonResultsSortingSelect class="right-select v-selects"
        @updatePageNumberFromSortingSelect="updatePageNumberFromSortingSelect">
      </CommonResultsSortingSelect>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { scrollToTop } from "../../services/Common";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";

const { t } = useI18n();
const { setPageNumber, setShowingNumber } = useStrategyAPI();
const emit = defineEmits(['search', 'updatePage', 'updateShowingNumber']);
const currentRoute = useRoute();

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

const currentPageNumber = ref(props.currentPageNumber);
const currentShowingNumber = ref(props.currentShowingNumber);

const nbPages = computed(() => {
  if (currentShowingNumber.value && props.nbResults) {
    return Math.ceil(props.nbResults / currentShowingNumber.value);
  } else {
    return 0;
  }
});

const { xlAndUp } = useDisplay();

const totalVisible = computed(() => {
  if (nbPages.value > 10000) {
    return xlAndUp.value ? 5 : 2;
  } else if (nbPages.value > 100) {
    return xlAndUp.value ? 8 : 2;
  } else {
    return xlAndUp.value ? "10" : 2;
  }
});

/**
 * Fonctions
 */
function bottomScrollsToTop() {
  if (props.type === "bottom") scrollToTop();
}

function updatePageNumberFromSortingSelect(pageNumber) {
  currentPageNumber.value = pageNumber;
  setPageNumber(pageNumber);
  emit("updatePage", pageNumber);
}

/**
 * Watchers
 */
watch(currentPageNumber, (newCurrentPageNumber, previousCurrentPageNumber) => {
  if (newCurrentPageNumber !== previousCurrentPageNumber) {
    setPageNumber(newCurrentPageNumber);
    emit("updatePage", newCurrentPageNumber);
  }
});

watch(currentShowingNumber, (newShowingNumber, previousShowingNumber) => {
  if (newShowingNumber !== previousShowingNumber) {
    setShowingNumber(newShowingNumber);
    setPageNumber(1);
    emit("updateShowingNumber", newShowingNumber);
    emit("updatePage", 1);
  }
});

/**
 * Watcher pour props (éviter les updates récursifs)
 */
watch(() => props.currentPageNumber, (newVal) => {
  if (newVal !== currentPageNumber.value) {
    currentPageNumber.value = newVal;
  }
});

watch(() => props.currentShowingNumber, (newVal) => {
  if (newVal !== currentShowingNumber.value) {
    currentShowingNumber.value = newVal;
  }
});
</script>

<style scoped lang="scss">
@use '../../../node_modules/vuetify/settings';

.result-pagination {
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

.show-span {
  padding-top: 22px;
}

.left-select {
  margin: 10px 8px 0;
  padding-top: 6px;

  :deep(.v-field) {
    max-width: 70px;
  }

  :deep(.v-field--appended) {
    padding-inline-end: 0 !important;
  }

  :deep(.v-field--variant-solo) {
    box-shadow: unset;
    outline: solid 1px rgb(var(--v-theme-gris-fonce));
  }

  :deep(.v-field__append-inner) {
    padding-top: 5px;

    i {
      opacity: 1 !important;
    }
  }
}

.v-selects {
  :deep(.v-field) {
    height: 22px;
    margin-top: 8px;
  }

  :deep(.v-field__input) {
    padding: 0 8px;
    align-content: flex-start;
    margin-top: -2px;
    color: rgb(var(--v-theme-text-dark-blue)) !important;
  }

  :deep(.v-field__append-inner) {
    padding: unset;
    align-content: flex-start;
    flex-wrap: wrap;
  }
}

.v-selects:focus-within {
  border: 1px solid rgb(var(--v-theme-gris-fonce));
  box-sizing: border-box;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.3);
  padding: 3px;
  transition: border-color 0.3s ease;
}


.no-wrap-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.results-number-span {
  padding-top: 24px;
  height: 50px;
}

.middle-bar-element {
  flex: 1;
  margin-top: 15px;

  :deep(.v-btn) {
    height: 23px;
    width: 23px;
  }

  :deep(.v-btn-content) {
    height: 10px;
  }
}

.last-bar-element {
  margin-top: 17px;
  margin-right: 20px;
  width: 220px;
  font-size: 15px;

  display: inline-flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}

.sort-by-span {
  padding-top: 8px;
}

.right-select {
  max-width: 150px;
  font-size: 15px;
}

:deep(.v-pagination__item>.v-btn) {
  width: fit-content !important;
  min-width: 30px;
}
</style>