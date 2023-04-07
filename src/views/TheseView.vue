<template>
    <div class="pa-4">
        <Message-box ref="messageBox"></Message-box>
        <v-row class="justify-center">
            <v-col cols="12" md="6" class="pt-0">
                <domain-selector compact></domain-selector>
            </v-col>
        </v-row>
        <!--<v-row class="justify-center">
            <v-col cols="12" md="6" class="py-0">
                <search-bar @search="search" :loading="loading" @onError="displayError" />
            </v-col>
        </v-row>-->
        <v-row v-if="dataReady">
            <v-col cols="2" class="pa-6 pl-8">
                <v-row>
                    <h2>{{ $t('theseView.motcle') }}</h2>
                </v-row>
                <v-row>
                    <v-list density="compact" v-if="selected === 'fr'" :items="keywordsFR"></v-list>
                    <v-list density="compact" v-if="selected === 'en'" :items="keywordsEN"></v-list>
                </v-row>
            </v-col>
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
                    <v-chip :class="these.status" label variant="elevated" class="mr-2">
                        <span v-if="these.status === 'enCours'"><v-icon start icon="mdi-cogs"></v-icon>Préparation</span>
                        <span v-if="these.status === 'soutenue'"><v-icon start
                                icon="mdi-school-outline"></v-icon>Soutenue</span>
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
                        <p> <strong>
                                <span v-if="these.source === 'sudoc'">{{ $t('theseView.soutenueEn') }}{{
                                    these.dateSoutenance.slice(-4)
                                }}</span><span v-else>{{
    $t('theseView.soutenue')
}}{{
    these.dateSoutenance
}}</span></strong> {{ $t('theseView.a') }}
                            <strong>{{
                                these.etabSoutenance.nom
                            }}</strong>

                            <span v-if="these.etabCotutelle.length > 0">{{ $t('theseView.cotutelle') }} <span
                                    v-for="(item, index) in these.etabCotutelle" :key="item.ppn"><strong> {{
                                        item.nom
                                    }} </strong><span v-if="index < these.etabCotutelle.length - 1">,
                                    </span></span> </span>

                            <span v-if="these.ecolesDoctorales.length > 0">{{ $t('theseView.cadre') }} <span
                                    v-for="(item, index) in these.ecolesDoctorales" :key="item.ppn"><strong> {{
                                        item.nom
                                    }} </strong><span v-if="index < these.ecolesDoctorales.length - 1">,
                                    </span></span></span>

                            <span v-if="these.partenairesRecherche.length > 0">{{ $t('theseView.partenariat') }}, <span
                                    v-for="(item, index) in these.partenairesRecherche" :key="item.ppn"><strong> {{
                                        item.nom
                                    }} ({{ item.type }})</strong><span
                                        v-if="index < these.partenairesRecherche.length - 1">,
                                    </span></span></span>.
                        </p>
                        <p><span v-if="these.presidentJury.nom">
                                {{ $t('theseView.president') }} <strong>{{ these.presidentJury.prenom }} {{
                                    these.presidentJury.nom
                                }}</strong>.</span> {{ $t('theseView.jury') }} <span
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
        <ScrollToTopButton v-show="hasScrolled" class="scroll-to-top-wrapper" :nb-result=1 />

    </div>
</template>

<script setup>
import { ref, onBeforeMount, watch, defineAsyncComponent, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useMeta } from 'vue-meta';
import { useI18n } from "vue-i18n";
import ScrollToTopButton from "@/components/common/ScrollToTopButton.vue";


import DomainSelector from '@/components/common/DomainSelector.vue';

import { APIService } from '@/services/StrategyAPI';

const MessageBox = defineAsyncComponent(() => import('@/components/common/MessageBox.vue'));

const route = useRoute();

const { getData } = APIService();

let selected = ref('fr');

let dataReady = ref(false);

let these = ref({});

let resume = ref("");

let keywordsFR = [];
let keywordsEN = [];

const { t } = useI18n();
const { meta } = useMeta({});

watchEffect(() => {
    const titleThese = these.value.titrePrincipal ? these.value.titrePrincipal : "";
    meta.title = titleThese;
    meta.description = t("meta.descThese") + titleThese;
});

let hasScrolled = ref(false);

onBeforeMount(() => {
    dataReady.value = false;
    window.addEventListener('scroll', () => { hasScrolled.value = true; });
    getData(route.params.id).then(result => {
        these.value = result.data;
        resume.value = these.value.resumes.fr;
        dataReady.value = true;
        setKeywords();
    }).catch(error => {
        displayError(error.message);
    });
});

function setKeywords() {
    keywordsFR = these.value.sujetsRameau.concat(these.value.sujetsFR);
    keywordsEN = these.value.sujetsEN;
}

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
    });
}

</script>

<style scoped lang="scss">
@use 'vuetify/settings';

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

.soutenue {
    background-color: rgb(var(--v-theme-orange-abes));

}

.enCours {
    background-color: rgb(var(--v-theme-secondary));
    ;
}

.v-list {
    background-color: transparent !important;
}

.scroll-to-top-wrapper {
    position: sticky;
    top: 90vh;
    margin-bottom: 1rem;
    margin-left: 97%;
    width: 30px;
    height: 30px;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
        margin: 0 0;
        height: 60px;
        left: 90vw;
        top: unset;
        bottom: 1vh;
    }
}
</style>