<template>
  <Message-box ref="messageBox"></Message-box>
  <nav>
    <v-menu v-if="mobile" :close-on-content-click="false" content-class="full-screen" location-strategy="static">
      <template v-slot:activator="{ props }">
        <v-icon v-bind="props" size="40px">mdi-menu
        </v-icon>
      </template>
      <domain-selector compact></domain-selector>
      <search-bar @search="searchAndReinitializeFacet" :loading="loading" @onError="displayError" />
      <h4>Affiner la recherche</h4>
      <GenericFacetsDrawer @update="update" @searchAndReinitialize="searchAndReinitialize" :facets="facets"
        :reset-facets="resetFacets" class="left-side"></GenericFacetsDrawer>
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
      <domain-selector compact></domain-selector>
      <search-bar @search="searchAndReinitializeFacet" :loading="loading" @onError="displayError" />
    </div>
  </div>
  <div v-if="!mobile" class="vertical-thread"></div>
  <div v-if="!mobile" class="search-filter">
    <h4 class="left-side">Affiner la recherche</h4>
    <result-pagination-top v-if="!mobile" v-model:current-page=currentPage :nb-results=nbResult @changePage="updatePage"
      @changeNombre="updateNombre" @changeTri="updateTri"></result-pagination-top>
  </div>
  <div class="main-wrapper">
    <span class="left-side nav-bar" v-if="!mobile">
      <GenericFacetsDrawer @update="update" @searchAndReinitialize="searchAndReinitialize" :facets="facets"
        :reset-facets="resetFacets" class="left-side"></GenericFacetsDrawer>
      <v-btn class="mt-4" @click="update()">Appliquer les filtres</v-btn>
      <!--      Mettre à jour filtres dans thesesAPI depuis une nouvelle fonction-->
    </span>
    <div class="result-list">
      <div v-if="dataReady">
        <h1 class="pb-6">{{ nbResult }}{{
          $t(currentRoute.query.domaine +
            ".resultView.resultats")
        }} :
          {{ request }}</h1>
        <div v-if="mobile" class="result-list-wrapper">
          <ScrollToTopButton v-if="moreThanXResults(5)" class="scroll-top-wrapper" :nb-result=nbResult />
          <GenericResultList :result="result">
          </GenericResultList>
          <MoreResultsButton v-if="!allResultsWereLoaded()" :loading=loading :nb-result=nbResult
            @changeNombre="updateNombre" />
        </div>
        <v-row v-else>
          <v-col cols="11" class="colonnes-resultats">
            <GenericResultList :result="result">
            </GenericResultList>
            <MoreResultsButton :loading=loading :nb-result=nbResult @changeNombre="updateNombre" />
          </v-col>
          <v-col cols="1" class="colonnes-resultats">
            <ScrollToTopButton v-if="moreThanXResults(5)" :nb-result=nbResult />
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
  <div class="search-filter">
    <div class="left-side"></div>
    <result-pagination-bottom v-model:current-page=currentPage v-if="!mobile" :nb-results=nbResult
      :current-nombre=currentNombre @changePage="simpleUpdatePage">
    </result-pagination-bottom>
  </div>
</template>

<script setup>
import { defineAsyncComponent, onMounted, ref, watch } from "vue";
import { useRoute } from 'vue-router';
import { thesesAPIService } from "@/services/ThesesAPI";
import { personnesAPIService } from "@/services/PersonnesAPI";
import { referentielsAPIService } from "@/services/ReferentielsAPI";
import { useDisplay } from 'vuetify';
import GenericFacetsDrawer from '@/components/generic/GenericFacetsDrawer.vue';
import SearchBar from '../components/generic/GenericSearchBar.vue';
import DomainSelector from '@/components/common/DomainSelector.vue';
import ResultPaginationTop from '@/components/common/results/ResultPaginationTop.vue';
import ResultPaginationBottom from '@/components/common/results/ResultPaginationBottom.vue';
import GenericResultList from "@/components/generic/GenericResultList.vue";
import ScrollToTopButton from "@/components/common/results/ScrollToTopButton.vue";
import MoreResultsButton from "@/components/common/results/MoreResultsButton.vue";

const { modifierPage, modifierNombre, modifierTri } = thesesAPIService();
const { mobile } = useDisplay();
const MessageBox = defineAsyncComponent(() => import('@/components/common/MessageBox.vue'));
const { rechercherThese, getFacets, setQuery } = thesesAPIService();
const { rechercherPersonne } = personnesAPIService();
const { fetchCodeLangues, createLabels } = referentielsAPIService();
const request = ref("");
const currentRoute = useRoute();
const isBurgerMenuOpen = ref(false);
const messageBox = ref(null);
const resetFacets = ref(0);
const loading = ref(false);
const result = ref([]);
const facets = ref({});
const nbResult = ref(0);
const dataReady = ref(false);
const currentPage = ref(1);
const currentNombre = ref(10);

onMounted(() => {
  dataReady.value = false;
  request.value = decodeURI(currentRoute.query.q);
  setQuery(request.value);
  search();
  updateFacets();
});


async function search() {
  if (currentRoute.query.domaine == "theses") {
    rechercherThese().then(response => {
      result.value = response.theses;
      nbResult.value = response.totalHits;
    }).catch(error => {
      displayError(error.message);
    }).finally(() => {
      loading.value = false;
      dataReady.value = true;
    });
  } else if (currentRoute.query.domaine == "personnes") {
    try {
      result.value = await rechercherPersonne();
      nbResult.value = result.value.length;
    } catch (error) {
      displayError(error.message);
    } finally {
      loading.value = false;
      dataReady.value = true;
    }
  }
}

function setQueryView(query) {
  request.value = query;
  loading.value = true;
}

/**
 * Fonctions
 */
function simpleUpdatePage(payload) {
  modifierPage(payload);
  // Mise à jour des valeurs de pagination dans tous les composants
  currentPage.value = payload;
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

function update() {
  reinitialize();
  search();
}

function moreThanXResults(x) {
  return (result.value.length >= x);
}

function allResultsWereLoaded() {
  return moreThanXResults(nbResult.value);
}

function displayError(message) {
  messageBox.value?.open(message, {
    type: "error"
  });
}

function updateFacets() {
  getFacets().then(response => {
    facets.value = createLabels(response.data);
  }).catch(error => {
    displayError(error.message);
  });

  // Peuplement de la liste des codes langues
  fetchCodeLangues();
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

function searchAndReinitializeFacet(query) {
  setQueryView(query);
  resetFacets.value++;
}

function searchAndReinitialize() {
  reinitialize();
  search();
  updateFacets();
}
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

.result-list-wrapper {
  display: grid;
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