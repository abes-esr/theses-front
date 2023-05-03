<template>
  <Message-box ref="messageBox"></Message-box>
  <!-- <nav v-if="mobile" class="mobile-nav-bar"> -->
    <!--    Bouton filtres-->
   <!-- <button @click="dialogVisible = true" class="filter-mobile-nav-bar">
      <v-icon v-bind="props" size="40px">mdi-filter-variant
      </v-icon>
      <span v-bind="props">Filtrer</span>
    </button> -->
    <!--    Bouton menu recherche/selecteur these/personnes-->
    <!-- <v-icon @click="showSearchBar = !showSearchBar" size="40px"
      :class="{ 'magnify-logo-active': showSearchBar }">mdi-magnify
    </v-icon>
  </nav> -->
  <!--    Menu filtres-->
  <!-- <div v-if="mobile" class="logo-menu-wrapper">
    <RouterLink :to="{ name: 'home' }" title="Accueil du site" class="logo">
      <img alt="logo Theses" id="logoIMG" src="@/assets/icone-thesi
    s.svg" />
    </RouterLink> -->
    <!--    Menu recherche/selecteur these/personnes-->
    <!-- <v-dialog v-model="dialogVisible" eager location-strategy="static" persistent no-click-animation fullscreen
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
  </div> -->

  <!-- Bare laterale Desktop -->
  <!-- <div v-else class="sub-header"> -->
<div class="sub-header">
    <div class="left-side sub_header__logo">
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

  <div class="thesis-main-wrapper">
    <div v-if="!mobile" class="nav-bar">
        <buttons-list></buttons-list>


      <!-- 
        Futur composent boutons (bare de gauche)
      <facets-list @update="update" @loadChips="loadChips" @searchAndReinitialize="searchAndReinitialize" :facets="facets"
        :reset-facets="resetFacets" :reinitialize-date-from-trigger="reinitializeDateFromTrigger"
        :reinitialize-date-to-trigger="reinitializeDateToTrigger" :domaine="domainNameChange"
        :parameters-loaded="parametersLoaded" :filter-to-be-deleted="filterToBeDeleted" :loading="!dataFacetsReady"
        class="left-side"></facets-list> -->
    </div>
    <div class="thesis-components">
      <!-- Futur coposent affichage these
        <result-components :data-ready="dataReady" :result="result" :loading="loading" :nb-result="nbResult"
        :reset-page="resetPage" :reset-showing-number="resetShowingNumber" :domain-name-change="domainNameChange"
        :facets="selectedFacets" @search="search" @deleteFilter="deleteFilter">
      </result-components> -->
    </div>
  </div>




    <!-- <div class="pa-4">
        <Message-box ref="messageBox"></Message-box> -->
        <!-- <v-row class="justify-center">
            <v-col cols="12" md="6" class="pt-0">
                <domain-selector compact></domain-selector>
            </v-col>
        </v-row> -->
        <!--<v-row class="justify-center">
            <v-col cols="12" md="6" class="py-0">
                <search-bar @search="search" :loading="loading" @onError="displayError" />
            </v-col>
        </v-row>-->
        <!-- <v-row v-if="dataReady">
            <v-col cols="2" class="pa-6 pl-8">
                <v-row>
                    <h2>{{ $t('theseView.motcle') }}</h2>
                </v-row>
                <v-row>
                    <v-list density="compact" v-if="selected === 'fr'" :items="keywordsFR"></v-list>
                    <v-list density="compact" v-if="selected === 'en'" :items="keywordsEN"></v-list>
                </v-row>
            </v-col>
            <v-col cols="10">
                <h1>
                    {{ these.titrePrincipal }}
                </h1>
                <h2 class="pb-4">{{ $t('theseView.par') }}

                    <span v-for="(item, index) in these.auteurs" :key="item.ppn"> <strong class="orange">{{
                        item.prenom
                    }} {{ item.nom }} </strong><span v-if="index < these.auteurs.length - 2">,
                        </span></span>

                </h2>
                <v-row class="pa-0 ma-0">
                    <v-chip :class="these.status" label variant="elevated" class="mr-2">
                        <span v-if="these.status === 'enCours'"><v-icon start icon="mdi-cogs"></v-icon>Préparation</span>
                        <span v-if="these.status === 'soutenue'"><v-icon start
                                icon="mdi-school-outline"></v-icon>Soutenue</span>
                    </v-chip>
                    <h4 class="normalFont pb-4 pt-1 pl-3">{{ $t('theseView.theseDe') }} {{ these.discipline }} </h4>
                </v-row>
                <div class="pl-6">
                    <div class="desc pl-3">
                        <p> {{ $t('theseView.direction') }}
                            <span v-for="(item, index) in these.directeurs" :key="item.ppn"> <strong class="orange">{{
                                item.prenom
                            }} {{ item.nom }} </strong><span v-if="index < these.directeurs.length - 2">,
                                </span>
                                <span v-if="index == these.directeurs.length - 2"> {{ $t('theseView.et') }}
                                </span></span>.

                        </p>
                        <p> <strong>
                                <span v-if="these.source === 'sudoc'">{{ $t('theseView.soutenueEn') }}{{
                                    these.dateSoutenance.slice(-4)
                                }}</span>
                                <span v-else>{{
                                    $t('theseView.soutenue')
                                }}{{
                                    these.dateSoutenance
                                }}</span></strong> {{ $t('theseView.a') }}
                            <strong>{{
                                these.etabSoutenance.nom
                            }}</strong>

                            <span v-if="these.etabCotutelle.length > 0">{{ $t('theseView.cotutelle') }} <span
                                    v-for="(item, index) in these.etabCotutelle" :key="item.ppn"><strong> {{
                                        item.nom
                                    }} </strong><span v-if="index < these.etabCotutelle.length - 1">,
                                    </span></span> </span>

                            <span v-if="these.ecolesDoctorales.length > 0">{{ $t('theseView.cadre') }} <span
                                    v-for="(item, index) in these.ecolesDoctorales" :key="item.ppn"><strong> {{
                                        item.nom
                                    }} </strong><span v-if="index < these.ecolesDoctorales.length - 1">,
                                    </span></span></span>

                            <span v-if="these.partenairesRecherche.length > 0">{{ $t('theseView.partenariat') }}, <span
                                    v-for="(item, index) in these.partenairesRecherche" :key="item.ppn"><strong> {{
                                        item.nom
                                    }} ({{ item.type }})</strong><span
                                        v-if="index < these.partenairesRecherche.length - 1">,
                                    </span></span></span>.
                        </p>
                        <p><span v-if="these.presidentJury.nom">
                                {{ $t('theseView.president') }} <strong>{{ these.presidentJury.prenom }} {{
                                    these.presidentJury.nom
                                }}</strong>.</span> {{ $t('theseView.jury') }} <span
                                v-for="(item, index) in these.membresJury" :key="item.ppn"><strong>{{
                                    item.prenom
                                }} {{ item.nom }} </strong><span v-if="index < these.membresJury.length - 1">,
                                </span></span>.

                            <span v-if="these.rapporteurs.length > 0">{{ $t('theseView.rapporteur') }} <span
                                    v-for="(item, index) in these.rapporteurs" :key="item.ppn"><strong> {{
                                        item.prenom
                                    }} {{ item.nom }}</strong><span v-if="index < these.rapporteurs.length - 1">,
                                    </span></span>.</span>
                        </p>
                    </div>
                    <v-row class="ma-0 pt-8">
                        <h4>{{ $t('theseView.resume') }}</h4>
                    </v-row>
                    <v-row class="ma-0 pb-6 pt-2">
                        <div v-for="(item, key) in these.resumes" :key="item">
                            <span @click="select(key)">
                                <h4 class="normalFont clickable px-2" :class="selected === key ? 'selected' : ''"> {{
                                    key
                                }}</h4>
                            </span>
                        </div>
                    </v-row>
                    <v-row class="ma-0">
                        <span> {{ resume }}</span>
                    </v-row>

                </div>
            </v-col>
        </v-row>
        <ScrollToTopButton v-show="hasScrolled" class="scroll-to-top-wrapper" :nb-result=1 />

    </div> -->
</template>

<script setup>
import { ref, onBeforeMount, watch, defineAsyncComponent, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useMeta } from 'vue-meta';
import { useI18n } from "vue-i18n";
import ScrollToTopButton from "@/components/common/ScrollToTopButton.vue";
import SearchBar from "@/components/personnes/search/SearchBar.vue";
import ButtonsList from "@/components/theses/ButtonsList.vue";




import DomainSelector from '@/components/common/DomainSelector.vue';

import { APIService } from '@/services/StrategyAPI';

const MessageBox = defineAsyncComponent(() => import('@/components/common/MessageBox.vue'));

const route = useRoute();

const { getData } = APIService();

let selected = ref('fr');

let dataReady = ref(false);

let these = ref({});

let resume = ref("");

let keywordsFR = [];
let keywordsEN = [];

const { t } = useI18n();
const { meta } = useMeta({});

watchEffect(() => {
    const titleThese = these.value.titrePrincipal ? these.value.titrePrincipal : "";
    meta.title = titleThese;
    meta.description = t("meta.descThese") + titleThese;
});

let hasScrolled = ref(false);

onBeforeMount(() => {
    dataReady.value = false;
    window.addEventListener('scroll', () => { hasScrolled.value = true; });
    getData(route.params.id).then(result => {
        these.value = result.data;
        resume.value = these.value.resumes.fr;
        dataReady.value = true;
        setKeywords();
    }).catch(error => {
        displayError(error.message);
    });
});

function setKeywords() {
    keywordsFR = these.value.sujetsRameau.concat(these.value.sujetsFR);
    keywordsEN = these.value.sujetsEN;
}

function select(selection) {
    selected.value = selection;
}

watch(selected, async (newSelected) => {
    for (const [key, value] of Object.entries(these.value.resumes)) {
        if (key === newSelected)
            resume.value = value;
    }
});

const messageBox = ref(null);

function displayError(message) {
    messageBox.value?.open(message, {
        type: "error"
    });
}

</script>

<style scoped lang="scss">
@use 'vuetify/settings';

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

.thesis-main-wrapper {
  display: grid;
  grid-template-columns: 20vw auto;
  align-items: start;
  margin-top: 0;
  width: 100%;
  height: 100%;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    grid-template-columns: 100%;
  }

  .thesis-components {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
}

.nav-bar {
  height: 100%;
  width: 100%;
  max-width: 20vw;
  border-right: 3px solid rgb(var(--v-theme-text-dark-blue));
}
.clickable {
    cursor: pointer;
}

.selected {
    border-bottom: solid 2px rgb(var(--v-theme-orange-abes));
}

.normalFont {
    font-weight: normal;
}

.orange {
    color: rgb(var(--v-theme-orange-abes));
}

.desc {
    border-left: solid 5px rgb(var(--v-theme-orange-abes));
}

.soutenue {
    background-color: rgb(var(--v-theme-orange-abes));

}

.enCours {
    background-color: rgb(var(--v-theme-secondary));
    ;
}

.v-list {
    background-color: transparent !important;
}

.scroll-to-top-wrapper {
    position: sticky;
    top: 90vh;
    margin-bottom: 1rem;
    margin-left: 97%;
    width: 30px;
    height: 30px;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
        margin: 0 0;
        height: 60px;
        left: 90vw;
        top: unset;
        bottom: 1vh;
    }
}
</style>