<template>
  <Message-box ref="messageBox"></Message-box>
  <nav>
    <v-menu v-if="mobile" :close-on-content-click="false" content-class="full-screen" location-strategy="static">
      <template v-slot:activator="{ props }">
        <v-icon v-bind="props" size="40px">mdi-menu
        </v-icon>
      </template>
      <domain-selector compact></domain-selector>
      <search-bar @search="search" :loading="loading" @onError="displayError" />
      <h4>Affiner la recherche</h4>
      <GenericFacetsDrawer :facets="facets" @changeFiltres="chan"></GenericFacetsDrawer>
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
      <search-bar @search="search" :loading="loading" @onError="displayError" />
    </div>
  </div>
  <div v-if="!mobile" class="search-filter">
    <h4 class="left-side">Affiner la recherche</h4>
    <result-pagination v-if="!mobile" :nb-results=nbResult @changePage="updatePage" @changeNombre="updateNombre"
      @changeTri="updateTri"></result-pagination>
  </div>
  <div class="main-wrapper">
    <span class="left-side" v-if="!mobile">
      <GenericFacetsDrawer :facets="facets">
      </GenericFacetsDrawer>
      <v-btn class="mt-4" @click="update()">Appliquer les filtres</v-btn>
    </span>


    <div class="result-list" v-if="dataReady">
      <h1 class="pb-6">{{ nbResult }}{{
        $t(currentRoute.query.domaine +
          '.resultView.resultats')
      }} :
        {{ request }}</h1>
      <v-row>
        <v-col cols="11" class="colonnesResultats">
          <GenericResultList :result="result">
          </GenericResultList>
          <MoreResultsButton :nb-results=nbResult @changeNombre="updateNombre" />
        </v-col>
        <v-col cols="1" class="colonnesResultats">
          <!-- Go back to top-->
          <ScrollToTopButton />
        </v-col>
      </v-row>

    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { thesesAPIService } from "@/services/ThesesAPI";
import { personnesAPIService } from "@/services/PersonnesAPI";
import { useDisplay } from 'vuetify';
import GenericFacetsDrawer from '@/components/generic/GenericFacetsDrawer.vue';
import SearchBar from '../components/generic/GenericSearchBar.vue';
import DomainSelector from '@/components/common/DomainSelector.vue';
import ResultPagination from '@/components/common/ResultPagination.vue';
import GenericResultList from "@/components/generic/GenericResultList.vue";
import ScrollToTopButton from "@/components/common/ScrollToTopButton.vue";
import MoreResultsButton from "@/components/common/MoreResultsButton.vue";


const { mobile } = useDisplay()
const MessageBox = defineAsyncComponent(() => import('@/components/common/MessageBox.vue'));
const { rechercherThese, getFacets } = thesesAPIService();
const { rechercherPersonne } = personnesAPIService();
const request = ref("");
const currentRoute = useRoute();

const isBurgerMenuOpen = ref(false);

onMounted(() => {
  dataReady.value = false;
  request.value = decodeURI(currentRoute.query.q);
  search(request.value);
});

let loading = ref(false);
let result = ref([]);
let facets = ref({});
let nbResult = ref(0);
let dataReady = ref(false);

async function search(query) {
  request.value = query;
  loading.value = true;

  if (currentRoute.query.domaine == "theses") {
    rechercherThese(query).then(response => {
      result.value = response.theses;
      nbResult.value = response.totalHits;
    }).catch(error => {
      displayError(error.message);
    }).finally(() => {
      loading.value = false;
      dataReady.value = true;
    })

    getFacets(query).then(response => {
      facets.value = response.data;
    }).catch(error => {
      displayError(error.message);
    })
  } else if (currentRoute.query.domaine == "personnes") {
    try {
      result.value = await rechercherPersonne(query);
    } catch (error) {
      displayError(error.message);
    } finally {
      loading.value = false;
      dataReady.value = true;
    }
  }
}

const { modifierPage, modifierNombre, modifierTri } = thesesAPIService();

function updatePage(payload) {
  modifierPage(payload);
  search(request.value);
}

function updateNombre(payload) {
  modifierNombre(payload);
  search(request.value);
}

function updateTri(payload) {
  modifierTri(payload);
  search(request.value);
}

function update() {
  search(request.value);
}

const messageBox = ref(null);

function displayError(message) {
  messageBox.value?.open(message, {
    type: "error"
  })
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
}

.sub-header {
  display: flex;
  flex-direction: row;
  width: 100%;

  .sub_header__logo {
    background-color: rgb(var(--v-theme-surface));

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
    border-right: 3px solid rgb(var(--v-theme-text-dark-blue));
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
    border-right: 3px solid rgb(var(--v-theme-text-dark-blue));
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

.colonnesResultats {
  padding: 0;
}
</style>