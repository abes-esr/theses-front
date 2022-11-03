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
            <v-navigation-drawer floating permanent>
                <v-list density="compact" nav>
                    <v-list-item prepend-icon="mdi-view-dashboard" title="Home" value="home"></v-list-item>
                    <v-list-item prepend-icon="mdi-forum" title="About" value="about"></v-list-item>
                </v-list>
            </v-navigation-drawer>
            <v-col cols="10">

                <h1>
                    Titre de la thèse qui est long comme un jour sans pain et prendra probablement plusieurs lignes
                </h1>
                <h2 class="pb-4">{{ $t('theseView.par') }} <span class="orange">Prenom Nom</span></h2>
                <v-row class="pa-0 ma-0">
                    <v-chip color="orange-abes" label variant="elevated">
                        <v-icon start icon="mdi-school-outline"></v-icon>
                        {{ $t('theseView.soutenueChip') }}
                    </v-chip>
                    <h4 class="normalFont pb-4 pt-1 pl-3">{{ $t('theseView.theseDe') }} DISCPLINE </h4>
                </v-row>
                <div class="pl-6">
                    <div class="desc pl-3">
                        <p> {{ $t('theseView.direction') }} <span class="orange"><strong>directeur 1</strong></span> {{
                                $t('theseView.et')
                        }}
                            <span class="orange"><strong>directeur 2</strong></span>.
                        </p>
                        <p>{{ $t('theseView.soutenue') }} <strong>date</strong> {{ $t('theseView.a') }}
                            <strong>établissement</strong>{{ $t('theseView.cotutelle') }} <strong>établissement de
                                cotutelle</strong> {{
                                        $t('theseView.cadre')
                                }} <strong>école doctorale</strong>.

                        </p>
                        <p>
                            {{ $t('theseView.president') }} président. {{ $t('theseView.jury') }} <strong>membre jury 1,
                                membre
                                jury
                                2,
                                membre jury
                                3</strong>.
                            {{ $t('theseView.rapporteur') }} <strong>rapporteur 1, rapporteur 2, rapporteur 3</strong>.
                        </p>
                    </div>
                    <v-row class="ma-0 py-6">
                        <span class="pr-4" @click="select('FR')">
                            <h4 class="normalFont clickable" :class="selected === 'FR' ? 'selected' : ''"> {{
                                    $t('theseView.descFR')
                            }}</h4>
                        </span>


                        <v-divider vertical></v-divider>
                        <span class="pl-4" @click="select('EN')">
                            <h4 class="normalFont clickable" :class="selected === 'EN' ? 'selected' : ''">{{
                                    $t('theseView.descEN')
                            }}</h4>
                        </span>


                    </v-row>
                    <v-row class="ma-0">
                        <h4>{{ $t('theseView.resume') }}</h4>
                    </v-row>
                    <v-row class="ma-0">
                        <span>Lorem ipsum dolor sit amet. Ut molestiae quae ex quae omnis id possimus
                            voluptas sit amet ipsam eos mollitia odit et
                            saepe ducimus! Aut officiis quidem non suscipit ipsam eos repellat autem id dolorem amet et
                            facilis sequi sed laboriosam
                            recusandae quo corporis sapiente. Aut incidunt omnis aut laborum minima eum eveniet
                            quia.Lorem
                            ipsum
                            dolor sit amet. Ut molestiae quae ex quae omnis id possimus
                            voluptas sit amet ipsam eos mollitia odit et
                            saepe ducimus! Aut officiis quidem non suscipit ipsam eos repellat autem id dolorem amet et
                            facilis sequi sed laboriosam
                            recusandae quo corporis sapiente. Aut incidunt omnis aut laborum minima eum eveniet
                            quia.Lorem
                            ipsum
                            dolor sit amet. Ut molestiae quae ex quae omnis id possimus
                            voluptas sit amet ipsam eos mollitia odit et
                            saepe ducimus! Aut officiis quidem non suscipit ipsam eos repellat autem id dolorem amet et
                            facilis sequi sed laboriosam
                            recusandae quo corporis sapiente. Aut incidunt omnis aut laborum minima eum eveniet
                            quia.Lorem
                            ipsum
                            dolor sit amet. Ut molestiae quae ex quae omnis id possimus
                            voluptas sit amet ipsam eos mollitia odit et
                            saepe ducimus! Aut officiis quidem non suscipit ipsam eos repellat autem id dolorem amet et
                            facilis sequi sed laboriosam
                            recusandae quo corporis sapiente. Aut incidunt omnis aut laborum minima eum eveniet
                            quia.Lorem
                            ipsum
                            dolor sit amet. Ut molestiae quae ex quae omnis id possimus
                            voluptas sit amet ipsam eos mollitia odit et
                            saepe ducimus! Aut officiis quidem non suscipit ipsam eos repellat autem id dolorem amet et
                            facilis sequi sed laboriosam
                            recusandae quo corporis sapiente. Aut incidunt omnis aut laborum minima eum eveniet
                            quia.Lorem
                            ipsum
                            dolor sit amet. Ut molestiae quae ex quae omnis id possimus
                            voluptas sit amet ipsam eos mollitia odit et
                            saepe ducimus! Aut officiis quidem non suscipit ipsam eos repellat autem id dolorem amet et
                            facilis sequi sed laboriosam
                            recusandae quo corporis sapiente. Aut incidunt omnis aut laborum minima eum eveniet
                            quia.Lorem
                            ipsum
                            dolor sit amet. Ut molestiae quae ex quae omnis id possimus
                            voluptas sit amet ipsam eos mollitia odit et
                            saepe ducimus! Aut officiis quidem non suscipit ipsam eos repellat autem id dolorem amet et
                            facilis sequi sed laboriosam
                            recusandae quo corporis sapiente. Aut incidunt omnis aut laborum minima eum eveniet
                            quia.</span>
                    </v-row>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import SearchBar from '../components/search/SearchBar.vue';
import DomainSelector from '../components/search/DomainSelector.vue';

import { ref } from 'vue'

let selected = ref('FR');

function select(selection) {
    selected.value = selection;
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