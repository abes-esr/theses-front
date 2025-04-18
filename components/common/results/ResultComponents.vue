<template>
  <CommonResultsResultPagination v-if="!mobile" :nb-results=nbResult :type="'top'"
    :current-showing-number="currentShowingNumber" :current-page-number="currentPageNumber"
    @updateShowingNumber="updateShowingNumber" @updatePage="updatePage">
  </CommonResultsResultPagination>

  <div class="result-components-wrapper">
    <div v-if="mobile" class="sort-select-wrapper">
      <span class="sort-label">{{ $t('results.sort') }}</span>
      <CommonResultsSortingSelect class="sort-select"
        @updatePageNumberFromSortingSelect="updatePageNumberFromSortingSelect">
      </CommonResultsSortingSelect>
    </div>
    <Transition mode="out-in">
      <div id="returned-results-statement-container" aria-labelledby="returned-results-statement" tabindex="0" ref="returnStatementDiv">
        <div id="returned-results-statement" v-if="dataReady">
          <h1 aria-live="assertive" aria-atomic="true">
            <span>{{ $t("results.searched") }}{{ '\xa0' }}</span>
            <span class="darker-text">"{{ persistentQuery }}"{{ '\xa0' }}</span>
            <span>{{ $t("results.returned") }}{{ '\xa0' }}</span>
            <span class="darker-text">{{ nbResult.toLocaleString("fr-FR") }}{{ '\xa0' }}</span>
            <span>{{ $t("results.results") }}</span>
            <div class="export-buttons">
              <CommonExportQueryButton v-if="domainNameChange == 'theses'"
                :csv-href="'/api/v1/theses/rechercheCSV' + '?q=' + encodeURIComponent(replaceAndEscape(persistentQuery, isAdvanced)) + '&tri=' + encodeURIComponent(currentRoute.query.tri) + getFacetsRequest()"
                :rss-href="'/api/v1/theses/rss' + '?q=' + encodeURIComponent(replaceAndEscape(persistentQuery, isAdvanced)) + getFacetsRequest()"
                :json-href="'/api/v1/theses/recherche/' + '?q=' + encodeURIComponent(replaceAndEscape(persistentQuery, isAdvanced)) + '&nombre=10000&tri=' + encodeURIComponent(currentRoute.query.tri) + getFacetsRequest()">
              </CommonExportQueryButton>
            </div>
          </h1>
        </div>
        <h1 id="returned-results-statement" role="status" v-else>{{ $t("results.searching") }}</h1>
      </div>
    </Transition>

    <CommonResultsFacetsChips :selected-facets-array="selectedFacetsArray"
      @reinitializePageNumber="reinitializePageNumber" />
    <div v-if="mobile || dataReady" class="colonnes-resultats">
      <CommonResultsResultList :result="result" :domain-name-change="domainNameChange">
      </CommonResultsResultList>
    </div>
    <div v-else>
      <div v-for="i in currentShowingNumber" :key="i" class="skeleton-wrapper">
        <v-card :flat="true" style="margin-bottom: 1rem;">
          <v-skeleton-loader type="article">
          </v-skeleton-loader>
        </v-card>
      </div>
    </div>
  </div>

  <CommonResultsMoreResultsButton class="more-result-button" v-if="mobile && !allResultsWereLoaded()" :loading=loading
    :nb-result=nbResult @addTenResultsToList="addTenResultsToList" />

  <CommonResultsResultPagination v-if="!mobile" :nb-results=nbResult :type="'bottom'"
    :current-showing-number="currentShowingNumber" :current-page-number="currentPageNumber" class="pagination-bottom"
    @updateShowingNumber="updateShowingNumber" @updatePage="updatePage">
  </CommonResultsResultPagination>
</template>


<script setup>
import { useDisplay } from "vuetify";
import { onMounted, onBeforeUnmount, ref, watch } from "vue";

const currentRoute = useRoute();
const router = useRouter();
const { mobile } = useDisplay();
import { replaceAndEscape } from "../services/Common";
const { setShowingNumber, getFacetsRequest } = useStrategyAPI();
const emit = defineEmits(['reinitializePageNumber']);
const { t } = useI18n();

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
    type: Number,
    default: 1
  },
  domainNameChange: {
    type: String
  },
  selectedFacetsArray: {
    type: Array
  }
});

const scrollPosition = ref(0);

/**
 * Début gestionnaire clic
 */
// Déclarer une référence réactive pour stocker le dernier élément cliqué
const dernierElementClique = ref(null);
const dernierElementCliqueTag = ref(null);

// Ajouter un gestionnaire d'événements de clic
const handleClick = (event) => {
  dernierElementClique.value = event.target.innerText;
  dernierElementCliqueTag.value = event.target.type;
}

onMounted(() => {
  document.addEventListener("click", handleClick);

  // Gestion du rachargement de page au clic sur le bouton charger plus de resultats
  router.afterEach(() => {
      window.scrollTo(0, scrollPosition.value);
  })
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClick);

  router.afterEach(() => {});
});

/**
 * Fin gestionnaire clic
 */

const currentPageNumber = currentRoute.query.page ? ref(parseInt(currentRoute.query.page)) : ref(1);
const currentShowingNumber = currentRoute.query.nb ? ref(parseInt(currentRoute.query.nb)) : ref(10);
const isAdvanced = useState("isAdvanced");

const returnStatementDiv = ref(null);

onMounted (() => {
  if(dernierElementClique.value !==  t('avancee') && dernierElementClique.value !==  t('simple') && dernierElementCliqueTag.value !== 'checkbox')
    returnStatementDiv.value.focus({ focusVisible: false});
});

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
  scrollPosition.value = window.scrollY;
  currentShowingNumber.value += 10;
  setShowingNumber(currentShowingNumber.value);
}

function updatePage(newPage) {
  currentPageNumber.value = newPage;
}

function updatePageNumberFromSortingSelect(pageNumber) {
  updatePage(pageNumber);
}

/**
 * Emits
 */
function reinitializePageNumber() {
  emit('reinitializePageNumber');
}

/**
 * Watchers
 */
watch(() => props.resetPage, () => {
  currentPageNumber.value = 1;
});

watch(() => props.dataReady, () => {
  if(dernierElementClique.value !==  t('avancee') && dernierElementClique.value !==  t('simple') && dernierElementCliqueTag.value !== 'checkbox') {
    returnStatementDiv.value.focus({ focusVisible: false});
  }
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

.skeleton-wrapper {
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

#returned-results-statement {
  display: inline-block;

  h1 {
    display: inline-block;
    margin: 0 1rem 0 1rem;
    font-family: Roboto-Medium, sans-serif;
    font-weight: 400;
    font-size: 24.5px;
    word-break: break-word;

    @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
      font-size: 22.5px;
    }
  }

  .export-buttons {
    display: inline-block;
    padding-left: 0.5rem
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
  bottom: -5em;
}

#returned-results-statement-container:focus-visible {
  outline: none;
}
</style>
