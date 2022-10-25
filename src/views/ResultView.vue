<template>
    <div class="pa-4">
        <v-row class="justify-center">
            <v-col cols="12" md="6" class="pt-0">
                <domain-selector compact></domain-selector>
            </v-col>
        </v-row>
        <v-row class="justify-center">
            <v-col cols="12" md="6" class="py-0">
                <search-bar></search-bar>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="2" class="py-0 darkGreyBar blueBorder">
                <v-row class="justify-center align-center pt-4" style="height: 100%">
                    <v-icon>mdi-filter</v-icon>
                    <h4>Affiner la recherche</h4>
                </v-row>

            </v-col>
            <v-col cols="12" md="10" class="py-0 pt-3 pb-3 greyBar">
                <result-pagination></result-pagination>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="2" class="justify-center blueBorder">
                <v-row class=" justify-center pt-5">
                    <facets-drawer></facets-drawer>
                </v-row>
            </v-col>
            <v-col cols="12" md="10">
                <h1 class="pb-6"> {{ JSON.parse(result).length }} {{$t('resultats')}}: {{ request }}</h1>
                <v-row>
                    <v-col v-for="item in JSON.parse(result)" :key="item._source" cols="12" xs="12" md="6">
                        <result-card :titre="item._source.titre" :date="item._source.dateSoutenance">
                        </result-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import ResultCard from '../components/results/ResultCard.vue'
import FacetsDrawer from '../components/results/FacetsDrawer.vue';
import SearchBar from '../components/search/SearchBar.vue';
import DomainSelector from '../components/search/DomainSelector.vue';
import ResultPagination from '../components/results/ResultPagination.vue';

import { ref } from 'vue'


defineProps({
    result: String,
    request: String
})
let drawer = ref(false);
</script>

<style scoped>
.greyBar {
    background-color: rgb(var(--v-theme-gris-clair)) !important;
}

.darkGreyBar {
    background-color: rgb(var(--v-theme-gris-fonce)) !important;
}

.blueBorder {
    border-right: solid rgb(var(--v-theme-primary)) 3px;
}
</style>