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
<!-- Auteur -->
      <tr v-if="these.auteurs && these.auteurs.length > 0" class="table-rows">
        <td><strong>{{ $t('theseView.auteur') }}</strong></td>
        <td class="table-cell">
          <p class="orange">
            <template v-for="(auteur, index) in these.auteurs" :key="auteur.ppn">
              {{ auteur.prenom }} <strong>{{ auteur.nom }}</strong>
              <template v-if="index < these.auteurs.length - 1">,{{'\xa0'}}</template>
            </template>
          </p>
        </td>
      </tr>
<!-- Direction -->
      <tr v-if="these.directeurs && these.directeurs.length > 0" class="table-rows">
        <td><strong>{{ $t('theseView.direction') }}</strong></td>
        <td class="table-cell">
          <p>
            <template v-for="(directeur, index) in these.directeurs" :key="directeur.ppn">
              {{ directeur.prenom }} <strong>{{ directeur.nom }}</strong>
              <template v-if="index < these.directeurs.length - 1">,{{'\xa0'}}</template>
            </template>
          </p>
        </td>
      </tr>
<!-- Type -->
      <tr v-if="these.type" class="table-rows">
        <td><strong>{{ $t('theseView.type') }}</strong></td>
        <td class="table-cell">
          <span>{{ these.type }}</span>
        </td>
      </tr>
<!-- Discipline -->
      <tr v-if="these.discipline" class="table-rows">
        <td><strong>{{ $t('theseView.disciplines') }}</strong></td>
        <td class="table-cell">
          <span>{{ these.discipline }}</span>
        </td>
      </tr>
<!-- Date soutenance -->
      <tr v-if="these.dateSoutenance" class="table-rows">
        <td><strong>{{ $t('theseView.dateSoutenance') }}</strong></td>
        <td class="table-cell">
          <span>{{ these.dateSoutenance }}</span>
        </td>
      </tr>
<!-- Etablissement de soutenance et cotutelle-->
      <tr v-if="these.etabSoutenance && these.etabSoutenance.nom" class="table-rows">
        <td><strong>{{ $t('theseView.etablissements') }}</strong></td>
        <td class="table-cell">
            <p><strong>{{ these.etabSoutenance.nom }} </strong>
              <template v-if="these.etabCotutelle.length > 0">
                {{ $t('theseView.cotutelle') }}
                <span v-for="(item, index) in these.etabCotutelle" :key="item.ppn"><strong>
                  {{ item.nom }} </strong>
                  <template v-if="index < these.etabCotutelle.length - 1">, </template>
                </span>
              </template>
            </p>
        </td>
      </tr>
<!-- Ecoles doctorales -->
      <tr v-if="these.ecolesDoctorales && these.ecolesDoctorales.length > 0" class="table-rows">
        <td><strong>{{ $t('theseView.ecoles') }}</strong></td>
        <td class="table-cell">
          <p>
            <template v-for="(ecole, index) in these.ecolesDoctorales" :key="ecole.ppn">
              <strong>{{ ecole.nom }}</strong>
              <template v-if="index < these.ecolesDoctorales.length - 1">,{{'\xa0'}}</template>
            </template>
          </p>
        </td>
      </tr>
<!-- Partenariat -->
      <tr v-if="these.partenairesRecherche && these.partenairesRecherche.length > 0" class="table-rows">
        <td><strong>{{ $t('theseView.partenariat') }}</strong></td>
        <td class="table-cell">
          <p>
            <template v-for="(ecole, index) in these.partenairesRecherche" :key="ecole.ppn">
              {{ ecole.nom }}
              <template v-if="index < these.partenairesRecherche.length - 1">,{{'\xa0'}}</template>
            </template>
          </p>
        </td>
      </tr>
<!-- Jury -->
<!-- Président-->
      <tr v-if="these.presidentJury" class="table-rows">
        <td><strong>{{ $t('theseView.jury') }}</strong></td>
        <td class="table-cell">
          <span><strong>{{ $t('theseView.president') }}</strong> {{ these.presidentJury.prenom }} <strong>{{ these.presidentJury.nom }}</strong> </span>
        </td>
      </tr>
<!-- Composition-->
      <tr v-if="these.membresJury && these.membresJury.length > 0" class="table-rows">
        <td></td>
        <td>
          <span>
            {{'\r'}}<strong>{{ $t('theseView.composition') }} </strong>
              <template v-for="(membre, index) in these.membresJury" :key="membre.ppn">
                {{'\xa0'}}{{ membre.prenom }} <strong>{{ membre.nom }}</strong>
                <template v-if="index < these.membresJury.length - 1">,{{'\xa0'}}</template>
              </template>
          </span>
        </td>
      </tr>
<!-- Rapporteurs-->
      <tr v-if="these.rapporteurs && these.rapporteurs.length > 0" class="table-rows">
        <td></td>
        <td>
          <span>
            {{ "\r" }}<strong>{{ $t("theseView.rapporteurs") }} </strong>
              <template v-for="(rapporteur, index) in these.rapporteurs" :key="rapporteur.ppn">
                {{ "\xa0" }}{{ rapporteur.prenom }} <strong>{{ rapporteur.nom }}</strong>
                <template v-if="index < these.rapporteurs.length - 1">,{{ "\xa0" }}</template>
              </template>
          </span>
        </td>
      </tr>
    </tbody>
  </table>
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

watch(() => props.these,() => {
console.info(props.these)
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
    width: 92%;
    margin: auto;
    margin-bottom: 10px;

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
  }

  .table tbody tr:nth-of-type(odd) {
    background-color: rgb(var(--v-theme-gris-clair));
  }
</style>