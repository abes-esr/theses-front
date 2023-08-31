<template>
  <Message-box ref="messageBox"></Message-box>
  <nav v-if="mobile" class="mobile-nav-bar">
    <button v-if="these.status === 'soutenue' && showButtons" @click="dialogVisible = true" class="filter-mobile-nav-bar">
      <v-icon v-bind="props" size="40px">mdi-book-arrow-down-outline
      </v-icon>
      <v-tooltip activator="parent">{{ $t('theseView.access') }}</v-tooltip>
    </button>
    <div v-else></div>
    <!--      Bouton menu recherche/selecteur these/personnes-->
    <div>
      <v-icon @click="showSearchBar = !showSearchBar" size="40px"
        :class="{ 'logo-active': showSearchBar }">mdi-magnify
      </v-icon>
      <v-tooltip activator="parent" location="start">{{ $t('rechercher') }}</v-tooltip>
    </div>
  </nav>
  <!-- Icone retour accueil -->
  <div v-if="mobile" class="logo-menu-wrapper">
    <RouterLink :to="{ name: 'home', query: { domaine: 'theses' } }" title="Accueil du site" class="logo logo_resultview">
      <img alt="logo Theses" id="logoIMG" src="@/assets/icone-theses.svg" />
    </RouterLink>
    <!--    Menu boutons-liens-->
    <v-dialog v-model="dialogVisible" eager location-strategy="static" persistent no-click-animation fullscreen
      :close-on-content-click="false" transition="dialog-top-transition" content-class="full-screen">
      <buttons-list :nnt="route.params.id" :soutenue="these.status === 'soutenue'" :data-ready="dataReady" @closeOverlay="closeOverlay"></buttons-list>
    </v-dialog>
    <!--    Menu recherche/selecteur these/personnes-->
    <v-expand-transition>
      <div v-show="showSearchBar" class="expanded-search-bar-container white-containers">
        <div class="expanded-search-bar">
          <domain-selector @changeDomain="changeDomain" compact></domain-selector>
          <search-bar @search="search" @searchAndReinitializeAllFacets="searchAndReinitializeAllFacets" :loading="loading"
            @onError="displayError" />
        </div>
      </div>
    </v-expand-transition>
  </div>

<!--Desktop-->
  <div v-else class="sub-header">
    <div class="search-bar-container white-containers">
      <div class="sub_header__logo">
        <RouterLink :to="{ name: 'home', query: { domaine: 'theses' } }" title="Accueil du site">
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

  <div class="thesis-main-wrapper">
    <!-- Infos these -->
    <div class="thesis-components white-containers">
      <thesis-component :soutenue="these.status === 'soutenue'" :nnt="route.params.id" :these="these" :data-ready="dataReady" :list-buttons="listButtons"></thesis-component>
    </div>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from "vue";
import { useRoute } from 'vue-router';
import DomainSelector from '@/components/common/DomainSelector.vue';
import SearchBar from "@/components/personnes/search/SearchBar.vue";
import ButtonsList from "@/components/theses/ButtonsList.vue";
import ThesisComponent from "@/components/theses/ThesisComponent.vue";

import { thesesAPIService } from '@/services/ThesesAPI';
import { useDisplay } from "vuetify";
import router from "@/router";

const MessageBox = defineAsyncComponent(() => import('@/components/common/MessageBox.vue'));

const route = useRoute();
const { mobile } = useDisplay();
const { getThese, getButtons } = thesesAPIService();
const dialogVisible = ref(false);
const showSearchBar = ref(false);
const dataReady = ref(false);
const these = ref({});
const resume = ref("");
const listButtons = ref([]);

const hasScrolled = ref(false);
const showButtons = ref(false);

dataReady.value = false;
window.addEventListener('scroll', () => { hasScrolled.value = true; });
getThese(route.params.id).then(result => {
  /** Redirection */
  if (typeof result.data === 'undefined' || result.data === "") {
    router.push({
      name: 'home'
    });
  }

  these.value = result.data;
  resume.value = these.value.resumes.fr;
  loadButtons(these.value);

  dataReady.value = true;
}).catch(error => {
  displayError(error.message);
});

const messageBox = ref(null);

/**
 * Fonctions
 */
function displayError(message) {
  messageBox.value?.open(message, {
    type: "error"
  });
}

function closeOverlay() {
  dialogVisible.value = false;
}

function loadButtons(these) {
  if (these.status === 'soutenue') {
    getButtons(these.nnt).then((res) => {
      listButtons.value = res.data.buttons;
    })
      .catch((err) => {
        displayError("Accès en ligne : " + err.message);
      })
  }
}
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.filter-mobile-nav-bar {
  display: flex;
  align-content: center;

  span {
    padding: 10% 0;
  }
}

.logo-menu-wrapper {
  width: 100%;
  display: grid;
  grid-template-columns: 33% 33% 33%;
  grid-template-rows: 33% 33% 33%;
}

.logo {
  grid-column-start: 2;
  justify-self: center;
  grid-row-start: 1;
  align-self: start;
}

.logo-menu-wrapper>.expanded-search-bar-container {
  margin-bottom: 40px;
}

.logo-active {
  color: rgb(var(--v-theme-orange-abes));
}

.expanded-search-bar {
  width: 80%;
}

.thesis-main-wrapper {
  padding: 30px 0;
  display: grid;
  grid-template-columns: 10fr 103fr 10fr;
  align-items: start;
  margin-top: 0;
  width: 100%;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    grid-template-columns: 100%;
  }

  .thesis-components {
    grid-column-start: 2;

    width: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 5px;


    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
      grid-column-start: 1;
      grid-column-end: 3;
    }
  }
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