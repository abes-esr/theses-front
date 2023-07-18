<template>
  <div class="searchbar">
    <v-combobox class="searchbar__input" :label='$t("rechercher")' v-model="request" v-model:search="requestSearch"
                :items="suggestions" variant="outlined" append-inner-icon
                :hide-no-data="!isSuggestionActive || suggestions.length == 0" no-filter hide-details
                hide-selected
                :no-data-text="isSuggestionLoading ? $t('personnes.searchBar.loading') : $t('personnes.searchBar.noData')"
                @keydown.enter="search" :loading="isSuggestionLoading"
                :menu="isSuggestionActive && suggestions.length != 0" :menu-props="menuProps">
      <template v-slot:append-inner>
        <v-btn flat rounded="0" icon="mdi-backspace-outline" @click="clearSearch" :title='$t("clear")' :ripple="false">
        </v-btn>
      </template>
      <template v-slot:append>
        <v-btn color="primary" icon="mdi-magnify" text @click="search" :title='$t("searchButton")' :loading="loading"
               class="pa-0 ma-0">
        </v-btn>
      </template>
      <template v-slot:prepend-item v-if="suggestions.length > 0">
        <h3>{{ $t('personnes.searchBar.title-personnes') }}</h3>
        <h3>{{ $t('personnes.searchBar.title-thematiques') }}</h3>
      </template>
      <template v-slot:item="{ item, props, index }">
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
      <v-checkbox label="Désactiver l'autocomplétion" v-model="isSuggestionDisabledCheckbox"
                  :title='$t("disableSuggestion")'></v-checkbox>
      <v-btn color="primary" append-icon="mdi-magnify" @click="search" :title='$t("avancee")'>{{ $t("avancee") }}
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
import {ref, onMounted, watch, computed} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {APIService} from "@/services/StrategyAPI";

const router = useRouter();
const currentRoute = useRoute();
const routeName = computed(() => currentRoute.name);
const query = computed(() => decodeURI(currentRoute.query.q));
const {getSuggestion, setQuery, setDomaine} = APIService();

defineProps({
  loading: {
    type: Boolean,
    default: false
  },
});
const request = ref('');
const requestSearch = ref("");
const emit = defineEmits(['searchAndReinitializeAllFacets', 'onError']);

const menuProps = {
  'scroll-strategy': 'close',
  'open-on-focus': false,
  'content-class': 'autocompl',
};

onMounted(
    () => {
      if (currentRoute.query && currentRoute.query.q) {
        // Il y a une précédente recherche dans l'URL
        request.value = decodeURI(currentRoute.query.q);
        requestSearch.value = decodeURI(currentRoute.query.q);
        search()
      } else {
        isSuggestionActive.value = true;
      }
      setDomaine(currentRoute.query.domaine);
    }
);

/**
 * Fonction pour vider le champs de recherche
 * @returns {Promise<void>}
 */
function clearSearch() {
  request.value = "";
}

/**
 * Fonction pour rechercher
 */
async function search() {
  isSuggestionActive.value = false;
  suggestions.value = [];

  await setQuery(request.value);
  emit('searchAndReinitializeAllFacets');

  if (routeName.value != "resultats") {
    router.push({
      name: 'resultats',
      query: {'q': encodeURI(request.value), 'domaine': encodeURI(currentRoute.query.domaine)}
    });
  }

  if (!isSuggestionDisabledCheckbox.value) {
    isSuggestionActive.value = true;
  }
}

/* ---------------- */
/* Auto-complétion  */
/* ---------------- */

const isSuggestionDisabledCheckbox = ref(false);
const isSuggestionActive = ref(false);
const isSuggestionLoading = ref(false);
const suggestions = ref([]);

/**
 * Watcher pour compléter la saisie dans la barre de recherche
 */
watch(requestSearch, async (candidate) => {

  if (candidate != null && candidate.value != query.value && candidate != "[object Object]" && candidate.length > 2 && isSuggestionActive.value) {
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

.searchbar {

  flex: 0 0 auto;
  margin-top: 1rem;

  :deep(.searchbar__input) {

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
      padding-bottom: 10px;
    }

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

    :deep(.v-label) {
      color: rgb(var(--v-theme-primary));
      opacity: 1;
      font-size: 0.95rem;
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

.no-background-hover::before {
  background-color: transparent !important;
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
  }
}
</style>