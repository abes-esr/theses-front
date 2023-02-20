<template>
  <div class="searchbar">
    <v-combobox class="searchbar__input" clearable :label='$t("rechercher")' v-model="request"
      v-model:search="requestSearch" type="text" variant="outlined" :items="items" :menu="suggestionActive" cache-items
      hide-no-data hide-selected no-filter :active="true" return-object append-inner-icon @keydown.enter="search">
      <template v-slot:append-inner>
        <v-btn flat rounded="0" icon="mdi-backspace-outline" @click="clearSearch">
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
  name: "search-bar-theses",
};
</script>
<script setup>
import { ref, watch, onMounted } from 'vue'

import { useRoute } from 'vue-router'
import { computed } from 'vue'

import router from '@/router';
import { thesesAPIService } from "@/services/ThesesAPI";

const currentRoute = useRoute();
const routeName = computed(() => currentRoute.name);
const { complete } = thesesAPIService();

defineProps({
  loading: {
    type: Boolean,
    default: false
  },
})
const request = ref("");
const requestSearch = ref("");
const emit = defineEmits(['search', 'onError']);
let watcherActive = true;
const disableCompletion = ref(false);


onMounted(
  () => {
    if (useRoute().query.q) {
      request.value = useRoute().query.q;
      // Permet de ne pas ouvrir l'autocomplétion au chargement de la page
      // si on récupère la request depuis l'URL (ce qui normalement déclenche le watcher même sans input clavier)
      watcherActive = false;
    }
  }
)

const items = ref([]);
const suggestionActive = ref(false);


watch(requestSearch, (newRequestSearch) => {
  if (newRequestSearch.length > 2 && watcherActive && !disableCompletion.value) {
    complete(newRequestSearch)
      .then((res) => {
        items.value = res.data
        if (items.value.length > 0) {
          suggestionActive.value = true;
        }
      })
      .catch(error => {
        request.value = newRequestSearch;
        suggestionActive.value = false;
        emit('onError', "Autcomplétion : " + error.message);
      })
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

async function search() {
  let currentURLParams = Object.assign({}, currentRoute.query);

  if (currentURLParams) {
    currentURLParams.q = request.value
  } else {
    currentURLParams = { "q": request.value }
  }

  if (routeName.value === "resultats") {
    router.replace({
      query: currentURLParams
    })
  } else {
    router.push({
      name: 'resultats',
      query: currentURLParams
    })
  }
  emit('search', request.value);
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
</style>