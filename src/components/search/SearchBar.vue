<template>
  <v-col>
    <v-text-field clearable :label='$t("rechercher")' v-model="request" type="text" variant="outlined"
                  @keydown.enter="search">
      <template v-slot:append>
        <v-btn color="primary"
               style="height: 100%; border-bottom-left-radius: 0; border-top-left-radius: 0; margin-left: -10px !important;"
               text @click="search" :loading="loading" class="pa-0 ma-0">
          <v-icon large>mdi-magnify</v-icon>
        </v-btn>
      </template>
    </v-text-field>
  </v-col>
</template>

<script setup>
import {ref} from 'vue'

import router from '../../router';
import {useRoute} from 'vue-router'
import {computed} from 'vue'

import thesesAPI, {thesesAPIService} from '../../services/ThesesAPI';

const route = useRoute();
const routeName = computed(() => route.name)

const loading = ref(false);
const request = ref('');
const emit = defineEmits(['onError'])
const {rechercherPersonne} = thesesAPIService();


async function search() {
  loading.value = true;
  const {selectedDomain} = thesesAPIService();

  if (selectedDomain == "thèses") {

    thesesAPI.search(request.value).then(response => {

      // Si on est déjà sur /resultats
      //On ne fait pas un push mais un replace
      //Pour ne pas ajouter X fois "/resultats" à l'historique de navigation
      if (routeName.value === "resultats") {
        router.replace({
          name: 'resultats',
          params: {
            result: JSON.stringify(response.data.hits.hits),
            request: request.value
          }
        })
      } else {
        router.push({
          name: 'resultats',
          params: {
            result: JSON.stringify(response.data.hits.hits),
            request: request.value
          }
        })
      }

    }).catch(error => {
      console.log(error)
    }).finally(() => {
      loading.value = false;
    })
  } else if (selectedDomain == "personnes") {

    try {
      await rechercherPersonne(request.value);
      const {listePersonnes} = thesesAPIService();

    } catch (error) {
      emit('onError', error.message);
    } finally {
      loading.value = false;
    }

  }
}


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