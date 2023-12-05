<template>
  <nav class="mobile-nav-bar">
    <div class="left-side-buttons">
      <!--    Bouton menu burger -->
      <div class="buttons">
        <v-icon @click="activateMenu" size="35px" :class="{ 'logo-active': showMenu }">mdi-menu
        </v-icon>
        <v-tooltip activator="parent">{{ $t('menu') }}</v-tooltip>
      </div>
      <!---<div class="buttons language-accessibility-button">
        <img :alt="$t('header.accessibility')" id="logo-handicap-visuel" src="@/assets/icone-handicap-visuel.svg" />
        <v-tooltip activator="parent">{{ $t('header.accessibility') }}</v-tooltip>
      </div>-->
    </div>
    <div class="right-side-buttons">
      <!--    Bouton filtres-->
      <button v-if="type === 'resultats'" @click="activateFilterMenu" color="primary"
        class="filter-mobile-nav-bar buttons">
        <v-icon v-bind="props" size="35px">mdi-filter-menu-outline
        </v-icon>
        <v-tooltip activator="parent" location="start">{{ $t('filtres') }}</v-tooltip>
      </button>
      <!-- Bouton accès theses -->
      <button
        v-if="type === 'these' && theseSoutenue && (categoriesValide.length > 0 || boutonsAutres.length > 0) || (theseSoutenue && status === 'enCours')"
        @click="activateThesisAccess" class="filter-mobile-nav-bar buttons">
        <v-icon v-bind="props" color="primary" size="35px">mdi-book-arrow-down-outline
        </v-icon>
        <v-tooltip activator="parent">{{ $t('theseView.access') }}</v-tooltip>
      </button>
      <!--    Bouton menu recherche/selecteur these/personnes-->
      <div v-if="type !== 'home'" class="buttons">
        <v-icon @click="activateSearchBar" size="35px" :class="{ 'logo-active': showSearchBar }">mdi-magnify
        </v-icon>
        <v-tooltip activator="parent" location="start">{{ $t('rechercher') }}</v-tooltip>
      </div>
    </div>
  </nav>
  <!--    Logo -->
  <div class="logo-menu-wrapper">
    <NuxtLink :to="{ path: '/', query: { domaine: 'theses' } }" title="Accueil du site"
      class="logo logo_home logo_resultview">
      <img alt="logo Theses" id="logoIMG" src="/icone-theses-beta.svg" />
    </NuxtLink>
    <!-- Menu burger mobile -->
    <v-expand-transition>
      <div v-show="showMenu" class="expanded-search-bar-container white-containers">

        <div class="languages-btn-container">
          <!--
          <div class="languages-btn">
            <button flat @click="setLanguage('fr')" title="Langue française"
              :class="locale === 'fr' ? 'selected' : ''">FR</button>
            <p>|</p>
            <button flat @click="setLanguage('en')" title="English Language"
              :class="locale === 'en' ? 'selected' : ''">EN</button>
            <p>|</p>
            <button flat @click="setLanguage('es')" title="English Language"
              :class="locale === 'es' ? 'selected' : ''">ES</button>
          </div>-->
        </div>
        <div class="expanded-burger-menu">
          <div class="nav-bar-list-burger">
            <!--
            <div class="menu-text-element">
              <a>
                <v-btn title="Réseau" size="large" variant="text" icon>
                  <IconsIconReseau />
                </v-btn>
                <span>{{ $t('reseau') }}</span>
              </a>
            </div>
            <div class="menu-text-element">
              <a>
                <v-btn title="Flux RSS" size="large" variant="text" icon>
                  <IconsIconRss />
                </v-btn>
                <span>{{ $t('rss') }}</span>
              </a>
            </div>
            -->
            <div class="menu-text-element">
              <a href="https://stp.abes.fr/node/3?origine=thesesFr" target="_blank" :alt='$t("header.assistance")'><v-btn
                  :title='$t("header.assistance")' size="large" variant="text" icon>
                  <IconsIconAssistance />
                </v-btn>
                <span>{{ $t('assistance') }}</span>
              </a>
            </div>
            <div class="menu-text-element">
              <a href="http://documentation.abes.fr/aidethesesfr/index.html" :alt='$t("header.doc")'
                target="_blank"><v-btn :title='$t("header.doc")' size="large" variant="text" icon>
                  <IconsIconDocumentation />
                </v-btn>
                <span>{{ $t('documentation') }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </v-expand-transition>
    <!--    Menu recherche/selecteur these/personnes-->
    <v-expand-transition>
      <div v-if="type !== 'home'" v-show="showSearchBar" class="expanded-search-bar-container white-containers">
        <div class="expanded-search-bar">
          <LazyCommonDomainSelector @changeDomain="changeDomain"></LazyCommonDomainSelector>
          <LazyGenericSearchBar @search="search" @searchAndReinitializeAllFacets="searchAndReinitializeAllFacets"
            :loading="loading" @onError="displayError" />
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const props = defineProps({
  type: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: ''
  },
  showSearchBar: {
    type: Boolean,
    default: false
  },
  showMenu: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  theseSoutenue: {
    type: Boolean,
    default: false
  },
  categoriesValide: {
    type: Object,
    default: []
  },
  boutonsAutres: {
    type: Object,
    default: []
  }
});

const emit = defineEmits(['search', 'changeDomain', 'displayError', 'searchAndReinitializeAllFacets', 'activateMenu', 'activateSearchBar', 'activateFilterMenu', 'activateThesisAccess']);
const { reinitializeFilters } = useStrategyAPI();

/**
 * Fonctions
 */
function activateMenu() {
  emit('activateMenu');
}
function activateSearchBar() {
  emit('activateSearchBar');
}
function activateFilterMenu() {
  emit('activateFilterMenu');
}
function activateThesisAccess() {
  emit('activateThesisAccess');
}
function changeDomain() {
  emit('changeDomain');
}
function search() {
  emit('search');
}
function searchAndReinitializeAllFacets() {
  reinitializeFilters();
}
function displayError() {
  emit('displayError');
}

/**
 * Fonction selecteur langage
 */
onMounted(() => {
  if (localStorage.getItem("language")) {
    locale.value = localStorage.getItem("language");
  }
});

function setLanguage(lang) {
  localStorage.setItem("language", lang);
  locale.value = lang;
}
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.mobile-nav-bar {
  background-color: rgb(var(--v-theme-surface));
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-content: center;
  padding: 10px;

  .left-side-buttons,
  .right-side-buttons {
    display: flex;
    flex-direction: row;
  }

  .left-side-buttons {
    .language-accessibility-button {
      padding-left: 0.7em;

      img {
        height: 28px;
      }
    }
  }

  .right-side-buttons {
    button {
      padding-right: 0.7em;
    }
  }
}

.nav-bar-list-burger {
  :deep(svg) {
    height: 34px !important;
    width: 34px !important;
  }
}

#logoIMG {
  margin-top: 30px;
}

.buttons {
  display: flex;
  align-items: center;
}

.languages-btn-container {
  padding-top: 10px;
  width: 100%;
  display: grid;
  grid-template-columns: 3fr 2fr;
  height: 35px;
}

.languages-btn {
  grid-column-end: 3;
  max-width: 150px;
  display: inline-grid;
  grid-template-columns: 1fr 0.1fr 1fr 0.1fr 1fr;

  font-family: Roboto, sans-serif;
  font-weight: 500;

  button p {
    grid-row-start: 1;
  }

  p {
    width: 2px;
  }
}

.selected {
  color: rgb(var(--v-theme-orange-abes));
  font-weight: 700;
}
</style>