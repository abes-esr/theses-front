<template>
  <v-container class="justify-center">
    <Message-box ref="messageBox"></Message-box>
    <v-row class="justify-center">
      <h1 class="pb-16 text-center">{{ $t("slogan") }}</h1>
    </v-row>
    <domain-selector></domain-selector>
    <v-row class="justify-center ma-0 pa-0">
      <v-col cols="12" md="9" xl="6">
        <search-bar @search="loading = true" :loading="loading" @onError="displayError" />
      </v-col>
    </v-row>
    <v-row class="justify-center ma-0 pa-0">
      <v-col cols="12" md="3" xl="2">
        <Stats-card titre="546 000" :description="$t('referencés')" date="au 03/06/2022"></Stats-card>
      </v-col>
      <v-col cols="12" md="3" xl="2">
        <Stats-card titre="79 000" :description="$t('preparation')" date="au 03/06/2022"></Stats-card>
      </v-col>
      <v-col cols="12" md="3" xl="2">
        <Stats-card titre="805 000" :description="$t('personnesRef')" date="au 03/06/2022"></Stats-card>
      </v-col>
    </v-row>
    <v-row>
      <p>Le PoC fédé est accessible ici : <a href="/poc-fede/">poc-fede</a></p>
    </v-row>
  </v-container>
</template>

<script setup>
import SearchBar from '../components/generic/GenericSearchBar.vue'
import StatsCard from '../components/home/StatsCard.vue'
import DomainSelector from '../components/common/DomainSelector.vue'
import {defineAsyncComponent, ref} from "vue";
const MessageBox = defineAsyncComponent(() => import('@/components/common/MessageBox.vue'));

let loading = ref(false);

const messageBox = ref(null);

function displayError(message) {
  messageBox.value?.open(message, {
    type: "error"
  })
}

</script>

<style scoped>

</style>