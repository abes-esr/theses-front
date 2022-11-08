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
                <search-bar></search-bar>
            </v-col>
        </v-row>
        <v-row v-if="dataReady">
            <v-col cols="2"></v-col>
            <v-col cols="10">
                <h1>
                    {{ these.titrePrincipal }}
                </h1>
                <h2 class="pb-4">{{ $t('theseView.par') }}

                    <span v-for="(item, index) in these.auteurs" :key="item.ppn"> <strong class="orange">{{
                            item.prenom
                    }} {{ item.nom }} </strong><span v-if="index < these.auteurs.length - 2">,
                        </span></span>

                </h2>
                <v-row class="pa-0 ma-0">
                    <v-chip color="orange-abes" label variant="elevated">
                        <v-icon start icon="mdi-school-outline"></v-icon>
                        {{ $t('theseView.soutenueChip') }}
                    </v-chip>
                    <h4 class="normalFont pb-4 pt-1 pl-3">{{ $t('theseView.theseDe') }} {{ these.discipline }} </h4>
                </v-row>
                <div class="pl-6">
                    <div class="desc pl-3">
                        <p> {{ $t('theseView.direction') }}
                            <span v-for="(item, index) in these.directeurs" :key="item.ppn"> <strong class="orange">{{
                                    item.prenom
                            }} {{ item.nom }} </strong><span v-if="index < these.directeurs.length - 2">,
                                </span>
                                <span v-if="index == these.directeurs.length - 2"> {{ $t('theseView.et') }}
                                </span></span>.

                        </p>
                        <p>{{ $t('theseView.soutenue') }} <strong>{{
                                these.dateSoutenance
                        }}</strong> {{ $t('theseView.a') }}
                            <strong>{{
                                    these.etabSoutenance.nom
                            }}</strong>

                            <span v-if="these.etabCotutelle.length > 0">{{ $t('theseView.cotutelle') }} <span
                                    v-for="(item, index) in these.etabCotutelle" :key="item.ppn"><strong> {{
                                            item.nom
                                    }} </strong><span v-if="index < these.etabCotutelle.length - 1">,
                                    </span></span> </span>

                            {{
                                    $t('theseView.cadre')
                            }} <strong> ??????????</strong>.

                        </p>
                        <p>
                            {{ $t('theseView.president') }} président. {{ $t('theseView.jury') }} <span
                                v-for="(item, index) in these.membresJury" :key="item.ppn"><strong>{{
                                        item.prenom
                                }} {{ item.nom }} </strong><span v-if="index < these.membresJury.length - 1">,
                                </span></span>.

                            <span v-if="these.rapporteurs.length > 0">{{ $t('theseView.rapporteur') }} <span
                                    v-for="(item, index) in these.rapporteurs" :key="item.ppn"><strong> {{
                                            item.prenom
                                    }} {{ item.nom }}</strong><span v-if="index < these.rapporteurs.length - 1">,
                                    </span></span>.</span>
                        </p>
                    </div>
                    <v-row class="ma-0 pt-8">
                        <h4>{{ $t('theseView.resume') }}</h4>
                    </v-row>
                    <v-row class="ma-0 pb-6 pt-2">
                        <div v-for="(item, key) in these.resumes" :key="item">
                            <span @click="select(key)">
                                <h4 class="normalFont clickable px-2" :class="selected === key ? 'selected' : ''"> {{
                                        key
                                }}</h4>
                            </span>
                        </div>
                    </v-row>
                    <v-row class="ma-0">
                        <span> {{ resume }}</span>
                    </v-row>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import { useRoute } from 'vue-router'

import SearchBar from '../components/search/SearchBar.vue';
import DomainSelector from '../components/search/DomainSelector.vue';
import MessageBox from "@/components/common/MessageBox.vue";


import thesesAPI from '../services/ThesesAPI';


const route = useRoute();

let selected = ref('fr');

let dataReady = ref(false);

let these = ref({});

let resume = ref("");


onBeforeMount(() => {
    console.log(route.params.nnt)
    dataReady.value = false;
    thesesAPI.getThese(route.params.nnt).then(result => {
        these.value = result.data;
        resume.value = these.value.resumes.fr
        dataReady.value = true;
    }).catch(error => {
        displayError(error.message);
    });
})

function select(selection) {
    selected.value = selection;
}

watch(selected, async (newSelected) => {
    for (const [key, value] of Object.entries(these.value.resumes)) {
        if (key === newSelected)
            resume.value = value;
    }
});

const messageBox = ref(null);

function displayError(message) {
    messageBox.value?.open(message, {
        type: "error"
    })
}

</script>

<style scoped>
.clickable {
    cursor: pointer;
}

.selected {
    border-bottom: solid 2px rgb(var(--v-theme-orange-abes));
}

.normalFont {
    font-weight: normal;
}

.orange {
    color: rgb(var(--v-theme-orange-abes));
}

.desc {
    border-left: solid 5px rgb(var(--v-theme-orange-abes));
}
</style>