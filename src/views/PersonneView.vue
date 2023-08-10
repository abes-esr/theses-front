<template>
  <Message-box ref="messageBox"></Message-box>
  <nav v-if="mobile" class="mobile-nav-bar">
    <button @click="openMenu = true" class="filter-mobile-nav-bar">
      <v-icon v-bind="props" size="40px">mdi-menu
      </v-icon>
      <v-tooltip activator="parent">{{ $t('menu') }}</v-tooltip>
    </button>
    <div>
      <v-icon @click="showSearchBar = !showSearchBar" size="40px"
              :class="{ 'magnify-logo-active': showSearchBar }">mdi-magnify
      </v-icon>
      <v-tooltip activator="parent" location="start">{{ $t('rechercher') }}</v-tooltip>
    </div>
  </nav>
<!--  Mobile-->
  <div v-if="mobile" class="logo-menu-wrapper">
    <RouterLink :to="{ name: 'home' }" title="Accueil du site" class="logo logo_resultview">
      <img alt="logo Theses" id="logoIMG" src="@/assets/icone-theses.svg"/>
    </RouterLink>
    <!--    Menu header -->
    <v-dialog v-model="openMenu" eager location-strategy="static" persistent no-click-animation fullscreen
              :close-on-content-click="false" transition="dialog-top-transition" content-class="full-screen">
      <div class="statistique__title">
        <div></div>
        <v-btn size=40px icon="mdi-close-box" color="red" variant="text" @click="openMenu = !openMenu"></v-btn>
      </div>
    </v-dialog>
    <v-expand-transition>
      <div v-show="showSearchBar" class="expanded-search-bar-container white-containers">
        <div class="expanded-search-bar">
          <domain-selector @changeDomain="changeDomain" compact></domain-selector>
          <search-bar @search="search" @searchAndReinitializeAllFacets="searchAndReinitializeAllFacets"
                      :loading="loading"
                      @onError="displayError"/>
        </div>
      </div>
    </v-expand-transition>
  </div>

<!--  Desktop-->
  <div v-else class="sub-header">
    <div class="search-bar-container white-containers">
      <div class="sub_header__logo">
        <RouterLink :to="{ name: 'home' }" title="Accueil du site">
          <img class="logo" alt="logo Theses" id="logoIMG" src="@/assets/icone-theses.svg"/>
        </RouterLink>
        <h1>{{ $t("slogan") }}</h1>
      </div>
      <div class="sub_header__action">
        <domain-selector @changeDomain="changeDomain" compact></domain-selector>
        <search-bar @searchAndReinitializeAllFacets="searchAndReinitializeAllFacets" :loading="loading"
                    @onError="displayError"/>
      </div>
    </div>
  </div>

  <div class="main-wrapper">
    <div class="result-components white-containers">
<!--   Skeletton-->
      <div v-if="!dataReady"  class="skeleton-wrapper">
        <v-skeleton-loader type="list-item-avatar-two-line" class="skeleton"></v-skeleton-loader>
        <v-skeleton-loader type="divider" class="skeleton"></v-skeleton-loader>
        <v-skeleton-loader type="table-row"></v-skeleton-loader>
        <v-skeleton-loader type="button" class="skeleton"></v-skeleton-loader>
        <v-skeleton-loader type="divider" class="skeleton"></v-skeleton-loader>
        <v-skeleton-loader v-for="i in 4" :key="i" type="paragraph" class="skeleton-cards"></v-skeleton-loader>
      </div>
<!--      End skeletton-->
      <div class="info-wrapper" v-else>
        <div class="info">
          <v-icon size="45px">$personne</v-icon>
          <div class="nom-card">
            <div class="nomprenom">
              <span class="prenom">{{ item.prenom + "\xa0"}}</span>
              <span class="nom">{{ item.nom }}</span>
              <a v-if="item.has_idref" :href="`https://www.idref.fr/${item.id}`" target="_blank">
                <img alt="logo" id="logoIdref" src="@/assets/idref-icone.png"/>
              </a>
            </div>
          </div>
        </div>

        <thesis-keywords
          class="thesis-component"
          :data-ready="true"
          :keywordsAreSet="true"
          :these="conversionMotClesFormatTheses(item.mots_cles)"
        />

<!--        Tiroirs thèses par rôles-->
        <div class="theses">
          <v-expansion-panels multiple v-model="panel" class="role-expansion-panel-wrapper">
            <template v-for="key in ['auteur','directeur de thèse','rapporteur','président du jury','membre du jury']"
                      :key="key">
              <div v-if="item.theses[key] && item.theses[key].length > 0" class="role-expansion-panel">
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    <template v-slot:actions="{ expanded }">
                      <v-icon :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'" size="x-large">
                      </v-icon>
                    </template>
                    <h2 :id="anchorValueFromKey(key)">
                      {{ $t("personnes.personneView.roles." + i18nValueFromKey(key), [item.theses[key].length]) }}
                    </h2>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                      <div v-for="(these, index) in item.theses[key]" :key="`${these.id}`" class="card-wrapper">
                        <v-lazy :options="{ threshold: 1.0 }">
                          <result-card :titre="these.titre"
                                       :date="these.status === 'enCours' ? new Date(these.date_inscription).toLocaleDateString('en-GB') : new Date(these.date_soutenance).toLocaleDateString('en-GB')"
                                       :auteur="these.auteurs" :directeurs="these.directeurs" :discipline="these.discipline"
                                       :etab="these.etablissement_soutenance.nom" :id="these.id" :status="these.status">
                          </result-card>
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
    <scroll-to-top-button class="scroll-to-top-wrapper" :nb-result=1></scroll-to-top-button>
  </div>
</template>

<script setup>
import {useMeta} from 'vue-meta';
import {useI18n} from "vue-i18n";

import {defineAsyncComponent, onBeforeMount, onUpdated, ref, watchEffect} from 'vue';
import SearchBar from '../components/generic/GenericSearchBar.vue';
import DomainSelector from '@/components/common/DomainSelector.vue';

import {personnesAPIService} from "@/services/PersonnesAPI";
import {useDisplay} from "vuetify";
import StatistiqueCardPersonne from "@/components/personnes/StatistiqueCard.vue";
import ResultCard from "@/components/theses/results/ResultCard.vue";
import ScrollToTopButton from "@/components/common/ScrollToTopButton.vue";
import ThesisKeywords from "@/components/common/Keywords.vue";
import {useRoute} from "vue-router";

const {mobile} = useDisplay();
const MessageBox = defineAsyncComponent(() => import('@/components/common/MessageBox.vue'));
const {getPersonne} = personnesAPIService();
const currentRoute = useRoute();

const showSearchBar = ref(false);
const loading = ref(false);
const dataReady = ref(false);
const openMenu = ref(false);
const item = ref({});
const panel = ref([]);

const {t} = useI18n();
const {meta} = useMeta({});

watchEffect(() => {
  const titlePersonne = item.value.prenom ? item.value.prenom + " " + item.value.nom : "";
  meta.title = titlePersonne;
  meta.description = t("meta.descPersonne") + titlePersonne;
});

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});


onBeforeMount(() => {
  panel.value = [0];

  dataReady.value = false;
  getPersonne(props.id).then(result => {
    item.value = result;
    dataReady.value = true;
  }).catch(error => {
    if (error.response) {
      displayError(error.response.data.message, {isSticky: true});
    } else {
      displayError(error.message);
    }
  });
});

onUpdated(() => {
  if (currentRoute.hash) {
    document.getElementById(currentRoute.hash.substring(1))?.scrollIntoView({behavior: "smooth"});
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
    case 'auteur':
      return "auteur";

    case 'directeur de thèse':
      return "directeur";

    case 'rapporteur':
      return "rapporteur";

    case 'président du jury':
      return "president";

    case 'membre du jury':
      return "membre";

    default:
      return "";
  }
}

/**
 * Cette fonction permet de convertir les mot-clés au format du composant mot-clés des thèses
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
          query: ""
        }))
  }
  return { mapSujets : keyword };
}

function displayError(message, opt) {
  messageBox.value?.open(message, {
    ...opt,
    type: "error"
  });
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

.v-menu ::v-deep(.v-overlay__content) {
  border-radius: 0;
  margin: 0;
  background-color: rgb(var(--v-theme-background));
}


.mobile-nav-bar {
  margin: 10px 0 30px;
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
  margin-top: 0;
  width: 100%;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    display: flex;
  }

  .result-components {
    grid-column-start: 2;
    padding: 0 2em;

    .info {
      display: flex;
      align-content: center;

      @media #{ map-get(settings.$display-breakpoints, 'sm-and-up')} {
        justify-content: flex-start;
      }

      .v-icon {
        margin-right: 1rem;
      }

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
        .nomprenom {
          color: rgb(var(--v-theme-orange-abes));

          a {
            display: flex;
            align-items: center;

            img {
              margin-left: 0.5em !important;
            }
          }
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

        h2 {
          padding: 0.5em 0 0.5em;
          font-size: 26px;
        }
      }

      .v-expansion-panel :deep(.v-expansion-panel__shadow) {
        box-shadow: none;
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

.domain-selector {
  :deep(.v-btn__content) {
    flex-direction: row !important;
  }

  :deep(.v-icon) {
    margin-right: 1rem !important;
  }
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
</style>