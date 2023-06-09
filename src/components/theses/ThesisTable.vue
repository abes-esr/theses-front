<template>
  <table class="table">
    <tbody class="table-body">
<!-- Auteur -->
      <tr v-if="these.auteurs && these.auteurs.length > 0" class="table-rows">
        <span><strong>{{ $t('theseView.auteur') }}{{'\xa0'}}</strong></span>
        <span class="orange">
            <template v-for="(auteur, index) in these.auteurs" :key="auteur.ppn">
              {{ auteur.prenom }} <strong>{{ auteur.nom }}</strong>
              <template v-if="index < these.auteurs.length - 1">,{{'\xa0'}}</template>
            </template>
        </span>
      </tr>
<!-- Direction -->
      <tr v-if="these.directeurs && these.directeurs.length > 0" class="table-rows">
        <span><strong>{{ $t('theseView.direction') }}{{'\xa0'}}</strong></span>
        <span>
            <template v-for="(directeur, index) in these.directeurs" :key="directeur.ppn">
              {{ directeur.prenom }} <strong>{{ directeur.nom }}</strong>
              <template v-if="index < these.directeurs.length - 1">,{{'\xa0'}}</template>
            </template>
        </span>
      </tr>
<!-- Type -->
      <tr v-if="these.type" class="table-rows">
        <span><strong>{{ $t('theseView.type') }}{{'\xa0'}}</strong></span>
        <span>
          <span>{{ these.type }}</span>
        </span>
      </tr>
<!-- Discipline -->
      <tr v-if="these.discipline" class="table-rows">
        <span><strong>{{ $t('theseView.disciplines') }}{{'\xa0'}}</strong></span>
        <span>{{ these.discipline }}</span>
      </tr>
<!-- Date soutenance -->
      <tr v-if="these.dateSoutenance" class="table-rows">
        <span><strong>{{ $t('theseView.dateSoutenance') }}{{'\xa0'}}</strong></span>
        <span>{{ these.dateSoutenance }}</span>
      </tr>
<!-- Etablissement de soutenance et cotutelle-->
      <tr v-if="these.etabSoutenance && these.etabSoutenance.nom" class="table-rows">
        <span>
          <strong>{{ $t('theseView.etablissements') }}{{'\xa0'}}</strong>
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
        <span><strong>{{ $t('theseView.ecoles') }}{{'\xa0'}}</strong></span>
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
              <strong>{{ $t('theseView.partenariat') }}{{'\xa0'}}</strong>
            </span>
            <span>
              <template v-for="(ecole, index) in these.partenairesRecherche" :key="ecole.ppn">
                {{ ecole.nom }}
                <template v-if="index < these.partenairesRecherche.length - 1">,{{'\xa0'}}</template>
              </template>
            </span>
      </tr>
<!-- Jury -->
<!-- Président-->
      <tr v-if="(these.presidentJury && these.presidentJury.nom) || (these.membresJury && these.membresJury.length > 0) || (these.rapporteurs && these.rapporteurs.length > 0)" class="table-rows">
        <span>
          <strong>{{ $t('theseView.jury') }}{{'\xa0'}}</strong>
        </span>
        <span v-if="these.presidentJury && these.presidentJury.nom" id="president">
          <strong>{{ $t('theseView.president') }}</strong> {{ these.presidentJury.prenom }} <strong>{{ these.presidentJury.nom }}</strong>
        </span>
      </tr>
<!-- Composition-->
      <tr v-if="these.membresJury && these.membresJury.length > 0" class="table-rows">
        <span class="empty-first-cell-mandatory"></span>
        <span>
            {{'\r'}}<strong>{{ $t('theseView.composition') }} </strong>
              <template v-for="(membre, index) in these.membresJury" :key="membre.ppn">
                {{'\xa0'}}{{ membre.prenom }} <strong>{{ membre.nom }}</strong>
                <template v-if="index < these.membresJury.length - 1">,{{'\xa0'}}</template>
              </template>
        </span>
      </tr>
<!-- Rapporteurs-->
      <tr v-if="these.rapporteurs && these.rapporteurs.length > 0" class="table-rows">
        <span class="empty-first-cell-mandatory"></span>
        <span>
            {{ "\r" }}<strong>{{ $t("theseView.rapporteurs") }} </strong>
              <template v-for="(rapporteur, index) in these.rapporteurs" :key="rapporteur.ppn">
                {{ "\xa0" }}{{ rapporteur.prenom }} <strong>{{ rapporteur.nom }}</strong>
                <template v-if="index < these.rapporteurs.length - 1">,{{ "\xa0" }}</template>
              </template>
        </span>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
const props = defineProps({
  these: {
    type: Object,
    required: true
  }
});

</script>

<style lang="scss" scoped>
@use 'vuetify/settings';

  .orange {
    color: rgb(var(--v-theme-orange-abes));
  }

  .table {
    width: 92%;
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
    grid-template-columns: 2fr 7fr;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
      display: block;
      hyphens: auto;
    }
  }

  .table tbody tr:nth-of-type(odd) {
    background-color: rgb(var(--v-theme-gris-clair));
  }

  #president {
    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
      display: block;
    }
  }
</style>