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
                <v-row>
                    <v-col cols="12" md="4" class="py-0">
                        <div class="d-flex justify-start"><span class="pt-3">Afficher</span>
                            <v-select :items="['10','25','50']" density="compact" style="max-width: 80px;" class="mx-2">
                            </v-select> <span class="pt-3">résultats par page</span>
                        </div>
                    </v-col>
                    <v-col cols="12" md="4" class="py-0">
                        <div class="d-flex justify-center">
                            <v-pagination :length="6"></v-pagination>
                        </div>
                    </v-col>
                    <v-col cols="12" md="4" class="py-0">
                        <div class="d-flex justify-end"><span class="pt-3">Trier par</span>
                            <v-select :items="['Alphabétique', 'Inversé']" density="compact" style="max-width: 200px;"
                                class="ml-2">
                            </v-select>
                        </div>
                    </v-col>
                </v-row>
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
import ResultCard from '../components/ResultCard.vue'
import FacetsDrawer from '../components/FacetsDrawer.vue';
import SearchBar from '../components/SearchBar.vue';
import DomainSelector from '../components/DomainSelector.vue';

defineProps({
    result: String,
    request: String
})
</script>

<style scoped>

</style>