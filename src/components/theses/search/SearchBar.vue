<template>
  <v-col>
    <v-combobox clearable :label='$t("rechercher")' v-model="request" v-model:search="requestSearch" type="text"
      variant="outlined" :items="items" :menu="suggestionActive" cache-items hide-no-data hide-selected no-filter
      return-object append-inner-icon @keydown.enter="search">
      <template v-slot:append>
        <v-btn color="primary"
          style="height: 100%; border-bottom-left-radius: 0; border-top-left-radius: 0; margin-left: -10px !important;"
          text @click="search" :loading="loading" class="pa-0 ma-0">
          <v-icon large>mdi-magnify</v-icon>
        </v-btn>
      </template>
    </v-combobox>
  </v-col>
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
  if (newRequestSearch.length > 2 && watcherActive) {
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

<style scoped>
:deep(.v-field__field) {
  background: rgb(var(--v-theme-surface));
}

:deep(.v-input--horizontal .v-input__append) {
  padding: 0 !important;
  margin: 0 !important;
  height: 100% !important;
}
</style>

<style>
/* Permet de rendre l'autocompletion + dense */
.v-overlay-container .v-list-item--density-default.v-list-item--one-line {
  min-height: 20px !important;
}
</style>