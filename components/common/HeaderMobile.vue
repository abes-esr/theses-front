<template>
  <nav class="mobile-nav-bar" v-if="isReady" role="list">
    <div class="left-side-buttons" role="presentation">
      <!--    Bouton menu burger -->
      <button class="buttons"  @click="activateMenu" role="listitem" :aria-label="$t('menu')" :title="$t('menu')">
        <span class="sr-only">{{ $t('menu') }}</span>
        <v-icon :title="$t('menu')" size="35px" :class="{ 'logo-active': showMenu }">mdi-menu
        </v-icon>
      </button>
      <v-btn variant="plain" @click="dialog = true" class="buttons language-accessibility-button"
        :title="$t('access.btn')" role="listitem">
        <img :alt="$t('header.accessibility')" id="logo-handicap-visuel"
          :src="'/icone-handicap-visuel-' + colorMode + '.svg'" />
      </v-btn>
    </div>
    <div class="right-side-buttons" role="presentation">
      <!--    Bouton filtres-->
      <button v-if="type === 'resultats'" @click="activateFilterMenu" color="primary"
      class="filter-mobile-nav-bar buttons" role="listitem" :title="$t('filtres')">
        <span class="sr-only">{{ $t('parcourirFiltres') }}</span>
        <v-icon :title="$t('filtres')" v-bind="props" size="35px">mdi-filter-menu-outline
        </v-icon>
      </button>
      <!-- Bouton accès theses -->
      <button role="listitem" :title="$t('theseView.access')"
        v-if="type === 'these' && theseSoutenue && (categoriesValide.length > 0 || boutonsAutres.length > 0) || (theseSoutenue && status === 'enCours')"
        @click="activateThesisAccess" class="filter-mobile-nav-bar buttons">
        <span class="sr-only">{{ $t('theseView.access') }}</span>
        <v-icon :title="$t('theseView.access')" v-bind="props" color="primary" size="35px">mdi-book-arrow-down-outline
        </v-icon>
      </button>
      <!--    Bouton menu recherche/selecteur these/personnes-->
      <button v-if="type !== 'home'" @click="activateSearchBar" class="buttons" role="listitem" :title="$t('rechercher')">
        <span class="sr-only">{{ $t('rechercher') }}</span>
        <v-icon :title="$t('rechercher')" size="35px"
          :class="{ 'logo-active': showSearchBar }">mdi-magnify
        </v-icon>
      </button>
    </div>
  </nav>
  <!--    Logo -->
  <div class="logo-menu-wrapper">
    <NuxtLink :to="{ path: '/', query: { domaine: 'theses' } }" title="Accueil du site"
      class="logo logo_home logo_resultview">
      <img :alt="$t('homepage')" id="logoIMG" src="/icone-theses-beta.svg" />
    </NuxtLink>
    <!-- Menu burger mobile -->
    <v-fade-transition>
      <div v-show="showMenu" ref="expandedMenu" tabindex="0" class="expanded-search-bar-container white-containers" role="list">
        <div class="languages-btn-container">
<!--          <div class="languages-btn">-->
<!--            <button flat @click="setLanguage('fr')" title="Langue française"-->
<!--              :class="locale === 'fr' ? 'selected' : ''">FR</button>-->
<!--            <p>|</p>-->
<!--            <button flat @click="setLanguage('en')" title="English Language"-->
<!--              :class="locale === 'en' ? 'selected' : ''">EN</button>-->
<!--            <p>|</p>-->
<!--            <button flat @click="setLanguage('es')" title="Idioma Espanol"-->
<!--              :class="locale === 'es' ? 'selected' : ''">ES</button>-->
<!--          </div>-->
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
            <div class="menu-text-element" role="listitem">
              <a href="https://stp.abes.fr/node/3?origine=thesesFr" target="_blank" :alt='$t("header.assistance")' :title='$t("header.assistance")'>
                  <img :alt="$t('header.assistance')" id="logo-assistance" class="logos-droite"
                    :src="'/icone-assistance-' + colorMode + '.svg'" />
                <span></span>
                <span>{{ $t('assistance') }}</span>
              </a>
            </div>
            <div class="menu-text-element" role="listitem">
              <a href="http://documentation.abes.fr/aidethesesfr/index.html" :alt='$t("header.doc")'
                target="_blank" :title='$t("header.doc")'>
                  <img :alt="$t('header.doc')" id="logo-documentation" class="logos-droite"
                    :src="'/icone-documentation-' + colorMode + '.svg'" />
                <span></span>
                <span>{{ $t('documentation') }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </v-fade-transition>
    <!--    Menu recherche/selecteur these/personnes-->
    <v-fade-transition>
      <div v-if="type !== 'home'" v-show="showSearchBar" class="expanded-search-bar-container white-containers">
        <div class="expanded-search-bar" ref="expandedSearchBar">
          <LazyCommonDomainSelector></LazyCommonDomainSelector>
          <LazyGenericSearchBar :loading="loading" @onError="displayError" />
        </div>
      </div>
    </v-fade-transition>
  </div>
  <v-dialog v-model="dialog" width="auto">
    <v-card>
      <v-card-title>{{ $t("access.params") }}</v-card-title>
      <v-card-text>
        <ul class="switch-list">
          <li><v-switch :label='$t("access.police")' v-model="opendys" inset></v-switch></li>
          <li><v-switch :label='$t("access.justification")' v-model="justification" inset></v-switch></li>
          <li><v-switch :label='$t("access.interligne")' v-model="interlignes" inset></v-switch></li>
          <li><v-switch :label='$t("access.contrast")' v-model="changeContrast" inset></v-switch></li>
        </ul>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="dialog = false">{{ $t("access.fermer") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { onMounted, onBeforeMount, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useTheme } from "vuetify";
import { useColorMode } from '@vueuse/core'

const theme = useTheme();
const { locale } = useI18n();
const isReady = ref(false);
const changeContrast = ref(false);

// Elements du DOM
const expandedMenu = ref(null);
const expandedSearchBar = ref(null);

const themesNames = ref({
  "light": "abesLightTheme",
  "dark": "abesDarkTheme"
});

const colorMode = useColorMode({
  onChanged(color) {
    theme.global.name.value = themesNames.value[color];
  }
});

onBeforeMount(() => {
  // Etat par défaut du switch
  changeContrast.value = useColorMode().value === 'dark';
  isReady.value = true;
});

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

const emit = defineEmits(['search', 'displayError', 'activateMenu', 'activateSearchBar', 'activateFilterMenu', 'activateThesisAccess']);
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

//Paramètres d'accessibilité
const dialog = ref(false);
const opendys = useState('opendys');
const interlignes = useState('interlignes');
const justification = useState('justification');

/**
 * Watchers
 */
watch(changeContrast, newValue => {
  colorMode.value = newValue ? 'dark' : 'light';
});

onMounted(() => {
  // Observer les éléments v-fade-transition avec Intersection Observer
  // Menu
  const observer1 = new IntersectionObserver((entries) => {
    if(entries[0].isIntersecting) {
      expandedMenu.value.focus();
    }
  });

  // Searchbar
  const observer2 = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      if (document.getElementsByClassName("advanced-input-fields").length > 0) {
        const firstInputElementInAdvancedForm = document.getElementsByClassName("advanced-input-fields")[0].getElementsByTagName("input")[0];
        if (firstInputElementInAdvancedForm !== null) {
          firstInputElementInAdvancedForm.focus();
        }
      } else {
        const searchbar = document.getElementById('searchbar');
        if(searchbar !== null) {
          searchbar.focus();
        }
      }
    }
  });

  // Commencer à observer les éléments
  if (expandedMenu.value !== null) {
    observer1.observe(expandedMenu.value);
  }
  if (expandedSearchBar.value !== null) {
    observer2.observe(expandedSearchBar.value);
  }
});
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
      margin-top: -3px;

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

.logos-droite {
  height: 40px;
}

.buttons {
  display: flex;
  align-items: center;
}

.buttons:focus-visible {
  i, img {
    border: 2px solid rgb(var(--v-theme-secondary-darken-2));
  }
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

:deep(.v-btn--variant-plain) {
  opacity: 1 !important;
}

:deep(.v-switch__track) {
  background-color: rgb(var(--v-theme-gris-switch));
}

.switch-list {
  list-style-type: none;
}
</style>