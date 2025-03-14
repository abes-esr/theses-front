<template>
  <ClientOnly><Message-box ref="messageBox"></Message-box></ClientOnly>
  <!--  Mobile-->
  <ClientOnly>
    <CommonHeaderMobile v-if="mobile" @displayError="displayError" @activateMenu="activateMenu"
      @activateSearchBar="activateSearchBar" :loading="loading" :show-menu="showMenu" :show-search-bar="showSearchBar">
    </CommonHeaderMobile>
    <!--  Fin Mobile-->
  </ClientOnly>
  <!--  Desktop-->
  <div v-if="!mobile" class="sub-header">
    <div class="search-bar-container white-containers">
      <div class="sub_header__logo">
        <NuxtLink :to="{ path: '/', query: { domaine: 'theses' } }" :title="$t('homepage')">
          <img class="logo IdRef" :alt="$t('homepage')" id="logoIMG" src="@/assets/icone-theses.svg" />
        </NuxtLink>
        <h1 v-html='$t("slogan2lines")'></h1>
      </div>
      <div class="sub_header__action">
        <CommonDomainSelector></CommonDomainSelector>
        <GenericSearchBar :loading="loading" @onError="displayError" />
      </div>
    </div>
  </div>

  <div class="main-wrapper">
    <div class="result-components white-containers">
      <div class="toolbar-container">
        <CommonToolbar personne />
      </div>
      <!--   Skeletton-->
      <ClientOnly>
        <div v-if="!dataReady" class="skeleton-wrapper">
          <v-skeleton-loader type="list-item-avatar-two-line" class="skeleton"></v-skeleton-loader>
          <v-skeleton-loader type="divider" class="skeleton"></v-skeleton-loader>
          <v-skeleton-loader type="table-row"></v-skeleton-loader>
          <v-skeleton-loader type="button" class="skeleton"></v-skeleton-loader>
          <v-skeleton-loader type="divider" class="skeleton"></v-skeleton-loader>
          <v-skeleton-loader v-for="i in 4" :key="i" type="paragraph" class="skeleton-cards"></v-skeleton-loader>
        </div>
      </ClientOnly>
      <!--      End skeletton-->
      <div class="info-wrapper" v-if="dataReady && item !== null">
        <div class="info">
          <IconsIconPersonne v-if="!mobile"></IconsIconPersonne>
          <div class="nom-card" tabindex="-1" ref="firstFocusElement" aria-labelledby="nomprenom">
            <h1 class="nomprenom" id="nomprenom">
              <span class="prenom">{{ item.prenom + "\xa0" }}</span>
              <span class="nom">{{ item.nom }}</span>
            </h1>
            <a v-if="item.has_idref" class="idref-logo" :href="`https://www.idref.fr/${item.id}`" target="_blank"
              :title="$t('footer.idRef')">
              <img :alt="$t('footer.idRef')" id="logoIdref"
                :src="'/idref-icone-' + colorMode + '.svg'" />
              <span>IdRef</span>
            </a>
          </div>
        </div>

        <CommonKeywords class="thesis-component" :data-ready="true" :keywordsAreSet="true" type="personnes"
          :these="conversionMotClesFormatTheses(item.mots_cles)" />

        <!--        Tiroirs thèses par rôles-->
        <div class="theses">
          <v-expansion-panels multiple v-model="panel" class="role-expansion-panel-wrapper">
            <h2 class="sr-only">{{ $t('roleList') }}</h2>
            <template
              v-for="key in ['Auteur / Autrice', 'Directeur / Directrice', 'Rapporteur / Rapporteuse', 'Président / Présidente du jury', 'Examinateur / Examinatrice']"
              :key="key">
              <div v-if="item.theses[key] && item.theses[key].length > 0" class="role-expansion-panel">
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    <template v-slot:actions="{ expanded }">
                      <v-icon :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'" size="x-large">
                      </v-icon>
                    </template>
                    <h3 :id="anchorValueFromKey(key)">
                      {{ $t("personnes.personneView.roles." + i18nValueFromKey(key), [item.theses[key].length]) }}
                    </h3>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text role="list">
                    <div role="listitem" v-for="(these, index) in item.theses[key]" :key="`${these.id}`" class="card-wrapper">
                      <v-lazy :options="{ threshold: 1.0 }">
                        <ThesesResultsResultCard :titre="these.titre"
                          :date="these.status === 'enCours' ? new Date(these.date_inscription).toLocaleDateString('en-GB') : new Date(these.date_soutenance).toLocaleDateString('en-GB')"
                          :auteur="these.auteurs" :directeurs="these.directeurs" :discipline="these.discipline"
                          :etab="these.etablissement_soutenance.nom" :etabPPN="these.etablissement_soutenance.nnt"
                          :id="these.id" :status="these.status">
                        </ThesesResultsResultCard>
                      </v-lazy>
                      <hr class="result-dividers" v-if="index < item.theses[key].length - 1" />
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </div>
            </template>
          </v-expansion-panels>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { defineAsyncComponent, onUpdated, onMounted, ref, nextTick } from 'vue';
import { useDisplay } from "vuetify";
import { useColorMode } from '@vueuse/core';

const colorMode = useColorMode();
const { mobile } = useDisplay();
const MessageBox = defineAsyncComponent(() => import('@/components/common/MessageBox.vue'));
const { getPersonne } = usePersonnesAPI();
const currentRoute = useRoute();

const showSearchBar = ref(false);
const loading = ref(false);
const dataReady = ref(false);
const item = ref({});
const panel = ref([]);
const showMenu = ref(false);

const { t } = useI18n();

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

dataReady.value = false;
getPersonne(props.id).then(result => {
  if(!result) {
    showError({
      fatal: true,
      statusCode: 404,
      statusMessage: `Page introuvable`,
    });
  }

  item.value = result;
  dataReady.value = true;

  if (typeof item.value.theses['auteur'] !== 'undefined') {
    // Laisser le panneau 'auteurs' ouvert
    panel.value = [0];
  }

  // Titre détaillé
  useSeoMeta({
    title: () => `${item.value.prenom} ${item.value.nom} | Theses.fr`,
    ogTitle: () => `${item.value.prenom} ${item.value.nom} | Theses.fr`,
    description: () => t("meta.descPersonne") + item.value.prenom + " " + item.value.nom,
    ogDescription: () => t("meta.descPersonne") + item.value.prenom + " " + item.value.nom,
    ogImage: "https://theses.fr/logo-theses-beta.png",
    ogImageAlt: 'Logo Theses.fr',
    twitterCard: 'summary',
    ogType: 'website',
  });

  useHead({
    meta: [
      { name: 'DC.title', content: `${item.value.prenom} ${item.value.nom}` },
      { name: 'DC.description.abstract', content: `${item.value.prenom} ${item.value.nom} | Theses.fr` },
      { name: 'DC.source', content: `theses.fr` }
    ]
  });

}).catch(error => {
  if (error.response) {
    displayError(error.response.data.message, { isSticky: true });
  } else {
    displayError(error.message);
  }
});

const firstFocusElement = ref(null);

// Focus sur le contenu de la page au chargement
onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      if (firstFocusElement.value) {
        firstFocusElement.value.focus({ focusVisible: false });
      }
    }, 100);
  });
});

onUpdated(() => {
  if (currentRoute.hash) {
    document.getElementById(currentRoute.hash.substring(1))?.scrollIntoView({ behavior: "smooth" });
  }
});




const messageBox = ref(null);

/**
 * Retourne le nom de l'ancre HTML en fonction de la clé du rôle
 * @param key
 * @returns {string}
 */
function anchorValueFromKey(key) {
  switch (key) {
    case 'auteur':
      return "Auteurs";
    case 'directeur de thèse':
      return "Directeurs";

    case 'rapporteur':
      return "Rapporteurs";

    case 'président du jury':
      return "Presidents";

    case 'membre du jury':
      return "Membres";

    default:
      return "";
  }
}

/**
 * Retourne le nom de la clé i18n en fonction de la clé du rôle
 * @param key
 * @returns {string}
 */
function i18nValueFromKey(key) {
  switch (key) {
    case 'Auteur / Autrice':
      return "auteur";

    case 'Directeur / Directrice':
      return "directeur";

    case 'Rapporteur / Rapporteuse':
      return "rapporteur";

    case 'Président / Présidente du jury':
      return "president";

    case 'Examinateur / Examinatrice':
      return "membre";

    default:
      return "";
  }
}

/**
 * Cette fonction permet de convertir la liste de mot-clés au format du composant mot-clés des thèses
 * @param motsCles
 * @returns {{mapSujets: { codeLangue : { keyword, type, query}}}}
 */
function conversionMotClesFormatTheses(motsCles) {
  const keyword = {};
  for (const [key, value] of Object.entries(motsCles)) {
    keyword[key] = value.map(elem => (
      {
        keyword: elem,
        type: "sujet",
        query: "(sujetsLibelle:(" + elem + ") OU sujetsRameauLibelle:(" + elem + "))"
      }))
  }
  return { mapSujets: keyword };
}

function displayError(message, opt) {
  messageBox.value?.open(message, {
    ...opt,
    type: "error"
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

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.mobile-nav-bar {
  margin: 0 0 30px !important;
}

.grey-bar {
  background-color: rgb(var(--v-theme-gris-clair)) !important;
}

.dark-grey-bar {
  background-color: rgb(var(--v-theme-gris-fonce)) !important;
}

.blue-border {
  border-right: solid rgb(var(--v-theme-primary)) 3px;
}

.v-menu ::v-deep(.v-overlay__content) {
  border-radius: 0;
  margin: 0;
  background-color: rgb(var(--v-theme-background));
}

.statistique__title {
  align-items: flex-start;
  background-color: rgb(var(--v-theme-gris-clair));
  padding-left: 1rem;
  display: flex;
  justify-content: space-between;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
    border-right: 3px solid rgb(var(--v-theme-text-dark-blue));
  }
}

.statistique__content {
  align-items: flex-start;
  justify-content: flex-start;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
    border-right: 3px solid rgb(var(--v-theme-text-dark-blue));
  }

  ::v-deep(ul) {
    margin-left: 1rem;
  }
}

.search-filter {
  display: flex;
  flex-direction: row;
  width: 100%;

  h4 {
    background-color: rgb(var(--v-theme-gris-clair));
  }
}

.main-wrapper {
  padding: 30px 0;
  display: grid;
  grid-template-columns: 10fr 103fr 10fr;
  align-items: start;
  margin-top: 0 !important;
  width: 100%;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    display: flex;
    padding: unset;
    margin-top: 0 !important;
    padding-top: 0 !important;
  }

  .result-components {
    grid-column-start: 2;
    padding: 0 2em;

    display: flex;
    flex-direction: column;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
      width: 100%;
      padding: 0 0.5em;
    }

    .info {
      display: flex;
      align-content: center;

      .sep {
        height: 40px;
        margin-right: 1rem;

        hr {
          border-color: rgb(var(--v-theme-primary));
          opacity: 1;
          border-width: 0 1.5px 0 0;
        }
      }


      .nom-card {
        display: inline-flex;
        justify-content: space-between;

        a {
          display: flex;
          align-items: center;
          justify-items: center;
        }

        .nomprenom {
          padding-left: 10px;
          color: rgb(var(--v-theme-orange-abes));
          font-size: 28px;
        }
      }
    }

    .theses {
      padding: 1em 0;

      .role-expansion-panel-wrapper {
        display: flex;
        flex-direction: column;
      }

      :deep(.v-expansion-panel-title--active) {
        position: sticky;
        top: 0;
        z-index: 2;
        background-color: rgb(var(--v-theme-surface));
        border-bottom: 1px solid rgb(var(--v-theme-orange-abes));
      }

      .role-expansion-panel {
        border-top: 2px solid rgb(var(--v-theme-gris-fonce));

        h3 {
          padding: 0.5em 0 0.5em;
          font-size: 26px;
        }
      }

      .v-expansion-panel :deep(.v-expansion-panel__shadow) {
        box-shadow: none;
      }

      :deep(.v-expansion-panel-text__wrapper) {
        @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
          padding-left: 5px;
          padding-right: 5px;
        }
      }

      :deep(.v-card-title) {
        padding-left: 0;
        padding-right: 0;
      }

      .v-expansion-panel-title--active :deep(.v-expansion-panel-title__overlay) {
        opacity: 0;
      }

      .card-wrapper {
        margin-bottom: 1rem;
      }
    }

    .thesis-component {
      margin: 2em auto 20px;
    }

  }
}

.info-wrapper {
  padding-top: 1em;
}

.colonnes-resultats {
  padding: 0;
}

.skeleton-cards {
  height: 150px !important;
  background-color: rgb(var(--v-theme-gris-clair));
  margin: 1em 0;
}

.skeleton {
  margin-bottom: 3em;
}

.skeleton-wrapper {
  padding: 2em 0;
}

:deep(.v-skeleton-loader__button) {
  max-width: unset !important;
  width: 250px;
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