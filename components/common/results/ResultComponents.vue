<template>
  <CommonResultsResultPagination v-if="!mobile" :nb-results=nbResult :type="'top'"
    :current-showing-number="currentShowingNumber" :current-page-number="currentPageNumber"
    @updateShowingNumber="updateShowingNumber" @updatePage="updatePage" @search="search">
  </CommonResultsResultPagination>

  <div class="result-components-wrapper">
    <div v-if="mobile" class="sort-select-wrapper">
      <span class="sort-label">{{ $t('results.sort') }}</span>
      <CommonResultsSortingSelect class="sort-select"
        @updatePageNumberFromSortingSelect="updatePageNumberFromSortingSelect">
      </CommonResultsSortingSelect>
    </div>
    <Transition mode="out-in">
      <div class="returned-results-statement" v-if="dataReady">
        <span>{{ $t("results.searched") }}{{ '\xa0' }}</span>
        <span class="darker-text">"{{ persistentQuery }}"{{ '\xa0' }}</span>
        <span>{{ $t("results.returned") }}{{ '\xa0' }}</span>
        <span class="darker-text">{{ nbResult }}{{ '\xa0' }}</span>
        <span>{{ $t("results.results") }}</span>
      </div>
      <h2 class="returned-results-statement" v-else>{{ $t("results.searching") }}</h2>
    </Transition>
    <CommonResultsFacetsChips :facets="facets" @deleteFilter="deleteFilter" />
    <div v-if="mobile || dataReady" class="colonnes-resultats">
      <CommonResultsResultList :result="result" :domain-name-change="domainNameChange">
      </CommonResultsResultList>
    </div>
    <div v-else>
      <div v-for="i in currentShowingNumber" :key="i" class="skeleton">
        <v-card flat style="margin-bottom: 1rem;">
          <v-skeleton-loader type="article">
          </v-skeleton-loader>
        </v-card>
      </div>
    </div>
  </div>

  <CommonResultsMoreResultsButton class="more-result-button" v-if="mobile && !allResultsWereLoaded()" :loading=loading
    :nb-result=nbResult @addTenResultsToList="addTenResultsToList" @search="search" />

  <CommonResultsResultPagination v-if="!mobile" :nb-results=nbResult :type="'bottom'"
    :current-showing-number="currentShowingNumber" :current-page-number="currentPageNumber" class="pagination-bottom"
    @updateShowingNumber="updateShowingNumber" @updatePage="updatePage" @search="search">
  </CommonResultsResultPagination>
</template>


<script setup>
import { useDisplay } from "vuetify";
import { ref, watch } from "vue";
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'


const currentRoute = useRoute();
const { mobile } = useDisplay();
const { setShowingNumber, setShowingNumberMobile } = useStrategyAPI();

const props = defineProps({
  result: {
    type: Array,
    required: true
  },
  dataReady: {
    type: Boolean
  },
  nbResult: {
    type: Number
  },
  persistentQuery: {
    type: String,
    default: ""
  },
  loading: {
    type: Boolean
  },
  resetPage: {
    type: Number
  },
  resetShowingNumber: {
    type: Number
  },
  domainNameChange: {
    type: String
  },
  facets: {
    type: Array
  }
});

const currentPageNumber = currentRoute.query.page ? ref(parseInt(currentRoute.query.page)) : ref(1);
const currentShowingNumber = currentRoute.query.nb ? ref(parseInt(currentRoute.query.nb)) : ref(10);

/**
 * Emits
 */

const emit = defineEmits(['search', 'deleteFilter']);

function deleteFilter(facet) {
  emit('deleteFilter', facet);
}

/**
 * Fonctions
 */
function moreThanXResults(x) {
  if (typeof props.result.length === 'undefined')
    return false;
  return (props.result.length >= x);
}

function allResultsWereLoaded() {
  return moreThanXResults(props.nbResult);
}

function updateShowingNumber(newValue) {
  currentShowingNumber.value = newValue;
  setShowingNumber(currentShowingNumber.value);
}

function addTenResultsToList() {
  currentShowingNumber.value += 10;
  setShowingNumberMobile(currentShowingNumber.value);
}

function updatePage(newPage) {
  currentPageNumber.value = newPage;
}

function updatePageNumberFromSortingSelect(pageNumber) {
  updatePage(pageNumber);
  emit('search');
}

function search() {
  emit('search');
}

/**
 * Watchers
 */
watch(() => props.resetPage, () => {
  currentPageNumber.value = 1;
});

watch(() => props.resetShowingNumber, () => {
  currentShowingNumber.value = 10;
});
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.colonnes-resultats {
  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    grid-template-columns: none;
  }
}

.bottom-buttons-line {
  display: flex;
  justify-content: center;
}

.result-components-wrapper {
  padding: 1rem 0 2rem 1rem;
  flex: 1;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    padding-bottom: 0;
  }
}

.pagination-bottom {
  position: relative;
  bottom: 0;
  z-index: 10;
}

.v-card {
  margin-bottom: 1rem;
  min-height: 190px;
}

.skeleton {
  padding: 0;
  display: grid;
  grid-template-columns: 95%
}

//Animations texte
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.returned-results-statement {
  margin: 0 1rem;
  font-family: Roboto-Medium, sans-serif;
  font-weight: 400;
  font-size: 24.5px;
  word-break: break-word;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    font-size: 22.5px;
  }
}

.darker-text {
  color: rgb(var(--v-theme-secondary-darken-2));
  font-family: Roboto-Bold, sans-serif;
  font-weight: 500;
}

.sort-select-wrapper {
  margin: -85px 0 20px;
  display: grid;
  grid-template-columns: 5fr 4fr 10px;
  grid-template-rows: 30px 30px;
}

.sort-label {
  grid-row-start: 1;
  grid-column-end: 3;
  justify-self: end;
  align-self: center;

  font-size: 15px;
  font-family: Roboto-Bold, sans-serif;
  font-weight: 500;
}

.sort-select {
  grid-row-start: 2;
  grid-column-start: 2;
  justify-self: end;

  .v-select__selection-text {
    font-size: 14px;
    font-family: Roboto-Medium, sans-serif;
    font-weight: 500;
  }
}

.more-result-button {
  position: relative;
  top: 80px;
}
</style>