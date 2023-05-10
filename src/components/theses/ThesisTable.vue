<template>
  <div class="title-wrapper line-clamp">
    <div class="thesis-icon" >
      <thesis-icon :status="these.status"></thesis-icon>
    </div>
    <div class="title-flexbox"> <!-- #TODO v-if anglais/francais -->
      <span>
        {{ these.titrePrincipal }}
<!--        selecteur langue-->
      </span>
    </div>
  </div>
  <table class="table">
    <tbody class="table-body">
      <tr class="table-rows">
        <td><strong>Auteur :</strong></td>
        <td class="table-cell">
          <span v-for="(auteur, index) in these.auteurs" :key="auteur.ppn" class="orange">
            <p>{{ auteur.prenom }} <strong>{{ auteur.nom }}</strong></p>
            <template v-if="index < these.auteurs.length - 2">, </template>
          </span>
        </td>
      </tr>
      <tr class="table-rows">
        <td><strong>Direction :</strong></td>
        <td class="table-cell">
          <span v-for="(directeur, index) in these.directeurs" :key="directeur.ppn">
            <p>{{ directeur.prenom }} <strong>{{ directeur.nom }}</strong></p>
            <template v-if="index < these.auteurs.length - 2">, </template>
          </span>
        </td>
      </tr>
      <tr class="table-rows">
        <td><strong>Type :</strong></td>
        <td class="table-cell">
          <span>{{  }}</span>
        </td>
      </tr>
      <tr v-if="these.discipline" class="table-rows">
        <td><strong>Discipline(s) :</strong></td>
        <td class="table-cell">
          <span>{{ these.discipline }}</span>
        </td>
      </tr>
      <tr v-if="these.dateSoutenance" class="table-rows">
        <td><strong>Date de soutenance :</strong></td>
        <td class="table-cell">
          <span>{{ these.dateSoutenance }}</span>
        </td>
      </tr>
      <tr v-if="these.etabSoutenance.nom" class="table-rows">
        <td><strong>{{ $t('theseView.etablissements') }}</strong></td>
        <td class="table-cell">
            <p><strong>{{ these.etabSoutenance.nom }} </strong>
              <template v-if="these.etabCotutelle.length > 0">
                {{ $t('theseView.cotutelle') }}
                <span v-for="(item, index) in these.etabCotutelle" :key="item.ppn"><strong>
                  {{ item.nom }} </strong>
                  <span v-if="index < these.etabCotutelle.length - 1">, </span>
                </span>
              </template>
            </p>
        </td>
      </tr>
      <tr v-if="these.ecolesDoctorales.length > 0" class="table-rows">
        <td><strong>{{ $t('theseView.ecoles') }}</strong></td>
        <td class="table-cell">
          <span> <span v-for="(item, index) in these.ecolesDoctorales" :key="item.ppn"><strong>
            {{ item.nom }} </strong><span v-if="index < these.ecolesDoctorales.length - 1">,
          </span></span></span>
        </td>
      </tr>
    </tbody>
  </table>
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
<            <h1>
<                {{ these.titrePrincipal }}
<            </h1>
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
</template>

<script setup>
import { watch } from "vue";
import ThesisIcon from "@/components/theses/results/ThesisIcon.vue";

const props = defineProps({
  these: {
    type: Object,
    required: true
  }
});

console.info(props.these)
watch(() => props.these,() => {
});
</script>

<style lang="scss" scoped>
@use 'vuetify/settings';

  .title-wrapper {
    padding: 20px 20px 10px 10px;
    display: grid !important;
    grid-template-columns: 2fr 20fr;
  }

  .thesis-icon {
    align-self: start;
    justify-self: center;
  }

  .title-flexbox {
    span {
      font-family: Roboto-Medium, sans-serif;
      font-size: 25.5px;
      font-weight: 600;
      letter-spacing: -0.5px;
      line-height: 1.2;
    }
  }

  .orange {
    color: rgb(var(--v-theme-orange-abes));
  }

  .table {
    width: 90%;
    margin: auto;

    border-left: 3px solid rgb(var(--v-theme-text-dark-blue));;
  }

  .table-body {
    width: 100%;
  }

  .table-rows {
    width: 100%;
    padding: 0 10px 0;
    display: inline-grid;
    grid-template-columns: 3fr 7fr;
  }

</style>