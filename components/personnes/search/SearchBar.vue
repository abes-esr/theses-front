<template>
  <div class="searchbar">
    <v-combobox role="search" class="searchbar__input" :label="$t('rechercherPersonnes')"
      :items="suggestions" :menu-props="menuProps" hide-no-data
      :no-data-text="isSuggestionLoading ? $t('personnes.searchBar.loading') : $t('personnes.searchBar.noData')"
      v-model="request" v-model:search="requestSearch" variant="outlined" cache-items hide-details hide-selected
      no-filter density="compact" return-object type="text" menu-icon="" @keydown.enter="search"
      :loading="isSuggestionLoading" enterkeyhint="send" ref="comboboxElement" id="searchbar" autocomplete="off">
      <!--      Bouton rechercher-->
      <!--      Bouton effacer texte-->
      <template v-slot:append-inner>
        <v-btn class="appended-buttons" plain flat rounded="0" @click="clearSearch" :title='$t("clear")'
          :ripple="false">
          <template v-slot:append>
            <v-icon class="search-bar-icons" id="clean-button">
              mdi-close
            </v-icon>
          </template>
        </v-btn>
        <v-btn @click="search" :title='$t("searchButton")' :loading="loading"
          class="elevation-0 appended-buttons border-left-btn">
          <template v-slot:append>
            <v-icon class="search-bar-icons" id="magnifying-glass">
              mdi-magnify
            </v-icon>
          </template>
        </v-btn>
      </template>
      <!-- Liste auto-complétion -->
      <template v-slot:prepend-item v-if="suggestions.length > 1">
        <h3>{{ $t('personnes.searchBar.title-personnes') }}</h3>
        <h3>{{ $t('personnes.searchBar.title-thematiques') }}</h3>
      </template>
      <template v-slot:item="{ item, props, index }" v-if="suggestions.length > 1">
        <v-list-item v-if="index === 0" id="spacer-v-list-item"></v-list-item>
        <v-list-item v-bind="props" :key="index" :title="false" :disabled="item.raw.personne == null"
          @click="selectSuggestion(item.raw.personne)">
          <span v-if="item.raw.personne != null">{{
        item.raw.personne.suggestion
      }}</span>
          <span v-else></span>
        </v-list-item>
        <v-list-item v-bind="props" :key="index" :title="false" :disabled="item.raw.thematique == null"
          @click="selectSuggestion(item.raw.thematique)">
          <span v-if="item.raw.thematique != null">{{
        item.raw.thematique.suggestion
      }}</span>
          <span v-else></span>
        </v-list-item>
      </template>
    </v-combobox>

    <div class="searchbar__action">
      <v-checkbox :label="$t('disableSuggestion')" v-model="isSuggestionDisabledCheckbox"
        :title='$t("disableSuggestion")'></v-checkbox>
    </div>
  </div>
</template>
<script>
export default {
  name: "search-bar-personnes"
};
</script>
<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useMagicKeys } from '@vueuse/core'

const router = useRouter();
const currentRoute = useRoute();
const query = computed(() => decodeURI(currentRoute.query.q));
const { getSuggestion, setQuery, setDomaine, reinitializeFilters } = useStrategyAPI();

defineProps({
  loading: {
    type: Boolean,
    default: false
  },
});

const request = ref("");
const requestSearch = ref("");
const emit = defineEmits(['onError', 'reinitializePageNumber']);

const shouldShowMenu = computed(() => {
  return isSuggestionActive.value && suggestions.value.length > 1 ? 0 : -1;
});

const menuProps = computed(() => {
  return {
    'open-on-focus': false,
    'content-class': 'autocompl',
    'max-height': '360px',
    'scroll-strategy': 'close',
    'z-index': shouldShowMenu
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

const comboboxElement = ref(null);

watch(ctrl_k, (v) => {
  if (v)
    comboboxElement.value.focus();
});

onMounted(
  () => {
    if (currentRoute.query && currentRoute.query.q && currentRoute.query.q !== "*") {
      // Il y a une précédente recherche dans l'URL
      request.value = decodeURI(currentRoute.query.q);
      requestSearch.value = decodeURI(currentRoute.query.q);

      //Si on avait une recherche avancée en cours, on réinitialise
      const isAdvanced = useState("isAdvanced");
      if (isAdvanced.value) {
        request.value = "";
        requestSearch.value = "";
        setQuery(request.value);
      }
    } else {
      isSuggestionActive.value = true;
    }

    if (currentRoute.query && currentRoute.query.domaine) {
      setDomaine(decodeURI(currentRoute.query.domaine));
    } else {
      setDomaine("theses");
    }
});

/**
 * Fonction pour vider le champs de recherche
 * @returns {Promise<void>}
 */
function clearSearch() {
  request.value = null;
}

/**
 * Fonction pour rechercher
 */
async function search() {
  if (request.value === null || request.value === undefined) request.value = "";

  isSuggestionActive.value = false;
  suggestions.value = [];

  await setQuery(request.value);
  reinitializeFilters();
  emit('reinitializePageNumber');

  router.push({
    name: "resultats",
    query: { "q": encodeURI(request.value), "domaine": encodeURI(currentRoute.query.domaine) }
  });

  isSuggestionActive.value = !isSuggestionDisabledCheckbox.value;
}

/* ---------------- */
/* Auto-complétion  */
/* ---------------- */

const isSuggestionDisabledCheckbox = ref(false);
const isSuggestionActive = ref(true);
const isSuggestionLoading = ref(false);
const suggestions = ref([]);

/**
 * Watcher pour compléter la saisie dans la barre de recherche
 */
watch(requestSearch, async (candidate) => {
  if (candidate != null && candidate.value != query.value && candidate != "[object Object]" && candidate.length > 2 &&  !isSuggestionDisabledCheckbox.value) {
    await getSuggestionPersonne(candidate);
  } else {
    suggestions.value = [];
  }
});

/**
 * Watcher pour surveiller l'état de la checkbox d'autocomplétion
 */
watch(isSuggestionDisabledCheckbox, (newDisableCompletion) => {
  if (newDisableCompletion) {
    isSuggestionActive.value = false;
    suggestions.value = [];
  } else {
    isSuggestionActive.value = true;
  }
});

/**
 * Fonction pour rechercher des suggestions
 * @param candidate Chaîne de caractère à compléter
 * @returns {Promise<void>}
 */
async function getSuggestionPersonne(candidate) {
  isSuggestionLoading.value = true;
  try {
    suggestions.value = [];
    const candidates = await getSuggestion(candidate);
    for (let index = 0; index < Math.max(candidates.personnes.length, candidates.thematiques.length); index++) {
      suggestions.value[index] = {
        personne: candidates.personnes[index] ? candidates.personnes[index] : null,
        thematique: candidates.thematiques[index] ? candidates.thematiques[index] : null,
      };
    }
  } catch (error) {
    request.value = candidate;
    emit('onError', "Autocomplétion : " + error.message);
  } finally {
    isSuggestionLoading.value = false;
  }
}

/**
 * Fonction lorsqu'on sélectionne une suggestion
 * @param value
 */
async function selectSuggestion(value) {
  request.value = value.suggestion;
  await search();
}

defineExpose({
  search,
});

</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.v-virtual-scroll__spacer,
#spacer-v-list-item {
  height: 0 !important;
  min-height: 0 !important;
  padding: 0 !important;
}

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

  :deep(.v-label) {
    opacity: 1 !important;
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

:deep(.v-field__outline) {
  --v-field-border-opacity: 1 !important;
}
</style>

<style lang="scss">
@use 'vuetify/settings';

.autocompl {

  h3 {
    margin-left: 1rem;
  }

  .v-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: min-content;
    width: 100%;

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