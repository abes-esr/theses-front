<template>
  <div>
    <ClientOnly>
      <Message-box ref="messageBox"></Message-box>
    </ClientOnly>
    <!--  Mobile -->
    <ClientOnly>
      <CommonHeaderMobile v-if="mobile" type="these" @displayError="displayError" @activate-menu="activateMenu"
        @activate-search-bar="activateSearchBar" @activate-thesis-access="activateThesisAccess"
        :categories-valide="categoriesValide" :boutons-autres="boutonsAutres" :show-menu="showMenu"
        :show-search-bar="showSearchBar" :these-soutenue="these.isSoutenue" :status="these.status">
      </CommonHeaderMobile>
    </ClientOnly>
    <!--    Menu accès these boutons-liens -->
    <ClientOnly>
      <v-dialog v-model="dialogVisible" :eager="true" location-strategy="static" :persistent="true" no-click-animation
        :fullscreen="true" :close-on-content-click="false" transition="dialog-top-transition" content-class="full-screen">
        <LazyThesesButtonsList :source="these.source" :soutenue="these.isSoutenue" :status="these.status"
          :categories-valide="categoriesValide" :boutons-autres="boutonsAutres" :date-soutenance="these.dateSoutenance"
          @closeOverlay="closeOverlay"></LazyThesesButtonsList>
      </v-dialog>
    </ClientOnly>
    <!--  Fin Mobile-->
    <!--Desktop-->
    <div v-if="!mobile" class="sub-header">
      <div class="search-bar-container white-containers">
        <div class="sub_header__logo">
          <nuxt-link :to="{ path: '/', query: { domaine: 'theses' } }" title="Accueil du site">
            <img class="logo" alt="logo Theses" id="logoIMG" src="@/assets/icone-theses.svg" />
          </nuxt-link>
          <h1 v-html='$t("slogan2lines")'></h1>
        </div>
        <div class="sub_header__action">
          <CommonDomainSelector></CommonDomainSelector>
          <GenericSearchBar @onError="displayError" />
        </div>
      </div>
    </div>

    <div class="thesis-main-wrapper">
      <!-- Infos these -->
      <div class="thesis-components white-containers">
        <!-- TODO: Semble générer un bug lors de l'hydratation-->
        <ThesesThesisComponent v-if="dataReady" :soutenue="these.isSoutenue" :nnt="props.id" :these="these"
          :categories-valide="categoriesValide" :boutons-autres="boutonsAutres"></ThesesThesisComponent>

        <ClientOnly>
          <ThesesThesisSkeleton v-if="!dataReady"></ThesesThesisSkeleton>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent, toRaw } from "vue";
import { useDisplay } from "vuetify";

const MessageBox = defineAsyncComponent(() => import('../common/MessageBox.vue'));

const { mobile } = useDisplay();
const { getThese, getButtons, getNNTifExists } = useThesesAPI();
const dialogVisible = ref(false);
const showMenu = ref(false);
const showSearchBar = ref(false);
const dataReady = ref(false);
const these = ref({});
const resume = ref("");
const categories = ref([]);
const hasScrolled = ref(false);
const categoriesValide = ref([]);
const boutonsAutres = ref([]);
let isServer = false;
if (process.server) isServer = true;

const props = defineProps({
  id: {
    type: String
  }
});

if (!isServer) {
  window.addEventListener('scroll', () => { hasScrolled.value = true; });
}

getNNTifExists(props.id).then(result => {
  if (result.data.value) {
    return navigateTo("/" + result.data.value, { replace: true });
  }
})

getThese(props.id).then(result => {

  if (result.data.value === "") {
    showError({
      fatal: true,
      statusCode: 404,
      statusMessage: `Page introuvable`,
    });
  }
  these.value = result.data.value;
  resume.value = these.value.resumes.fr;
  loadButtons(toRaw(these.value));

  dataReady.value = !result.pending.value;
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
      if (res.data.value !== null && typeof res.data.value.categories !== 'undefined') {
        categories.value = res.data.value.categories;

        categoriesValide.value = categories.value.filter((category) => category.libelle === "Validé par le jury")[0]['sousCategories'];
        boutonsAutres.value = categories.value.filter((category) => category.libelle === "Autres versions")[0]['boutons'];

        putEmbargoTextAndESRButtonBeforeEveryhting();
      }
    })
      .catch((err) => {
        displayError("Accès en ligne : " + err.message);
      })
  }
}

function putEmbargoTextAndESRButtonBeforeEveryhting() {
  categoriesValide.value.forEach(sousCategorie => {
    if (sousCategorie.libelle === "Dépôt national") {
      let indexEmbargo = sousCategorie.boutons.findIndex((bouton) => bouton.typeAcces === "EMBARGO");

      if (indexEmbargo > -1) {
        let embargoObject = sousCategorie.boutons.splice(indexEmbargo, 1);
        sousCategorie.boutons.splice(0, 0, toRaw(embargoObject[0]));

        let indexESR = sousCategorie.boutons.findIndex((bouton) => bouton.typeAcces === "ACCES_ESR");
        if (indexESR > -1) {
          let esrObject = sousCategorie.boutons.splice(indexESR, 1);
          sousCategorie.boutons.splice(1, 0, toRaw(esrObject[0]));
        }
      }
    }
  });
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
  padding: 30px 0;
  display: grid;
  grid-template-columns: 10fr 103fr 10fr;
  align-items: start;
  width: 100%;
  margin-top: 0 !important;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    grid-template-columns: 100%;
    padding: 8px 0;
    margin-top: 0 !important;
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