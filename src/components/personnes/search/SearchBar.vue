<template>
  <v-col>
    <v-combobox clearable @click:clear="clearSearch" :label='$t("rechercher")' v-model="request"
                v-model:search="requestSearch" @update:modelValue="selectSuggestion"
                variant="outlined" :items="items" item-title="suggestion"
                item-value="suggestion"
                :loading="isLoading" :menu="suggestionActive" cache-items hide-no-data
                hide-selected no-filter @keydown.enter="search">
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
  name: "search-bar-personnes"
};
</script>
<script setup>
import {ref, onMounted, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {computed} from 'vue'
import {personnesAPIService} from "@/services/PersonnesAPI";

const router = useRouter();
const currentRoute = useRoute();
const routeName = computed(() => currentRoute.name);

defineProps({
  loading: {
    type: Boolean,
    default: false
  },
})
const request = ref('');
const requestSearch = ref("");
const emit = defineEmits(['search', 'onError']);

onMounted(
    () => {
      if (currentRoute.query && currentRoute.query.q) {
        request.value = decodeURI(currentRoute.query.q);
      }
    }
)

/**
 * Fonction pour rechercher
 * @returns {Promise<void>}
 */
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
    })
  } else {
    router.push({
      name: 'resultats',
      query: currentURLParams
    })
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

const {suggestionPersonne} = personnesAPIService();
const items = ref([]);
const isLoading = ref(false);
const suggestionActive = ref(false);

watch(requestSearch, (candidate) => {
  if (candidate != null && candidate.length > 2) {
    getSuggestion(candidate);
  } else {
    items.value = [];
    suggestionActive.value = false;
  }
})

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
    request.value = value.suggestion
  }
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