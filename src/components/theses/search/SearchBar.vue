<template>
  <div class="searchbar">
    <v-combobox class="searchbar__input" v-model="request" v-model:search="requestSearch"
                :items="items" variant="outlined" cache-items hide-details hide-no-data hide-selected no-filter
                density="compact"
                @keydown.enter="search" :active="true" return-object type="text" :menu="suggestionActive" :menu-props="menuProps">
<!--      Bouton rechercher-->
      <template v-slot:prepend-inner>
        <v-btn @click="search" :title='$t("searchButton")' :loading="loading"
          class="elevation-0 appended-buttons">
          <template v-slot:append>
            <v-icon class="search-bar-icons" id="magnifying-glass">
              mdi-magnify
            </v-icon>
          </template>
        </v-btn>
      </template>
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
      </template>
    </v-combobox>
    <div class="searchbar__action">
      <v-checkbox label="Désactiver l'autocomplétion" v-model="disableCompletion"
        :title='$t("disableSuggestion")'></v-checkbox>
      <v-btn color="primary" density="compact" variant="outlined" :title='$t("avancee")' @click="search">{{ $t("avancee") }}
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
import { ref, watch, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';
import { APIService } from "@/services/StrategyAPI";

const currentRoute = useRoute();
const routeName = computed(() => currentRoute.name);
const { getSuggestion, setQuery, setDomaine, setSorting } = APIService();

defineProps({
  loading: {
    type: Boolean,
    default: false
  },
});
const request = ref("");
const requestSearch = ref("");
const emit = defineEmits(['searchAndReinitializeAllFacets', 'onError']);
let watcherActive = true;
const disableCompletion = ref(false);


onMounted(
  () => {
    if (currentRoute.query && currentRoute.query.q) {
      request.value = decodeURI(currentRoute.query.q);
      setQuery(request.value);
      // Permet de ne pas ouvrir l'autocomplétion au chargement de la page
      // si on récupère la request depuis l'URL (ce qui normalement déclenche le watcher même sans input clavier)
      watcherActive = false;
    }

    if (currentRoute.query && currentRoute.query.domaine)
      setDomaine(decodeURI(currentRoute.query.domaine));
  }
);

const items = ref([]);
const suggestionActive = ref(false);

const menuProps = {
  'scrollStrategy': 'close'
};

watch(requestSearch, (newRequestSearch) => {
  if (newRequestSearch.length > 2 && watcherActive && !disableCompletion.value) {
    setQuery(newRequestSearch);
    getSuggestion()
      .then((res) => {
        items.value = res.data;
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
  request.value = "";
}

async function search() {
  if (routeName.value === "resultats") {
    setQuery(request.value);
    emit('searchAndReinitializeAllFacets', request.value);
  } else {
    setDomaine(currentRoute.query.domaine);
    if (request.value === "") setSorting('dateDesc');
    router.push({
      name: 'resultats',
      query: { 'q': encodeURI(request.value), 'domaine': encodeURI(currentRoute.query.domaine), 'tri': request.value === "" ? "dateDesc" : "" }
    });
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
      @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
        padding-bottom: 10px;
      }
    }

    :deep(.v-field__append-inner) {
      margin-right: 10px;
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
    margin-left: 10px;
    justify-content: center;

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