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
                <search-bar @search="search" :loading="loading" @onError="displayError" />
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
                    <GenericFacetsDrawer></GenericFacetsDrawer>
                </v-row>
            </v-col>
            <v-col cols="12" md="10">
                <div v-if="dataReady">
                    <h1 class="pb-6">{{ nbResult }} {{ currentRoute.query.domaine }} {{ $t(currentRoute.query.domaine +
                            '.resultView.resultats')
                    }} :
                        {{ request }}</h1>
                    <GenericResultList :result="result"></GenericResultList>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import { defineAsyncComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router'
import GenericFacetsDrawer from '@/components/generic/GenericFacetsDrawer.vue';
import SearchBar from '../components/generic/GenericSearchBar.vue'
import DomainSelector from '@/components/common/DomainSelector.vue';
import ResultPagination from '@/components/common/ResultPagination.vue';
import { thesesAPIService } from "@/services/ThesesAPI";
import { personnesAPIService } from "@/services/PersonnesAPI";
import GenericResultList from "@/components/generic/GenericResultList.vue";

const MessageBox = defineAsyncComponent(() => import('@/components/common/MessageBox.vue'));
const { rechercherThese } = thesesAPIService();
const { rechercherPersonne } = personnesAPIService();
const request = ref("");
const currentRoute = useRoute();

onMounted(() => {
    dataReady.value = false;
    request.value = decodeURI(currentRoute.query.q);
    search(request.value);
});

let loading = ref(false);
let result = ref([]);
let nbResult = ref(0);
let dataReady = ref(false);

async function search(query) {
    request.value = query;
    loading.value = true;

    if (currentRoute.query.domaine == "theses") {
        rechercherThese(query).then(response => {
            result.value = response.theses;
            nbResult.value = response.totalHits;
        }).catch(error => {
            displayError(error.message);
        }).finally(() => {
            loading.value = false;
            dataReady.value = true;
        })
    } else if (currentRoute.query.domaine == "personnes") {
        try {
            result.value = await rechercherPersonne(query);
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