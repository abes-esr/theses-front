<template>
  <v-container class="justify-center">
    <v-row class="justify-center">
      <h1 class="pb-16 text-center">{{ $t("slogan") }}</h1>
    </v-row>
    <domain-selector></domain-selector>
    <v-row class="justify-center ma-0 pa-0">
      <v-col cols="12" xs="12" xl="6">
        <search-bar />
      </v-col>
    </v-row>
    <v-row class="justify-center ma-0 pa-0">
      <v-col cols="12" md="2" xs="12">
        <stats-card titre="546 000" :description="$t('referencés')" date="au 03/06/2022"></stats-card>
      </v-col>
      <v-col cols="12" md="2" xs="12">
        <stats-card titre="79 000" :description="$t('preparation')" date="au 03/06/2022"></stats-card>
      </v-col>
      <v-col cols="12" md="2" xs="12">
        <stats-card titre="805 000" :description="$t('personnesRef')" date="au 03/06/2022"></stats-card>
      </v-col>
    </v-row>
    <v-row>
      <p>Le PoC fédé est accessible ici : <a href="/poc-fede/">poc-fede</a></p>
    </v-row>
  </v-container>
</template>

<script setup>
import searchBar from '../components/search/SearchBar.vue'
import statsCard from '../components/home/StatsCard.vue'
import DomainSelector from '../components/search/DomainSelector.vue'

</script>

<style scoped>

</style>