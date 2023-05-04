<template>
  <div v-if="dataReady">
    <thesis-toolbar />

        <!--<v-col cols="2" class="pa-6 pl-8">
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
                            }}</span>
                            <span v-else>{{
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
    </div>
    -->
    <scroll-to-top-button v-show="hasScrolled" class="scroll-to-top-wrapper" :nb-result=1 />
</div>
</template>

<script setup>
import ScrollToTopButton from "@/components/common/ScrollToTopButton.vue";
import ThesisToolbar from "@/components/theses/ThesisToolbar.vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();

const props = defineProps({
  dataReady: {
    type: Boolean,
    default: false
  }
});

</script>

<style>

</style>