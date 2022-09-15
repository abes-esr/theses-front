<template>
  <v-container class="justify-center">
    <v-row class="justify-center">
      <h1 class="pb-16 text-center">Le moteur de recherche des thèses françaises</h1>
    </v-row>
    <domain-selector></domain-selector>
    <v-row class="justify-center ma-0 pa-0">
      <v-col cols="12" xs="12" xl="6">
        <search-bar @search="search" :loading="loading" />
      </v-col>
    </v-row>
    <v-row class="justify-center ma-0 pa-0">
      <v-col cols="12" md="2" xs="12">
        <stats-card titre="546 000" description="thèses référencées" date="au 03/06/2022"></stats-card>
      </v-col>
      <v-col cols="12" md="2" xs="12">
        <stats-card titre="79 000" description="thèses en préparation" date="au 03/06/2022"></stats-card>
      </v-col>
      <v-col cols="12" md="2" xs="12">
        <stats-card titre="805 000" description="personnes référencées" date="au 03/06/2022"></stats-card>
      </v-col>
    </v-row>
    <v-row>
      <p>Le PoC fédé est accessible ici : <a href="/poc-fede/">poc-fede</a></p>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import searchBar from '../components/SearchBar.vue'
import statsCard from '../components/StatsCard.vue'
import DomainSelector from '../components/DomainSelector.vue'
import thesesAPI from '../services/ThesesAPI'

const router = useRouter()

const loading = ref(false)

function search(payload) {
  loading.value = true;

  thesesAPI.search(payload).then(response => {
    router.push({
      name: 'resultats',
      params: {
        result: JSON.stringify(response.data.hits.hits),
        request: payload
      }
    })
  }).catch(error => {
    console.log(error)
  }).finally(() => {
    loading.value = false;
  })
}
</script>

<style scoped>

</style>