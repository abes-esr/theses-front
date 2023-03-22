<template>
  <div class="searchbar">
    <v-combobox class="searchbar__input" :label='$t("rechercher")' v-model="request" v-model:search="requestSearch"
      :items="items" variant="outlined" :menu="suggestionActive" cache-items hide-no-data hide-selected no-filter
      append-inner-icon @keydown.enter="search" @update:modelValue="selectSuggestion" item-title="suggestion"
      item-value="suggestion" :loading="isLoading" role="input" title="Barre de recherche">
      <template v-slot:append-inner>
        <v-btn flat rounded="0" icon="mdi-backspace-outline" @click="clearSearch" :title='$t("clear")'>
        </v-btn>
      </template>
      <template v-slot:append>
        <v-btn color="primary" icon="mdi-magnify" text @click="search" :title='$t("searchButton")' :loading="loading"
          class="pa-0 ma-0">
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
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import { personnesAPIService } from "@/services/PersonnesAPI";

const router = useRouter();
const currentRoute = useRoute();
const routeName = computed(() => currentRoute.name);

defineProps({
  loading: {
    type: Boolean,
    default: false
  },
});
const request = ref('');
const requestSearch = ref("");
const emit = defineEmits(['search', 'onError']);

let watcherActive = true;
const disableCompletion = ref(false);


onMounted(
  () => {
    if (currentRoute.query && currentRoute.query.q) {
      request.value = decodeURI(currentRoute.query.q);
      // Permet de ne pas ouvrir l'autocomplétion au chargement de la page
      // si on récupère la request depuis l'URL (ce qui normalement déclenche le watcher même sans input clavier)
      watcherActive = false;
    }
  }
);

/**
 * Fonction pour rechercher
 * @returns {Promise<void>}
 */
async function search() {
  let currentURLParams = Object.assign({}, currentRoute.query);

  if (currentURLParams) {
    currentURLParams.q = encodeURI(request.value);
  } else {
    currentURLParams = { "q": encodeURI(request.value) };
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
  emit('search', request.value);
}

/**
 * Fonction lorsqu'on vide le champs de saisie
 */
function clearSearch() {
  request.value = "";
  search();
}

/* ---------------- */
/* Auto-complétion  */
/* ---------------- */

const { suggestionPersonne } = personnesAPIService();
const items = ref([]);
const isLoading = ref(false);
const suggestionActive = ref(false);

watch(requestSearch, (candidate) => {
  if (candidate != null && candidate.length > 2 && watcherActive && !disableCompletion.value) {
    getSuggestion(candidate);
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
 * Fonction pour rechercher des suggestions
 * @param candidate Chaîne de caractère à compléter
 * @returns {Promise<void>}
 */
async function getSuggestion(candidate) {
  isLoading.value = true;
  try {
    items.value = await suggestionPersonne(candidate);
  } catch (error) {
    request.value = candidate;
    emit('onError', "Autcomplétion : " + error.message);
  } finally {
    isLoading.value = false;
    suggestionActive.value = true;
  }
}

/**
 * Fonction lorsqu'on selectionne une suggestion
 * @param value
 */
function selectSuggestion(value) {
  if (value != null && typeof (value) == "object") {
    request.value = value.suggestion;
  }
}

defineExpose({
  search,
});

</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.searchbar {

  flex: 1 0 auto;
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
</style>