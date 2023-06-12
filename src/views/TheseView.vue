<template>
  <Message-box ref="messageBox"></Message-box>
  <nav v-if="mobile" class="mobile-nav-bar">
    <button @click="dialogVisible = true" class="filter-mobile-nav-bar">
      <v-icon v-bind="props" size="40px">mdi-menu
      </v-icon>
    </button>
    <!--      Bouton menu recherche/selecteur these/personnes-->
    <v-icon @click="showSearchBar = !showSearchBar" size="40px"
      :class="{ 'magnify-logo-active': showSearchBar }">mdi-magnify
    </v-icon>
  </nav>
  <!-- Icone retour accueil -->
  <div v-if="mobile" class="logo-menu-wrapper">
    <RouterLink :to="{ name: 'home' }" title="Accueil du site" class="logo">
      <img alt="logo Theses" id="logoIMG" src="@/assets/icone-theses.svg" />
    </RouterLink>
    <!--    Menu boutons-liens-->
    <v-dialog v-model="dialogVisible" eager location-strategy="static" persistent no-click-animation fullscreen
      :close-on-content-click="false" transition="dialog-top-transition" content-class="full-screen">
      <buttons-list :nnt="route.params.id" @closeOverlay="closeOverlay"></buttons-list>
    </v-dialog>
    <!--    Menu recherche/selecteur these/personnes-->
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

  <!-- Bare latérale Desktop -->
  <div v-else class="sub-header">
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
      <!-- Futur composant boutons (barre de gauche)-->
      <buttons-list :nnt="route.params.id"></buttons-list>
    </div>
    <div class="thesis-components">
      <thesis-component :these="these" :data-ready="true"></thesis-component>
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
const { getThese } = thesesAPIService();
const dialogVisible = ref(false);
const showSearchBar = ref(false);
const dataReady = ref(false);
const these = ref({});
const resume = ref("");

const hasScrolled = ref(false);


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
  dataReady.value = true;
}).catch(error => {
  displayError(error.message);
});



function select(selection) {
  selected.value = selection;
}

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


.mobile-nav-bar {
  display: flex;
  justify-content: space-between;
  align-content: center;
  padding: 0 10px;
}

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

.magnify-logo-active {
  color: rgb(var(--v-theme-orange-abes));
}

.expanded-search-bar-container {
  width: 100%;
  grid-column: 1 / 5;
  justify-self: center;
  grid-row-start: 1;
  align-self: start;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(var(--v-theme-gris-clair));
  border-bottom: 1px solid #bbb;
  border-top: 1px solid #bbb;
}


.expanded-search-bar {
  width: 80%;
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