<template>
    <ClientOnly><Message-box ref="messageBox"></Message-box></ClientOnly>
    <!--  Mobile-->
    <ClientOnly>
        <CommonHeaderMobile v-if="mobile" type="resultats" @changeDomain="changeDomain" @search="search"
            @searchAndReinitializeAllFacets="searchAndReinitializeAllFacets" @displayError="displayError"
            @activateMenu="activateMenu" @activateSearchBar="activateSearchBar" @activateFilterMenu="activateFilterMenu"
            :loading="loading" :show-menu="showMenu" :show-search-bar="showSearchBar"></CommonHeaderMobile>
    </ClientOnly>
    <!--    Menu filtres  -->
    <v-dialog v-model="dialogVisible" eager location-strategy="static" persistent no-click-animation fullscreen
        :close-on-content-click="false" transition="dialog-top-transition" content-class="full-screen">
        <CommonResultsFacetsHeader @closeOverlay="closeOverlay"
            @searchAndReinitializeAllFacets="searchAndReinitializeAllFacets"></CommonResultsFacetsHeader>
        <CommonResultsFacetsList @update="update" @loadChips="loadChips" @searchAndReinitialize="searchAndReinitialize"
            :loading="!dataFacetsReady" @closeOverlay="closeOverlay" :facets="facets" :reset-facets="resetFacets"
            :reinitialize-date-from-trigger="reinitializeDateFromTrigger"
            :reinitialize-date-to-trigger="reinitializeDateToTrigger" :domaine="domainNameChange"
            :parameters-loaded="parametersLoaded" :filter-to-be-deleted="filterToBeDeleted" class="left-side">
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
                <h1>{{ $t("slogan") }}</h1>
            </div>
            <div class="sub_header__action">
                <CommonDomainSelector @changeDomain="changeDomain" compact></CommonDomainSelector>
                <GenericSearchBar @searchAndReinitializeAllFacets="searchAndReinitializeAllFacets" :loading="loading"
                    @onError="displayError" />
            </div>
        </div>
    </div>

    <div class="result-main-wrapper">
        <div v-if="!mobile" class="nav-bar">
            <CommonResultsFacetsHeader @searchAndReinitializeAllFacets="searchAndReinitializeAllFacets">
            </CommonResultsFacetsHeader>
            <CommonResultsFacetsList @update="update" @loadChips="loadChips" @searchAndReinitialize="searchAndReinitialize"
                :facets="facets" :reset-facets="resetFacets" :reinitialize-date-from-trigger="reinitializeDateFromTrigger"
                :reinitialize-date-to-trigger="reinitializeDateToTrigger" :domaine="domainNameChange"
                :parameters-loaded="parametersLoaded" :filter-to-be-deleted="filterToBeDeleted" :loading="!dataFacetsReady"
                class="left-side"></CommonResultsFacetsList>
        </div>
        <!--    Mobile & desktop-->
        <div class="result-components white-containers">
            <CommonResultsResultComponents :data-ready="dataReady" :result="result" :loading="loading" :nb-result="nbResult"
                :persistentQuery="request" :reset-page="resetPage" :reset-showing-number="resetShowingNumber"
                :domain-name-change="domainNameChange" :facets="selectedFacets" @search="search"
                @deleteFilter="deleteFilter">
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
    setDomaine,
    setPageNumber,
    setShowingNumber,
    setCheckedFilters,
    getURLParameters,
    setWorkingFacetName
} = useStrategyAPI();

const MessageBox = defineAsyncComponent(() => import('/components/common/MessageBox.vue'));

const currentRoute = useRoute();
const request = ref("");
const result = ref([]);
const dataReady = ref(false);
const dataFacetsReady = ref(false);
const messageBox = ref(null);
const resetFacets = ref(0);
const loading = ref(false);
const facets = ref({});
const nbResult = ref(0);
const resetPage = ref(0);
const resetShowingNumber = ref(0);
const domainNameChange = ref(currentRoute.query.domaine);
const dialogVisible = ref(false);
const showMenu = ref(false);
const showSearchBar = ref(false);
const selectedFacets = ref([]);
const filterToBeDeleted = ref([]);
const numberOfDeletedChips = ref(0);
const parametersLoaded = ref(0);
const reinitializeDateFromTrigger = ref(0);
const reinitializeDateToTrigger = ref(0);


//Titre statique
definePageMeta({
    title: 'Résultats | Theses.fr'
})


onMounted(async () => {
    getURLParameters().then(() => {
        setDomaine(currentRoute.query.domaine);
        dataReady.value = false;
        request.value = decodeURI(currentRoute.query.q);
        setQuery(request.value);
        search(true);
        //Titre surchargé lors de l'hydratation
        useSeoMeta({
            title: () => `Résultats pour ${request.value} | Theses.fr`,
            ogTitle: () => `${titleThese} | Theses.fr`,
            description: () => `Résultats pour ${request.value} | Theses.fr`,
            ogDescription: () => `Résultats pour ${request.value} | Theses.fr`,
            ogImage: "https://beta.theses.fr/_nuxt/icone-theses-beta.svg",
            ogImageAlt: 'Logo Theses.fr',
            twitterCard: 'summary_large_image',
        })
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

function moreThanXResults(x) {
    if (typeof result.value.length === 'undefined')
        return false;
    return (result.value.length >= x);
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

watch(() => currentRoute.query.domaine, () => {
    setDomaine(currentRoute.query.domaine);
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

.domain-selector {
    :deep(.v-btn__content) {
        flex-direction: row !important;
    }

    :deep(.v-icon) {
        margin-right: 1rem !important;
    }
}
</style>