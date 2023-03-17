<template>
  <Message-box ref="messageBox"></Message-box>
  <nav>
    <v-menu v-if="mobile" :close-on-content-click="false" content-class="full-screen" location-strategy="static">
      <template v-slot:activator="{ props }">
        <v-icon v-bind="props" size="40px">mdi-menu
        </v-icon>
      </template>
      <domain-selector @changeDomain="changeDomain" compact></domain-selector>
      <search-bar @search="search" @searchAndReinitializeFacet="searchAndReinitializeFacet" :loading="loading" @onError="displayError" />
      <h4>Affiner la recherche</h4>
      <FacetsList @update="update" @searchAndReinitialize="searchAndReinitialize" :facets="facets"
        :reset-facets="resetFacets" class="left-side"></FacetsList>
      <v-btn class="mt-4" @click="update()">Appliquer les filtres</v-btn>
    </v-menu>
  </nav>
  <RouterLink class="logo" :to="{ name: 'home' }" v-if="mobile">
    <img alt="logo" id="logoIMG" src="@/assets/icone-theses.svg" />
  </RouterLink>
  <div v-else class="sub-header">
    <div class="left-side sub_header__logo">
      <RouterLink :to="{ name: 'home' }">
        <img class="logo" alt="logo" id="logoIMG" src="@/assets/icone-theses.svg" />
      </RouterLink>
      <h1>{{ $t("slogan") }}</h1>
    </div>
    <div class="sub_header__action">
      <domain-selector @changeDomain="changeDomain" compact></domain-selector>
      <search-bar @searchAndReinitializeFacet="searchAndReinitializeFacet" :loading="loading" @onError="displayError" />
    </div>
  </div>
  <div v-if="!mobile" class="vertical-thread"></div>
  <div v-if="!mobile" class="search-filter">
    <h4 class="left-side">Affiner la recherche</h4>
  </div>
  <div class="main-wrapper">
    <span class="left-side nav-bar" v-if="!mobile">
      <FacetsList @update="update" @searchAndReinitialize="searchAndReinitialize" :facets="facets"
        :reset-facets="resetFacets" class="left-side"></FacetsList>
      <v-btn class="mt-4" @click="update()">Appliquer les filtres</v-btn>
    </span>
    <div class="result-list">
      <result-list :data-ready="dataReady" :result="result" :loading="loading">
      </result-list>
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
import ResultList from "@/components/common/results/ResultList.vue";

const { mobile } = useDisplay();
const { setQuery, queryAPI, getFacets, setDomaine, modifierPage, modifierNombre, modifierTri } = APIService();
const MessageBox = defineAsyncComponent(() => import('@/components/common/MessageBox.vue'));

const currentRoute = useRoute();
const request = ref("");
const result = ref([]);
const dataReady = ref(false);
const isBurgerMenuOpen = ref(false);
const messageBox = ref(null);
const resetFacets = ref(0);
const loading = ref(false);
const facets = ref({});
const nbResult = ref(0);
const currentPage = ref(1);
const currentNombre = ref(10);

onMounted(() => {
  dataReady.value = false;
  setQuery(decodeURI(currentRoute.query.q));
  search();
  updateFacets();
});

/**
 * Fonctions
 */
async function search() {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    if (currentRoute.query.domaine === "theses") {
      queryAPI().then(response => {
        result.value = response.theses;
        nbResult.value = response.totalHits;
      }).catch(error => {
        displayError(error.message);
        reject(error)
      }).finally(() => {
        loading.value = false;
        dataReady.value = true;
        resolve();
      });
    } else if (currentRoute.query.domaine === "personnes") {
      try {
        result.value = await queryAPI();
        nbResult.value = result.value.length;
      } catch (error) {
        displayError(error.message);
        reject(error);
      } finally {
        loading.value= false;
        dataReady.value = true;
        resolve();
      }
    }
  });

  /**
   * #TODO Version généralisée à implémenter après normalisation de l'api
   */
  // eslint-disable-next-line no-async-promise-executor
  // return queryAPI().then(async () => {
  //       result.value = await queryAPI();
  //       nbResult.value = result.value.length;
  //       domainName = currentRoute.query.domaine;
  //     }).catch(error => {
  //       displayError(error.message);
  //     }).finally(() => {
  //       loading.value = false;
  //       dataReady.value = true;
  //     });
}

function update() {
  reinitialize();
  search();
}

function displayError(message) {
  messageBox.value?.open(message, {
    type: "error"
  });
}

function updateFacets() {
  getFacets().then(response => {
    facets.value = response;
  }).catch(error => {
    facets.value = {};
    displayError(error.message);
  });
}

// Si on passe de desktop à mobile ou inversement, réinitialisation des pages, etc
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
  modifierPage(1);
  currentPage.value = 1;
  modifierNombre(10);
  currentNombre.value = 10;
}

async function searchAndReinitializeFacet(query) {
  setQueryView(query);
  searchAndReinitialize();
  resetFacets.value++;
}

function changeDomain() {
  setQuery(request.value);
  searchAndReinitializeFacet(request.value);
}

async function searchAndReinitialize() {
  reinitialize();
  await search();
  updateFacets();
}

function setQueryView(query) {
  query.value = query;
}


function updatePage(payload) {
  simpleUpdatePage(payload);
  search();
}

/**
 * Met à jour le nombre de résultats à afficher sur une page
 * @param payload
 */
function updateNombre(payload) {
  modifierNombre(payload);
  search();
  currentNombre.value = payload; // Mise à jour des valeurs de pagination dans tous les composants
  currentPage.value = 1; // Retour à la page une
}

function updateTri(payload) {
  modifierTri(payload);
  search();
}

function simpleUpdatePage(payload) {
  modifierPage(payload);
  // Mise à jour des valeurs de pagination dans tous les composants
  currentPage.value = payload;
}

/**
 * Watchers
 */

watch(() => currentRoute.query.domaine, () => {
  setDomaine(currentRoute.query.domaine)
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

.logo {
  margin-top: -55px;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-up')} {
    margin-top: -110px;
  }
}

.left-side {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1 0 100%;
  max-width: 20vw;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    max-width: 100%;
    flex: 0 1 auto;
    padding: 0;
  }
}

.sub-header {
  display: flex;
  flex-direction: row;
  width: 100%;

  .sub_header__logo {
    background-color: rgb(var(--v-theme-surface));
    z-index: 2;

    h1 {
      text-align: center;
      width: 80%;
      font-weight: 300;
      font-size: 16px;
    }

    .logo {
      margin-top: 0;
    }
  }

  .sub_header__action {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1 0 auto;

    .domain-selector,
    .searchbar {
      width: 70%;
    }

    .domain-selector {
      :deep(.v-btn__content) {
        flex-direction: row;
      }

      :deep(.v-icon) {
        margin-right: 1rem;
      }
    }
  }
}

.search-filter {
  display: flex;
  flex-direction: row;
  width: 100%;

  h4 {
    background-color: rgb(var(--v-theme-gris-clair));
  }

  .result-pagination {
    display: flex;
    flex-direction: row;
    width: 100%;
  }
}


.main-wrapper {
  flex-direction: row;
  align-items: flex-start;
  margin-top: 0;
  width: 100%;

  .facets {
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  .result-list {
    width: 100%;
    margin-right: 1rem;
    margin-left: 1rem;
    margin-bottom: 2rem;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-up')} {
      margin-right: 3rem;
      margin-left: 3rem;
    }
  }
}

.colonnes-resultats {
  padding: 0;
}

.scroll-top-wrapper {
  justify-content: right;
}

.vertical-thread {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  max-width: 20vw;
  border-right: 3px solid rgb(var(--v-theme-text-dark-blue));
}
</style>