<template>
    <div class="pa-4">
        <Message-box ref="messageBox"></Message-box>
        <v-row class="justify-center">
            <v-col cols="12" md="6" class="pt-0">
                <domain-selector compact></domain-selector>
            </v-col>
        </v-row>
        <v-row class="justify-center">
            <v-col cols="12" md="6" class="py-0">
                <search-bar @search="search" :loading="loading"></search-bar>
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
                <result-pagination :nb-results=nbResult @changePage="updatePage" @changeNombre="updateNombre">
                </result-pagination>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="2" class="justify-center blueBorder">
                <v-row class=" justify-center pt-5">
                    <facets-drawer></facets-drawer>
                </v-row>
            </v-col>
            <v-col cols="12" md="10">
                <div v-if="dataReady">
                    <h1 class="pb-6"> {{ nbResult }} {{ $t('resultats') }}: {{ request }}</h1>
                    <v-row>
                        <v-col v-for="item in JSON.parse(result)" :key="item._source" cols="12" xs="12" md="6">
                            <result-card :titre="item._source.titrePrincipal" :date="item._source.dateSoutenance"
                                :auteur="item._source.auteurs[0].prenom + ' ' + item._source.auteurs[0].nom"
                                :directeurs="item._source.directeurs" :discipline="item._source.discipline"
                                :etab="item._source.etabSoutenance.nom" :nnt="item._source.nnt">
                            </result-card>
                        </v-col>
                    </v-row>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router'

import ResultCard from '../components/results/ResultCard.vue';
import FacetsDrawer from '../components/results/FacetsDrawer.vue';
import SearchBar from '../components/search/SearchBar.vue';
import DomainSelector from '../components/search/DomainSelector.vue';
import ResultPagination from '../components/results/ResultPagination.vue';
import { thesesAPIService } from "@/services/ThesesAPI";

const MessageBox = defineAsyncComponent(() => import('@/components/common/MessageBox.vue'));


const { rechercherPersonne, rechercherThese } = thesesAPIService();


const request = ref("");

onMounted(() => {
    dataReady.value = false;
    request.value = useRoute().query.q;
    search(request.value);
});


let loading = ref(false);
let result = ref('{}');
let nbResult = ref(0);
let dataReady = ref(false);

async function search(query) {
    request.value = query;
    loading.value = true;
    const { selectedDomain } = thesesAPIService();

    if (selectedDomain.value == "theses") {
        rechercherThese(query).then(response => {
            result.value = JSON.stringify(response.data.hits.hits);
            nbResult.value = response.data.hits.total.value;
        }).catch(error => {
            displayError(error.message);
        }).finally(() => {
            loading.value = false;
            dataReady.value = true;
        })
    } else if (selectedDomain.value == "personnes") {

        try {
            await rechercherPersonne(query);
            //const { listePersonnes } = thesesAPIService();

        } catch (error) {
            displayError(error.message);
        } finally {
            loading.value = false;
            dataReady.value = true;
        }

    }
}

const { modifierPage, modifierNombre } = thesesAPIService();

function updatePage(payload) {
    modifierPage(payload);
    search(request.value);
}

function updateNombre(payload) {
    modifierNombre(payload);
    search(request.value);
}

const messageBox = ref(null);

function displayError(message) {
    messageBox.value?.open(message, {
        type: "error"
    })
}

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