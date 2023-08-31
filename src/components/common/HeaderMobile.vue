<template>
  <nav class="mobile-nav-bar">
    <div class="left-side-buttons">
      <!--    Bouton menu burger -->
      <div>
        <v-icon @click="activateMenu" size="35px"
                :class="{ 'logo-active': showMenu }">mdi-menu
        </v-icon>
        <v-tooltip activator="parent">{{ $t('menu') }}</v-tooltip>
      </div>
      <div class="language-accessibility-button">
        <img :alt="$t('header.accessibility')" id="logo-handicap-visuel" src="@/assets/icone-handicap-visuel.svg" />
        <v-tooltip activator="parent">{{ $t('accessibility') }}</v-tooltip>
      </div>
    </div>
    <div class="right-side-buttons">
      <!--    Bouton filtres-->
      <button @click="activateFilterMenu" color="primary" class="filter-mobile-nav-bar">
        <v-icon v-bind="props" size="35px">mdi-filter-menu-outline
        </v-icon>
        <v-tooltip activator="parent" location="start">{{ $t('filtres') }}</v-tooltip>
      </button>
      <!--    Bouton menu recherche/selecteur these/personnes-->
      <div>
        <v-icon @click="activateSearchBar" size="35px"
                :class="{ 'logo-active': showSearchBar }">mdi-magnify
        </v-icon>
        <v-tooltip activator="parent" location="start">{{ $t('rechercher') }}</v-tooltip>
      </div>
    </div>
  </nav>
  <!--    Logo -->
  <div class="logo-menu-wrapper">
    <RouterLink :to="{ name: 'home', query: { domaine: 'theses' } }" title="Accueil du site" class="logo logo_home logo_resultview">
      <img alt="logo Theses" id="logoIMG" src="@/assets/icone-theses.svg" />
    </RouterLink>
<!-- Menu burger mobile -->
    <v-expand-transition>
      <div v-show="showMenu" class="expanded-search-bar-container white-containers">
        <div class="expanded-burger-menu">
          <div class="nav-bar-list-burger">
            <div class="menu-text-element">
              <a>
                <v-btn icon="$reseau" title="Réseau" size="large" variant="text"></v-btn>
                <span>{{ $t('reseau') }}</span>
              </a>
            </div>
            <div class="menu-text-element">
              <a>
                <v-btn icon="$rss" title="Flux RSS" size="large" variant="text"></v-btn>
                <span>{{ $t('rss') }}</span>
              </a>
            </div>
            <div class="menu-text-element">
              <a href="https://stp.abes.fr/node/3?origine=thesesFr" target="_blank" :alt='$t("header.assistance")'><v-btn
                icon="$assistance" :title='$t("header.assistance")' size="large" variant="text"></v-btn>
                <span>{{ $t('assistance') }}</span>
              </a>
            </div>
            <div class="menu-text-element">
              <a href="http://documentation.abes.fr/aidethesesfr/index.html" :alt='$t("header.doc")' target="_blank"><v-btn
                icon="$documentation" :title='$t("header.doc")' size="large" variant="text"></v-btn>
                <span>{{ $t('documentation') }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </v-expand-transition>
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
</template>

<script setup>
import DomainSelector from "@/components/common/DomainSelector.vue";
import SearchBar from "@/components/generic/GenericSearchBar.vue";

const props = defineProps({
  theseStatut: {
    type: Boolean
  },
  showButtons: {
    type: Boolean,
    default: true
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

});

const emit = defineEmits(['search', 'changeDomain', 'displayError', 'searchAndReinitializeAllFacets', 'activateMenu', 'activateSearchBar', 'activateFilterMenu',]);

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
function changeDomain() {
  emit('changeDomain');
}
function search() {
  emit('search');
}
function searchAndReinitializeAllFacets() {
  emit('searchAndReinitializeAllFacets');
}
function displayError() {
  emit('displayError');
}

</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.mobile-nav-bar {
  background-color: rgb(var(--v-theme-surface));
  height: 45px;
  display: flex;
  justify-content: space-between;
  align-content: center;

  .left-side-buttons, .right-side-buttons {
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
  :deep(.v-icon) {
    height: 40px !important;
    width: 40px !important;
  }
}

#logoIMG {
  margin-top: 30px;
}
</style>