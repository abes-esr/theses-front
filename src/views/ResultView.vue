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

  <div class="result-main-wrapper">
    <div v-if="!mobile">
      <div v-if="!mobile" class="vertical-thread"></div>
      <div class="nav-bar">
        <div v-if="!mobile" class="search-filter">
          <h4 class="left-side">Affiner la recherche</h4>
        </div>
        <FacetsList @update="update" @searchAndReinitialize="searchAndReinitialize" :facets="facets"
            :reset-facets="resetFacets" class="left-side"></FacetsList>
        <div class="left-side mt-4 mb-2">
          <v-btn @click="update()">Appliquer les filtres</v-btn>
        </div>
      </div>
    </div>
    <div class="result-components">
      <result-components :data-ready="dataReady" :result="result" :loading="loading" :nb-result="nbResult" :reset-page="resetPage" :reset-showing-number="resetShowingNumber" :request="request" @search="search">
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

const { mobile } = useDisplay();
const { setQuery, getQuery, queryAPI, getFacets, setDomaine, modifierPage, modifierNombre } = APIService();
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
const resetPage = ref(0);
const resetShowingNumber = ref(0);

onMounted(() => {
  setDomaine(currentRoute.query.domaine);
  dataReady.value = false;
  request.value = decodeURI(currentRoute.query.q)
  setQuery(request.value);
  search();
  updateFacets();
});

/**
 * Fonctions
 */
async function search() {
  request.value = getQuery();
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
  resetPage.value++;
  modifierNombre(10);
  resetShowingNumber.value++;
}

async function searchAndReinitializeFacet(query) {
  setQuery(query);
  searchAndReinitialize();
  resetFacets.value++;
}

function changeDomain() {
  searchAndReinitializeFacet(request.value);
}

async function searchAndReinitialize() {
  reinitialize();
  await search();
  updateFacets();
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
  min-height: 4rem;

  h4 {
    background-color: rgb(var(--v-theme-gris-clair));
    font-size: 22px;
  }
}

.nav-bar {
  height: 100%;
  width: 100%;
}

.result-main-wrapper {
  display: grid;
  grid-template-columns: 20vw auto;
  align-items: start;
  margin-top: 0;
  width: 100%;


  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    grid-template-columns: 100%;
  }
  .result-components {
    height: 100%;
    display: flex;
    flex-direction: column;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-up')} {
    }
  }
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