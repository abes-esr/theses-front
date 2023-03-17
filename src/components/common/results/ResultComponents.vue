<template>
  <div v-if="!mobile" class="vertical-thread"></div>
  <div v-if="!mobile" class="search-filter">
    <h4 class="left-side">Affiner la recherche</h4>
  </div>
  <div class="main-wrapper">
    <span class="left-side nav-bar" v-if="!mobile">
      <FacetsList @update="update" @searchAndReinitialize="searchAndReinitialize" :facets="facets"
                  :reset-facets="resetFacets" class="left-side"></FacetsList>
      <v-btn class="mt-4" @click="update()">Appliquer les filtres</v-btn>
    </span>
    <div class="result-list">
      <result-list :data-ready="dataReady" :result="result" :loading="loading">
      </result-list>
    </div>
  </div>
</template>

<script setup>
import FacetsList from '@/components/common/results/FacetsList.vue';
import ResultList from "@/components/common/results/ResultList.vue";
import { useDisplay } from "vuetify";
import { APIService } from "@/services/StrategyAPI";

const { mobile } = useDisplay();
const { setQuery, queryAPI, getFacets, setDomaine } = APIService();
</script>

<style scoped>

</style>