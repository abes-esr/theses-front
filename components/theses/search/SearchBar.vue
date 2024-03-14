<template>
  <div class="searchbar">
    <v-combobox v-if="!isAdvanced" class="searchbar__input" label="Rechercher des thèses" single-line :items="items"
      :menu="suggestionActive" :menu-props="menuProps" v-model="request" v-model:search="requestSearch" variant="outlined"
      cache-items hide-details hide-no-data hide-selected no-filter density="compact" return-object type="text"
      menu-icon="" @keydown.enter="search" enterkeyhint="send" ref="targetElement">
      <!--      Bouton rechercher-->
      <!--      Bouton effacer texte-->
      <template v-slot:append-inner>
        <v-btn class="appended-buttons" plain flat rounded="0" @click="clearSearch" :title='$t("clear")' :ripple="false">
          <template v-slot:append>
            <v-icon class="search-bar-icons" id="clean-button">
              mdi-close
            </v-icon>
          </template>
        </v-btn>
        <!--      Bouton rechercher-->
        <v-btn @click="search" :title='$t("searchButton")' :loading="loading"
          class="elevation-0 appended-buttons border-left-btn">
          <template v-slot:append>
            <v-icon class="search-bar-icons" id="magnifying-glass">
              mdi-magnify
            </v-icon>
          </template>
        </v-btn>
      </template>
      <template v-slot:item="{ item, props, index }">
        <v-list-item v-bind="props" :key="index" :title="false" :disabled="item.raw == null"
          @click="selectSuggestion(item.raw)">
          <span v-if="item.raw != null">{{
            item.raw
          }}</span>
          <span v-else></span>
        </v-list-item>
      </template>
    </v-combobox>

    <theses-search-advanced-form v-if="isAdvanced" @search="advancedSearch" @simple="isAdvanced = false"
      :white-container="whiteContainer"></theses-search-advanced-form>

    <div class="searchbar__action">
      <span v-if="isAdvanced"></span>
      <v-checkbox v-else :label="$t('disableSuggestion')" v-model="disableCompletion"
        :title='$t("disableSuggestion")'></v-checkbox>
      <v-btn v-if="!isAdvanced" color="primary" density="compact" variant="outlined" @click="isAdvanced = true">{{
        $t("avancee")
      }}
      </v-btn>
    </div>
  </div>
</template>
<script>
export default {
  name: "search-bar-theses",
};
</script>
<script setup>
import { ref, watch, onMounted } from 'vue';
import { useMagicKeys } from '@vueuse/core'

const currentRoute = useRoute();
const router = useRouter();
const { getSuggestion, setQuery, setDomaine, reinitializeFilters } = useStrategyAPI();

const request = ref();
const requestSearch = ref();
const emit = defineEmits(['onError', 'reinitializePageNumber']);
let watcherActive = true;
const disableCompletion = ref(false);

const isAdvanced = useState("isAdvanced");

defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  whiteContainer: {
    type: Boolean,
    default: false
  }
});

// Focus sur la barre de recherche lors du Ctrl + K
const { ctrl_k } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === 'k' && e.type === 'keydown')
      e.preventDefault()
  },
});

const targetElement = ref(null);

watch(ctrl_k, (v) => {
  if (v)
    targetElement.value.focus();
});

onMounted(
  () => {
    if (currentRoute.query && currentRoute.query.q && currentRoute.query.q !== "*") {
      request.value = decodeURI(currentRoute.query.q);
      setQuery(request.value);
      // Permet de ne pas ouvrir l'autocomplétion au chargement de la page
      // si on récupère la request depuis l'URL (ce qui normalement déclenche le watcher même sans input clavier)
      watcherActive = false;
    }

    if (currentRoute.query && currentRoute.query.domaine) {
      setDomaine(decodeURI(currentRoute.query.domaine));
    } else {
      setDomaine("theses");
    }
  }
);

const items = ref([]);
const suggestionActive = ref(false);

const menuProps = {
  'open-on-focus': false,
  'content-class': 'autocomplete',
  'height': '50vh',
  'max-height': '340px'
};

watch(requestSearch, (newRequestSearch) => {
  if (newRequestSearch.length > 2 && watcherActive && !disableCompletion.value) {
    setQuery(newRequestSearch);
    getSuggestion()
      .then((res) => {
        items.value = res.data.value;
        if (items.value.length > 0) {
          suggestionActive.value = true;
        }
      })
      .catch(error => {
        request.value = newRequestSearch;
        suggestionActive.value = false;
        emit('onError', "Autcomplétion : " + error.message);
      });
  } else {
    items.value = [];
    suggestionActive.value = false;
  }
  watcherActive = true;
});

watch(disableCompletion, (newDisableCompletion) => {
  if (newDisableCompletion) {
    suggestionActive.value = false;
    items.value = [];
  }
});

/**
 * Fonction lorsqu'on vide le champ de saisie
 */
function clearSearch() {
  request.value = null;
}

async function search() {
  if (request.value === null || request.value === undefined) request.value = "";

  setQuery(request.value);
  reinitializeFilters();
  emit('reinitializePageNumber');

  if (currentRoute.query && currentRoute.query.domaine) {
    setDomaine(decodeURI(currentRoute.query.domaine));
  } else {
    setDomaine("theses");
  }

  router.push({
    name: "resultats",
    query: { "q": encodeURI(request.value), "domaine": encodeURI(currentRoute.query.domaine) }
  });
}

function advancedSearch(payload) {
  request.value = payload;
  search();
}

/**
 * Fonction lorsqu'on sélectionne une suggestion
 * @param value
 */
async function selectSuggestion(value) {
  request.value = value;
  await search();
}

defineExpose({
  search,
});
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.searchbar {
  flex: 0 0 auto;

  :deep(.searchbar__input) {
    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
      padding-bottom: 10px;
    }
  }

  :deep(.v-combobox__selection) {
    overflow: hidden !important;
  }
}

.searchbar__action {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 1 0 100%;
  margin-bottom: 1rem;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
    justify-content: space-between;
  }

  .v-input {
    display: none;

    @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
      display: flex;
      flex: 0 0 auto;
    }
  }

  :deep(.v-label) {
    color: rgb(var(--v-theme-primary));
    opacity: 1;
    font-size: 0.95rem;
  }

  :deep(.v-btn) {
    margin-right: 15px;
  }
}

:deep(.v-field__prepend-inner) {
  padding: 0;
  align-self: center;
}

:deep(.v-field__append-inner) {
  padding: 0;
  align-self: center;
}

:deep(.appended-buttons) {
  padding: 0;
  min-width: unset;
  width: 36px;
  justify-content: center;
  background-color: transparent;

  .v-btn--density-default {
    height: unset;
  }

  .v-btn__append {
    margin-inline-start: unset;
  }

  :deep(.v-btn__append) {
    justify-content: center;
  }
}

:deep(.border-left-btn) {
  border-left: solid 1px rgb(var(--v-theme-gris-clair));
  border-radius: 0;
  width: 50px;
}

/* Permet de rendre l'auto-complétion + dense */
:deep(.v-overlay-container) .v-list-item--density-default.v-list-item--one-line {
  min-height: 20px !important;
}

.no-background-hover::before {
  background-color: transparent !important;
}

.search-bar-icons {
  color: rgb(var(--v-theme-primary)) !important;
  font-size: 25px;
  font-weight: 200;
}

#clean-button {
  left: -3px;
}

.v-input {
  :deep(.v-btn--variant-outlined) {
    color: rgb(var(--v-theme-gris-fonce)) !important;
  }
}

:deep(.v-field--prepended) {
  padding-inline-start: 0 !important;
}

:deep(.v-field--appended) {
  padding-inline-end: 0 !important;
}
</style>

<style lang="scss">
@use 'vuetify/settings';

.autocomplete {

  h3 {
    margin-left: 1rem;
  }

  .v-list {

    /* Permet de rendre l'autocompletion + dense */
    .v-list-item {
      min-height: 40px !important;

      @media only screen and (min-width: 900px) {
        min-height: 20px !important;
      }
    }
  }
}
</style>