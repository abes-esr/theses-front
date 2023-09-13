<template>
  <table class="table" v-if="these.auteurs && dataReady">
    <tbody class="table-body">
      <!-- Auteur -->
      <tr v-if="these.auteurs && these.auteurs.length > 0" class="table-rows">
        <span><strong>{{ $t('theseView.auteur') }}&nbsp;:{{ '\xa0' }}</strong></span>
        <span>
          <template v-for="(auteur, index) in these.auteurs" :key="auteur.ppn">
            <span :class="auteur.ppn ? 'clickable orange' : ''" @click="linkTo(auteur.ppn)">
              {{ auteur.prenom }} {{ auteur.nom }}
            </span>
            <template v-if="index < these.auteurs.length - 1">,{{ '\xa0' }}</template>
          </template>
        </span>
      </tr>
      <!-- Direction -->
      <tr v-if="these.directeurs && these.directeurs.length > 0" class="table-rows">
        <span><strong>{{ $t('theseView.direction') }}&nbsp;:{{ '\xa0' }}</strong></span>
        <span>
          <template v-for="(directeur, index) in these.directeurs" :key="directeur.ppn">
            <span :class="directeur.ppn ? 'clickable lightblue' : ''" @click="linkTo(directeur.ppn)">{{ directeur.prenom
            }} {{ directeur.nom }}</span>
            <template v-if="index < these.directeurs.length - 1">,{{ '\xa0' }}</template>
          </template>
        </span>
      </tr>
      <!-- Type -->
      <tr class="table-rows">
        <span><strong>{{ $t('theseView.type') }}&nbsp;:{{ '\xa0' }}</strong></span>
        <span>
          <span>{{ these.status === "enCours" ? $t('theseView.projet') : $t('theseView.doctorat') }}</span>
        </span>
      </tr>
      <!-- Discipline -->
      <tr v-if="these.discipline" class="table-rows">
        <span><strong>{{ $t('theseView.disciplines') }}&nbsp;:{{ '\xa0' }}</strong></span>
        <span>{{ these.discipline }}</span>
      </tr>
      <!-- Date soutenance -->
      <tr v-if="these.dateSoutenance || these.datePremiereInscriptionDoctorat" class="table-rows">
        <span><strong>{{ $t('theseView.dateSoutenance') }}&nbsp;:{{ '\xa0' }}</strong></span>
        <!-- Cas STAR : date de soutenance complete -->
        <span v-if="these.source === 'star'"> {{ $t('theseView.soutenue') }} {{
          these.dateSoutenance }}</span>
        <!-- Cas SUDOC : uniquement annee de soutenance -->
        <span v-if="these.source === 'sudoc'">{{ $t('theseView.soutenueEn') }} {{
          these.dateSoutenance.slice(-4) }}</span>
        <!-- Cas STEP : date d'inscription + si renseignee date de soutenance -->
        <span v-if="these.source === 'step'">
          <span>
            {{ $t('theseView.inscription') }}
            {{ these.datePremiereInscriptionDoctorat }}
          </span>
          <span v-if="these.isSoutenue">
            <br />
            <span> {{ $t('theseView.soutenue') }}</span>
            {{ these.dateSoutenance }}
          </span>
        </span>
      </tr>
      <!-- Etablissement de soutenance et cotutelle-->
      <tr v-if="these.etabSoutenance && these.etabSoutenance.nom" class="table-rows">
        <span>
          <strong>{{ $t('theseView.etablissements') }}&nbsp;:{{ '\xa0' }}</strong>
        </span>
        <span>
          <strong> {{ these.etabSoutenance.nom }} </strong>
          <template v-if="these.etabCotutelle.length > 0">
            {{ $t('theseView.cotutelle') }}
            <span v-for="(item, index) in these.etabCotutelle" :key="item.ppn"><strong>
                {{ item.nom }} </strong>
              <template v-if="index < these.etabCotutelle.length - 1">, </template>
            </span>
          </template>
        </span>
      </tr>
      <!-- Ecoles doctorales -->
      <tr v-if="these.ecolesDoctorales && these.ecolesDoctorales.length > 0" class="table-rows">
        <span><strong>{{ $t('theseView.ecoles') }}&nbsp;:{{ '\xa0' }}</strong></span>
        <span>
          <template v-for="(ecole, index) in these.ecolesDoctorales" :key="ecole.ppn">
            <strong>{{ ecole.nom }}</strong>
            <template v-if="index < these.ecolesDoctorales.length - 1">,{{ "\xa0" }}</template>
          </template>
        </span>
      </tr>
      <!-- Partenariat -->
      <tr v-if="these.partenairesRecherche && these.partenairesRecherche.length > 0" class="table-rows">
        <span>
          <strong>{{ $t('theseView.partenariat') }}&nbsp;:{{ '\xa0' }}</strong>
        </span>
        <span>
          <template v-for="(ecole, index) in these.partenairesRecherche" :key="ecole.ppn">
            {{ ecole.nom }} {{ '\xa0' }} ({{ ecole.type }})
            <template v-if="index < these.partenairesRecherche.length - 1">,{{ '\xa0' }}</template>
          </template>
        </span>
      </tr>
      <!-- Jury -->
      <!-- Président-->
      <tr
        v-if="(these.presidentJury && these.presidentJury.nom) || (these.membresJury && these.membresJury.length > 0) || (these.rapporteurs && these.rapporteurs.length > 0)"
        class="table-rows">
        <span>
          <strong>{{ $t('theseView.jury') }}&nbsp;:{{ '\xa0' }}</strong>
        </span>
        <span v-if="these.presidentJury && these.presidentJury.nom" id="president">
          <strong>{{ $t('theseView.president') }}{{ '\xa0' }}</strong>
          <span :class="these.presidentJury.ppn ? 'clickable lightblue' : ''" @click="linkTo(these.presidentJury.ppn)">{{
            these.presidentJury.prenom }} {{
    these.presidentJury.nom }}</span>
        </span>
      </tr>
      <!-- Composition-->
      <tr v-if="these.membresJury && these.membresJury.length > 0" class="table-rows">
        <span class="empty-first-cell-mandatory"></span>
        <span>
          {{ '\r' }}<strong>{{ $t('theseView.composition') }} {{ '\xa0' }}</strong>
          <template v-for="(membre, index) in these.membresJury" :key="membre.ppn">
            <span :class="membre.ppn ? 'clickable lightblue' : ''" @click="linkTo(membre.ppn)">{{
              membre.prenom }} {{ membre.nom }}</span>
            <template v-if="index < these.membresJury.length - 1">,{{ '\xa0' }}</template>
          </template>
        </span>
      </tr>
      <!-- Rapporteurs-->
      <tr v-if="these.rapporteurs && these.rapporteurs.length > 0" class="table-rows">
        <span class="empty-first-cell-mandatory"></span>
        <span>
          {{ "\r" }}<strong>{{ $t("theseView.rapporteurs") }} {{ "\xa0" }}</strong>
          <template v-for="(rapporteur, index) in these.rapporteurs" :key="rapporteur.ppn">
            <span :class="rapporteur.ppn ? 'clickable lightblue' : ''" @click="linkTo(rapporteur.ppn)">{{
              rapporteur.prenom }} {{ rapporteur.nom }}</span>
            <template v-if="index < these.rapporteurs.length - 1">,{{ "\xa0" }}</template>
          </template>
        </span>
      </tr>
    </tbody>
  </table>
  <div v-if="!dataReady">
    <v-skeleton-loader type="table-heading"></v-skeleton-loader>
    <v-skeleton-loader type="table-row"></v-skeleton-loader>
    <v-skeleton-loader type="table-row"></v-skeleton-loader>
    <v-skeleton-loader type="table-row"></v-skeleton-loader>
    <v-skeleton-loader type="table-row"></v-skeleton-loader>
    <v-skeleton-loader type="table-row"></v-skeleton-loader>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

defineProps({
  these: {
    type: Object,
    required: true
  },
  dataReady: {
    type: Boolean
  }
});

const router = useRouter();
function linkTo(id) {
  if (id) router.push("/" + id);
}

</script>

<style lang="scss" scoped>
@use 'vuetify/settings';

.orange {
  color: rgb(var(--v-theme-orange-abes));
}

.lightblue {
  color: rgb(var(--v-theme-secondary-darken-2));
}

.table {
  width: 92%;
  margin: auto;
}

.table-body {
  width: 100%;

  tr:last-child {
    border-bottom: unset;
  }
}

.table-rows {
  width: 100%;
  padding: 0 10px 0;
  display: inline-grid;
  grid-template-columns: 2fr 7fr;
  border-bottom: 1px solid rgb(var(--v-theme-gris-fonce));
  color: rgb(var(--v-theme-text-dark-blue));

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    display: block;
    hyphens: auto;
  }
}

#president {
  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    display: block;
  }
}

.clickable {
  cursor: pointer;
  font-weight: bold;
  color: rgb(var(--v-theme-secondary-darken-2));
}
</style>