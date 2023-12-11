<template>
  <ClientOnly><Message-box ref="messageBox"></Message-box></ClientOnly>
  <!--  Mobile-->
  <ClientOnly>
    <CommonHeaderMobile v-if="mobile" type="resultats" @search="search(true)" @displayError="displayError"
      @activateMenu="activateMenu" @activateSearchBar="activateSearchBar" @activateFilterMenu="activateFilterMenu"
      :loading="loading" :show-menu="showMenu" :show-search-bar="showSearchBar"></CommonHeaderMobile>
  </ClientOnly>
  <!--    Menu filtres  -->
  <v-dialog v-model="dialogVisible" eager location-strategy="static" persistent no-click-animation fullscreen
    :close-on-content-click="false" transition="dialog-top-transition" content-class="full-screen">
    <CommonResultsFacetsHeader @closeOverlay="closeOverlay" @reinitializePageNumber="reinitializePageNumber"
    ></CommonResultsFacetsHeader>
    <CommonResultsFacetsList @reinitializePageNumber="reinitializePageNumber"
      :loading="!dataFacetsReady" @closeOverlay="closeOverlay" :facets="facets" :selected-facets-array="selectedFacetsArray" :domaine="domainNameChange"
      class="left-side">
    </CommonResultsFacetsList>
  </v-dialog>
  <!--  Fin Mobile-->
  <!--  Desktop-->
  <div v-if="!mobile" class="sub-header">
    <div class="search-bar-container white-containers">
      <div class="sub_header__logo">
        <NuxtLink :to="{ path: '/', query: { domaine: 'theses' } }" title="Accueil du site">
          <img class="logo" alt="logo Theses" id="logoIMG" src="@/assets/icone-theses.svg" />
        </NuxtLink>
        <h1 v-html='$t("slogan2lines")'></h1>
      </div>
      <div class="sub_header__action">
        <CommonDomainSelector></CommonDomainSelector>
        <GenericSearchBar :loading="loading"
          @onError="displayError" @reinitializePageNumber="reinitializePageNumber" />
      </div>
    </div>
  </div>

  <div class="result-main-wrapper">
    <div v-if="!mobile" class="nav-bar">
      <CommonResultsFacetsHeader @reinitializePageNumber="reinitializePageNumber">
      </CommonResultsFacetsHeader>
      <CommonResultsFacetsList @reinitializePageNumber="reinitializePageNumber"
        :facets="facets"  :selected-facets-array="selectedFacetsArray"
        :domaine="domainNameChange"
        :loading="!dataFacetsReady"
        class="left-side"></CommonResultsFacetsList>
    </div>
    <!--    Mobile & desktop-->
    <div class="result-components white-containers">
      <CommonResultsResultComponents :data-ready="dataReady" :result="result" :loading="loading" :nb-result="nbResult"
        :persistentQuery="request" :reset-page="resetPage"
        :domain-name-change="domainNameChange" :selected-facets-array="selectedFacetsArray"
        @reinitializePageNumber="reinitializePageNumber">
      </CommonResultsResultComponents>
    </div>
    <CommonScrollToTopButton v-if="moreThanXResults(5)" class="scroll-to-top-wrapper" :nb-result=nbResult />
  </div>
</template>

<script setup>
import { defineAsyncComponent, onMounted, ref, watch } from "vue";
import { useDisplay } from 'vuetify';
const { mobile } = useDisplay();

const {
  setQuery,
  getQuery,
  queryAPI,
  getFacets,
  getFacetsArrayFromURL,
  setDomaine,
  setPageNumber,
  setShowingNumber,
  getURLParameters,
  fetchCodeLangues
} = useStrategyAPI();

const MessageBox = defineAsyncComponent(() => import('/components/common/MessageBox.vue'));

const currentRoute = useRoute();
const selectedFacetsArray = ref([]);
const request = ref("");
const result = ref([]);
const dataReady = ref(false);
const dataFacetsReady = ref(false);
const messageBox = ref(null);
const loading = ref(false);
const facets = ref({});
const nbResult = ref(0);
const resetPage = ref(0);
const domainNameChange = ref(currentRoute.query.domaine);
const dialogVisible = ref(false);
const showMenu = ref(false);
const showSearchBar = ref(false);

//Titre statique
definePageMeta({
  title: 'Résultats | Theses.fr'
})


onMounted(async () => {
  fetchCodeLangues();

  getURLParameters().then(() => {
    setDomaine(currentRoute.query.domaine);
    dataReady.value = false;
    request.value = decodeURI(currentRoute.query.q);
    setQuery(request.value);
    search(true);
    //Titre surchargé lors de l'hydratation
    useSeoMeta({
      title: () => `Résultats pour ${request.value} | Theses.fr`,
      ogTitle: () => `Résultats pour ${request.value} | Theses.fr`,
      description: () => `Résultats pour ${request.value} | Theses.fr`,
      ogDescription: () => `Résultats pour ${request.value} | Theses.fr`,
      ogImage: "https://beta.theses.fr/logo-theses-beta.png",
      ogImageAlt: "Logo Theses.fr",
      twitterCard: "summary"
    });
  });
});

/**
 * Fonctions
 */
async function search(loadFacets = false) {
  request.value = getQuery();
  loading.value = true;
  dataReady.value = false;

  if (loadFacets)
    updateFacets();

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

function displayError(message) {
  messageBox.value?.open(message, {
    type: "error"
  });
}

function closeOverlay() {
  dialogVisible.value = false;
}

function updateFacets() {
  getFacets().then(response => {
    facets.value = response;
    dataFacetsReady.value = true;
  }).then(response => {
    selectedFacetsArray.value = getFacetsArrayFromURL();
  }).catch(error => {
    facets.value = {};
    if (typeof error !== "undefined" && typeof error.message !== "undefined") {
      displayError(error.message);
    }
  });
}

function moreThanXResults(x) {
  if (typeof result.value === "undefined")
    return false;
  else if (typeof result.value.length === "undefined")
    return false;
  return (result.value.length >= x);
}

function reinitialize() {
  reinitializePageNumber();
  setShowingNumber(10);
}

function reinitializePageNumber() {
  setPageNumber(1);
  resetPage.value++;
}

/**
 * Fonctionnement du header mobile
 */
function activateMenu() {
  showSearchBar.value = false;
  sleep(250).then(() => {
    showMenu.value = !showMenu.value;
  });
}

function activateSearchBar() {
  showMenu.value = false;
  sleep(250).then(() => {
    showSearchBar.value = !showSearchBar.value;
  });
}

function activateFilterMenu() {
  dialogVisible.value = true;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Watchers
 */
// Si on passe de desktop à mobile ou inversement, réinitialisation des variables de pagination
watch(mobile, () => {
  reinitialize();
});

watch(() => currentRoute.query.domaine, () => {
  setDomaine(currentRoute.query.domaine);
});

watch(() => currentRoute.query, (newParams, oldParams) => {
  console.log(newParams)
  console.log(oldParams)
  if (newParams.q !== oldParams.q
      || newParams.filtres !== oldParams.filtres
      // || newParams.domaine !== oldParams.domaine
  ) {
    selectedFacetsArray.value = getFacetsArrayFromURL();
    search(true);
  } else if (newParams.page !== oldParams.page || newParams.nb !== oldParams.nb || newParams.tri !== oldParams.tri) {
    search(false);
  } else {
    search(true);
  }
});

</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.grey-bar {
  background-color: rgb(var(--v-theme-gris-clair)) !important;
}

.dark-grey-bar {
  background-color: rgb(var(--v-theme-gris-fonce)) !important;
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

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
      grid-column-start: 1;
    }
  }
}
</style>