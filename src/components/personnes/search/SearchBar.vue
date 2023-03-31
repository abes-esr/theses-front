<template>
  <div class="searchbar">
    <v-combobox class="searchbar__input"
                :label='$t("rechercher")'
                v-model="request"
                v-model:search="requestSearch"
                :items="items"
                variant="outlined"
                cache-items
                hide-no-data
                hide-selected
                no-filter
                append-inner-icon
                @keydown.enter="search"
                @update:modelValue="selectSuggestion"
                item-title="suggestion"
                item-value="suggestion"
                :loading="isLoading"
                :menu="suggestionActive"
                :menu-props="menuProps"
    >
      <template v-slot:append-inner>
        <v-btn flat rounded="0" icon="mdi-backspace-outline" @click="clearSearch" :ripple="false">
        </v-btn>
      </template>
      <template v-slot:append>
        <v-btn color="primary" icon="mdi-magnify" text @click="search" :loading="loading" class="pa-0 ma-0">
        </v-btn>
      </template>
    </v-combobox>
    <div class="searchbar__action">
      <v-checkbox label="Désactiver l'autocomplétion" v-model="disableCompletion"></v-checkbox>
      <v-btn color="primary" prepend-icon="mdi-magnify" @click="search">RECHERCHE AVANCEE
      </v-btn>
    </div>
  </div>
</template>
<script>
export default {
  name: "search-bar-personnes"
};
</script>
<script setup>
import { ref, onMounted, watch,computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { APIService } from "@/services/StrategyAPI";

const router = useRouter();
const currentRoute = useRoute();
const routeName = computed(() => currentRoute.name);
const { getSuggestion, setQuery } = APIService();

defineProps({
  loading: {
    type: Boolean,
    default: false
  },
})
const request = ref('');
const requestSearch = ref("");
const emit = defineEmits(['searchAndReinitializeAllFacets', 'onError']);

let watcherActive = true;
const disableCompletion = ref(false);

const menuProps = {
  'scrollStrategy': 'close'
};

onMounted(
  () => {
    if (currentRoute.query && currentRoute.query.q) {
      request.value = decodeURI(currentRoute.query.q);
      setQuery(request.value);
      // Permet de ne pas ouvrir l'autocomplétion au chargement de la page
      // si on récupère la request depuis l'URL (ce qui normalement déclenche le watcher même sans input clavier)
      watcherActive = false;
    }
  }
)

/**
 * Fonction pour rechercher
 * @returns {Promise<void>}
 */
function clearSearch() {
  request.value = "";
}

async function search() {
  let currentURLParams = Object.assign({}, currentRoute.query);

  if (currentURLParams) {
    currentURLParams.q = encodeURI(request.value)
  } else {
    currentURLParams = { "q": encodeURI(request.value) }
  }

  if (routeName.value === "resultats") {
    router.replace({
      query: currentURLParams
    });
  } else {
    router.push({
      name: 'resultats',
      query: currentURLParams
    });
  }

  suggestionActive.value = false;
  setQuery(request.value);
  emit('searchAndReinitializeAllFacets', request.value);
}

/* ---------------- */
/* Auto-complétion  */
/* ---------------- */

const items = ref([]);
const isLoading = ref(false);
const suggestionActive = ref(false);

watch(requestSearch, (candidate) => {
  if (candidate != null && candidate.length > 2 && watcherActive && !disableCompletion.value) {
    getSuggestionPersonne(candidate);
  } else {
    items.value = [];
    suggestionActive.value = false;
  }
  watcherActive = true;
})

watch(disableCompletion, (newDisableCompletion) => {
  if (newDisableCompletion) {
    suggestionActive.value = false;
    items.value = [];
  }
})

/**
 * Fonction pour rechercher des suggestions
 * @param candidate Chaîne de caractère à compléter
 * @returns {Promise<void>}
 */
async function getSuggestionPersonne(candidate) {
  isLoading.value = true;
  try {
    setQuery(candidate);
    items.value = await getSuggestion();
  } catch (error) {
    request.value = candidate;
    emit('onError', "Autocomplétion : " + error.message);
  } finally {
    isLoading.value = false;
    suggestionActive.value = true;
  }
}

/**
 * Fonction lorsqu'on sélectionne une suggestion
 * @param value
 */
function selectSuggestion(value) {
  if (value != null && typeof (value) == "object") {
    request.value = value.suggestion
  }
}

defineExpose({
  search,
});

</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.searchbar {

  flex: 0 0 auto;
  margin-top: 1rem;

  :deep(.searchbar__input) {

    .v-field__field {
      background-color: rgb(var(--v-theme-surface));
    }

    .v-field--variant-outlined {
      background-color: rgb(var(--v-theme-surface));

      .v-field__outline__start {
        border-top-left-radius: 2rem;
        border-bottom-left-radius: 2rem;
      }

      .v-field__outline__end {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-right: 0;
      }
    }

    .v-input__append {
      padding: 0 !important;
      margin: 0 !important;
      height: 100% !important;

      .v-btn {
        height: 100%;
        width: 70px;
        border-radius: 0 0.7rem 0.7rem 0;

        .v-icon {
          font-size: 50px;
        }
      }

    }

    .v-field__append-inner {
      padding-top: 0;
      justify-content: center;
      align-items: center;
      background-color: rgb(var(--v-theme-surface));

      .v-btn {
        background-color: transparent;
        height: 100%;

        .v-icon {
          font-size: 40px;
          color: rgb(var(--v-theme-text-dark-blue));
        }
      }
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
  }
}
/* Permet de rendre l'autocompletion + dense */
:deep(.v-overlay-container) .v-list-item--density-default.v-list-item--one-line {
  min-height: 20px !important;
}

.no-background-hover::before {
  background-color: transparent !important;
}
</style>