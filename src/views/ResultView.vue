<template>
    <div class="pa-8">
        <v-row>
            <v-col cols="2" class="pt-0">
            </v-col>
            <v-col cols="10" md="6" class="pt-0">
                <domain-selector compact></domain-selector>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="2" class="py-0">
            </v-col>
            <v-col cols="10" md="6" class="py-0">
                <search-bar></search-bar>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="1" md="2" class="py-0">
            </v-col>
            <v-col cols="11" md="10" class="py-0">
                <result-pagination></result-pagination>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="2">
                <facets-drawer></facets-drawer>
            </v-col>
            <v-col cols="12" md="10">
                <h1> {{ JSON.parse(result).length }} résultats de thèses pour : {{ request }}</h1>
                <v-row>
                    <v-col v-for="item in JSON.parse(result)" :key="item._source" cols="12" xs="12" md="4">
                        <result-card :titre="item._source.titre" :description="item._source.abstractFR"
                            :date="item._source.dateSoutenance">
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

defineProps({
    result: String,
    request: String
})
</script>

<style scoped>

</style>