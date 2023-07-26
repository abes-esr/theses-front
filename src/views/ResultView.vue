<template>
  <Message-box ref="messageBox"></Message-box>
  <nav v-if="mobile" class="mobile-nav-bar">
    <!--    Bouton filtres-->
    <button @click="dialogVisible = true" class="filter-mobile-nav-bar">
      <v-icon v-bind="props" size="40px">mdi-filter-variant
      </v-icon>
      <span v-bind="props">Filtrer</span>
    </button>
    <!--    Bouton menu recherche/selecteur these/personnes-->
    <v-icon @click="showSearchBar = !showSearchBar" size="40px"
      :class="{ 'magnify-logo-active': showSearchBar }">mdi-magnify
    </v-icon>
  </nav>
  <!--    Menu filtres-->
  <div v-if="mobile" class="logo-menu-wrapper">
    <RouterLink :to="{ name: 'home' }" title="Accueil du site" class="logo logo_home">
      <img alt="logo Theses" id="logoIMG" src="@/assets/icone-theses.svg" />
    </RouterLink>
    <!--    Menu recherche/selecteur these/personnes-->
    <v-dialog v-model="dialogVisible" eager location-strategy="static" persistent no-click-animation fullscreen
      :close-on-content-click="false" transition="dialog-top-transition" content-class="full-screen">
      <facets-header @closeOverlay="closeOverlay"
        @searchAndReinitializeAllFacets="searchAndReinitializeAllFacets"></facets-header>
      <facets-list @update="update" @loadChips="loadChips" @searchAndReinitialize="searchAndReinitialize"
        :loading="!dataFacetsReady" @closeOverlay="closeOverlay" :facets="facets" :reset-facets="resetFacets"
        :reinitialize-date-from-trigger="reinitializeDateFromTrigger"
        :reinitialize-date-to-trigger="reinitializeDateToTrigger" :domaine="domainNameChange"
        :parameters-loaded="parametersLoaded" :filter-to-be-deleted="filterToBeDeleted" class="left-side"></facets-list>
    </v-dialog>

    <v-expand-transition>
      <div v-show="showSearchBar" class="expanded-search-bar-container">
        <div class="expanded-search-bar">
          <domain-selector @changeDomain="changeDomain" compact></domain-selector>
          <search-bar @search="search" @searchAndReinitializeAllFacets="searchAndReinitializeAllFacets" :loading="loading"
            @onError="displayError" />
        </div>
      </div>
    </v-expand-transition>
  </div>
<!--  Desktop-->
  <div v-else class="sub-header">
    <div id="search-bar-container" class="white-containers">
      <div class="sub_header__logo">
        <RouterLink :to="{ name: 'home' }" title="Accueil du site">
          <img class="logo" alt="logo Theses" id="logoIMG" src="@/assets/icone-theses.svg" />
        </RouterLink>
        <h1>{{ $t("slogan") }}</h1>
      </div>
      <div class="sub_header__action">
        <domain-selector @changeDomain="changeDomain" compact></domain-selector>
        <search-bar @searchAndReinitializeAllFacets="searchAndReinitializeAllFacets" :loading="loading"
          @onError="displayError" />
      </div>
    </div>
  </div>

  <div class="result-main-wrapper">
    <div v-if="!mobile" class="nav-bar">
      <facets-header @searchAndReinitializeAllFacets="searchAndReinitializeAllFacets"></facets-header>
      <facets-list @update="update" @loadChips="loadChips" @searchAndReinitialize="searchAndReinitialize" :facets="facets"
        :reset-facets="resetFacets" :reinitialize-date-from-trigger="reinitializeDateFromTrigger"
        :reinitialize-date-to-trigger="reinitializeDateToTrigger" :domaine="domainNameChange"
        :parameters-loaded="parametersLoaded" :filter-to-be-deleted="filterToBeDeleted" :loading="!dataFacetsReady"
        class="left-side"></facets-list>
    </div>
    <div class="result-components white-containers">
      <result-components :data-ready="dataReady" :result="result" :loading="loading" :nb-result="nbResult"
        :persistentQuery="request" :reset-page="resetPage" :reset-showing-number="resetShowingNumber"
        :domain-name-change="domainNameChange" :facets="selectedFacets" @search="search" @deleteFilter="deleteFilter">
      </result-components>
    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent, onMounted, ref, watch } from "vue";
import { useRoute } from 'vue-router';
import { APIService } from "@/services/StrategyAPI";
import { useDisplay } from 'vuetify';
import FacetsList from '@/components/common/results/FacetsList.vue';
import SearchBar from '@/components/generic/GenericSearchBar.vue';
import DomainSelector from '@/components/common/DomainSelector.vue';
import ResultComponents from "@/components/common/results/ResultComponents.vue";
import FacetsHeader from "@/components/common/results/FacetsHeader.vue";

const { mobile } = useDisplay();
const {
  setQuery,
  getQuery,
  queryAPI,
  getFacets,
  setDomaine,
  setPageNumber,
  setShowingNumber,
  setCheckedFilters,
  getURLParameters,
  setWorkingFacetName
} = APIService();
const MessageBox = defineAsyncComponent(() => import('@/components/common/MessageBox.vue'));

const currentRoute = useRoute();
const request = ref("");
const result = ref([]);
const dataReady = ref(false);
const dataFacetsReady = ref(false);
// const isBurgerMenuOpen = ref(false);
const messageBox = ref(null);
const resetFacets = ref(0);
const loading = ref(false);
const facets = ref({});
const nbResult = ref(0);
const resetPage = ref(0);
const resetShowingNumber = ref(0);
const domainNameChange = ref(currentRoute.query.domaine);
const dialogVisible = ref(false);
const showSearchBar = ref(false);
const selectedFacets = ref([]);
const filterToBeDeleted = ref([]);
const numberOfDeletedChips = ref(0);
const parametersLoaded = ref(0);
const reinitializeDateFromTrigger = ref(0);
const reinitializeDateToTrigger = ref(0);

onMounted(async () => {
  getURLParameters().then(() => {
    setDomaine(currentRoute.query.domaine);
    dataReady.value = false;
    request.value = decodeURI(currentRoute.query.q);
    setQuery(request.value);
    search(true);
  });
});

/**
 * Fonctions
 */
async function search(firstLoad = false) {
  request.value = getQuery();
  loading.value = true;
  dataReady.value = false;

  updateFacets(firstLoad);

  /**
   * Chargement des donnees
   */
  return queryAPI(mobile).then((response) => {
    if (!["theses", "personnes"].includes(currentRoute.query.domaine)) {
      throw new Error("Erreur de nom de paramètres");
    }

    result.value = response[currentRoute.query.domaine];
    nbResult.value = response.totalHits;
    domainNameChange.value = currentRoute.query.domaine;
  }).catch(error => {
    displayError(error.message);
    result.value = [];
    nbResult.value = 0;
  }).finally(() => {
    loading.value = false;
    dataReady.value = true;
  });
}

function update(facetsArray) {
  dataReady.value = false;
  reinitialize();
  loadChips(facetsArray);
  search();
}

function loadChips(facetsArray) {
  if (facetsArray) {
    // mise à jour des chips
    selectedFacets.value = facetsArray;
  }
}

function displayError(message) {
  messageBox.value?.open(message, {
    type: "error"
  });
}

function closeOverlay() {
  dialogVisible.value = false;
}

function updateFacets(firstLoad) {
  getFacets().then(response => {
    facets.value = response;
    if (firstLoad) {
      parametersLoaded.value++;
      dataFacetsReady.value = true;
    }
  }).catch(error => {
    facets.value = {};
    if (typeof error !== 'undefined' && typeof error.message !== 'undefined') {
      displayError(error.message);
    }
    console.error(error);
  });
}

// Si on passe de desktop à mobile ou inversement, réinitialisation des variables de pagination
watch(mobile, () => {
  reinitializeCurrentRequest();
});

/**
 * Réinitialiser l'affichage des résultats
 */
function reinitializeCurrentRequest() {
  reinitialize();
  search();
}

function reinitialize() {
  setPageNumber(1);
  resetPage.value++;
  setShowingNumber(10);
  resetShowingNumber.value++;
}

async function searchAndReinitializeFacet(query) {
  setQuery(query);
  searchAndReinitialize();
  resetFacets.value++;
}

function resetBeforeSearch() {
  resetFacets.value++;
  setWorkingFacetName("");
  setCheckedFilters([]);
}

async function searchAndReinitializeAllFacets() {
  showSearchBar.value = false;
  resetBeforeSearch();
  searchAndReinitialize();
}


function changeDomain() {
  searchAndReinitializeFacet(request.value);
}

async function searchAndReinitialize() {
  dataReady.value = false;
  reinitialize();
  await search();
}

function deleteDateFilterIfIsDate(filter) {
  if (filter.filter.facetName === 'datedebut') {
    reinitializeDateFromTrigger.value++;
  } else if (filter.filter.facetName === 'datefin') {
    reinitializeDateToTrigger.value++;
  }
}

/**
 * Envoie le filtre à supprimer au composant FacetsList, utilisation de numberOfDeletedChips pour détecter la suppression d'un même objet deux fois d'affilée
 * @param filter
 */
function deleteFilter(filter) {
  numberOfDeletedChips.value++;
  deleteDateFilterIfIsDate(filter);
  filterToBeDeleted.value = {
    'numberOfDeletedChips': numberOfDeletedChips.value,
    'filter': filter.filter
  };
}

/**
 * Watchers
 */

watch(() => currentRoute.query.domaine, () => {
  setDomaine(currentRoute.query.domaine);
});
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.greyBar {
  background-color: rgb(var(--v-theme-gris-clair)) !important;
}

.darkGreyBar {
  background-color: rgb(var(--v-theme-gris-fonce)) !important;
}

.blueBorder {
  border-right: solid rgb(var(--v-theme-primary)) 3px;
}

.left-side {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1 0 100%;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    max-width: 100%;
    flex: 0 1 auto;
    padding: 0;
  }
}

.sub-header {
  display: grid;
  grid-template-columns: 10fr 103fr 10fr;
}

#search-bar-container {
  grid-column-start: 2;
  margin-top: 50px;

  display: grid;
  grid-template-columns: 20fr 3fr 80fr;
}

.sub_header__logo {
  grid-column-start: 1;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1 {
    text-align: center;
    width: 80%;
    font-weight: 300;
    font-size: 14px;
  }

  .logo {
    margin-top: 0;
    height: 115px;
  }
}

.sub_header__action {
  grid-column-start: 3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1 0 auto;

  .domain-selector,
  .searchbar {
    width: 90%;
  }

  .domain-selector {
    :deep(.v-btn__content) {
      flex-direction: row;
      opacity: 0.6;
    }

    :deep(.v-icon) {
      margin-right: 1rem;
    }
  }
}

.v-overlay :deep(.v-overlay__content) {
  padding: 0 0;
  background-color: rgb(var(--v-theme-background));
}

.result-main-wrapper {
  padding: 30px 0;

  display: grid;
  grid-template-columns: 10fr 20fr 3fr 80fr 10fr;
  align-items: start;
  margin-top: 0;
  width: 100%;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    grid-template-columns: 100%;
  }

  .result-components {
    grid-column-start: 4;

    width: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 5px;
  }
}

.white-containers {
  background-color: rgb(var(--v-theme-surface));
  border: solid 1px rgb(var(--v-theme-gris-clair));
}
</style>