<template>
  <Message-box ref="messageBox"></Message-box>
  <!--  Mobile-->
  <CommonHeaderMobile v-if="mobile" type="these" @changeDomain="changeDomain" @search="search"
    @searchAndReinitializeAllFacets="searchAndReinitializeAllFacets" @displayError="displayError"
    @activate-menu="activateMenu" @activate-search-bar="activateSearchBar" @activate-thesis-access="activateThesisAccess"
    :loading="loading" :buttons-list="buttonsList" :show-menu="showMenu" :show-search-bar="showSearchBar"
    :these-soutenue="these.status === 'soutenue'"></CommonHeaderMobile>
  <!--    Menu accès these boutons-liens-->
  <v-dialog v-model="dialogVisible" eager location-strategy="static" persistent no-click-animation fullscreen
    :close-on-content-click="false" transition="dialog-top-transition" content-class="full-screen">
    <LazyThesesButtonsList :nnt="route.params.id" :soutenue="these.status === 'soutenue'" :data-ready="dataReady"
      :buttons-list="buttonsList" @closeOverlay="closeOverlay"></LazyThesesButtonsList>
  </v-dialog>
  <!--  Fin Mobile-->
  <!--Desktop-->
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

  <div class="thesis-main-wrapper">
    <!-- Infos these -->
    <div class="thesis-components white-containers">
      <ThesesThesisComponent :soutenue="these.status === 'soutenue'" :nnt="route.params.id" :these="these"
        :data-ready="dataReady" :buttons-list="buttonsList"></ThesesThesisComponent>
    </div>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from "vue";
import { useDisplay } from "vuetify";

const MessageBox = defineAsyncComponent(() => import('../common/MessageBox.vue'));

const route = useRoute();
const { mobile } = useDisplay();
const { getThese, getButtons } = useThesesAPI();
const dialogVisible = ref(false);
const showMenu = ref(false);
const showSearchBar = ref(false);
const dataReady = ref(false);
const these = ref({});
const resume = ref("");
const buttonsList = ref([]);
const hasScrolled = ref(false);

if (process.client) {
  window.addEventListener('scroll', () => { hasScrolled.value = true; });
}
getThese(route.params.id).then(result => {
  /** Redirection */
  if (typeof result.data === 'undefined' || result.data === "") {
    router.push({
      name: 'index'
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
      buttonsList.value = res.data.buttons;
    })
      .catch((err) => {
        displayError("Accès en ligne : " + err.message);
      })
  }
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

function activateThesisAccess() {
  dialogVisible.value = true;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
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
  margin-top: 30px !important;
  padding: 30px 0;
  display: grid;
  grid-template-columns: 10fr 103fr 10fr;
  align-items: start;
  margin-top: 0;
  width: 100%;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    grid-template-columns: 100%;
    padding: 8px 0;
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