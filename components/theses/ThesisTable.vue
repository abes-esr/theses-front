<template>
  <table class="table" v-if="these.auteurs">
    <tbody class="table-body">
      <!-- Auteur -->
      <tr v-if="these.auteurs && these.auteurs.length > 0" class="table-rows">
        <td><strong>{{ $t('theseView.auteur') }}&nbsp;:{{ '\xa0' }}</strong></td>
        <td>
          <span v-for="(auteur, index) in these.auteurs" :key="auteur.ppn">
            <span :class="auteur.ppn ? 'clickable orange' : ''" @click="linkTo(auteur.ppn)">
              {{ auteur.prenom }} {{ auteur.nom }}
            </span>
            <span v-if="index < these.auteurs.length - 1">,{{ '\xa0' }}</span>
          </span>
        </td>
      </tr>
      <!-- Direction -->
      <tr v-if="these.directeurs && these.directeurs.length > 0" class="table-rows">
        <td><strong>{{ $t('theseView.direction') }}&nbsp;:{{ '\xa0' }}</strong></td>
        <td>
          <span v-for="(directeur, index) in these.directeurs" :key="directeur.ppn">
            <span :class="directeur.ppn ? 'clickable lightblue' : ''" @click="linkTo(directeur.ppn)">{{ directeur.prenom
            }} {{ directeur.nom }}</span>
            <span v-if="index < these.directeurs.length - 1">,{{ '\xa0' }}</span>
          </span>
        </td>
      </tr>
      <!-- Type -->
      <tr class="table-rows">
        <td><strong>{{ $t('theseView.type') }}&nbsp;:{{ '\xa0' }}</strong></td>
        <td>
          <span>{{ these.status === "enCours" ? $t('theseView.projet') : $t('theseView.doctorat') }}</span>
        </td>
      </tr>
      <!-- Discipline -->
      <tr v-if="these.discipline" class="table-rows">
        <td><strong>{{ $t('theseView.disciplines') }}&nbsp;:{{ '\xa0' }}</strong></td>
        <td>{{ these.discipline }}</td>
      </tr>
      <!-- Date soutenance -->
      <tr v-if="these.dateSoutenance || these.datePremiereInscriptionDoctorat" class="table-rows">
        <td><strong>{{ $t('theseView.dateSoutenance') }}&nbsp;:{{ '\xa0' }}</strong></td>
        <!-- Cas STAR : date de soutenance complete -->
        <td v-if="these.source === 'star'"> {{ $t('theseView.soutenue') }} {{
          these.dateSoutenance }}</td>
        <!-- Cas SUDOC : uniquement annee de soutenance -->
        <td v-if="these.source === 'sudoc'">{{ $t('theseView.soutenueEn') }} {{
          these.dateSoutenance.slice(-4) }}</td>
        <!-- Cas STEP : date d'inscription + si renseignee date de soutenance -->
        <td v-if="these.source === 'step'">
          <span>
            {{ $t('theseView.inscription') }}
            {{ these.datePremiereInscriptionDoctorat }}
          </span>
        <td v-if="these.isSoutenue">
          <br />
          <span> {{ $t('theseView.soutenue') }}</span>
          {{ these.dateSoutenance }}
        </td>
        </td>
      </tr>
      <!-- Etablissement de soutenance et cotutelle-->
      <tr v-if="these.etabSoutenance && these.etabSoutenance.nom" class="table-rows">
        <td>
          <strong>{{ $t('theseView.etablissements') }}&nbsp;:{{ '\xa0' }}</strong>
        </td>
        <td>
          <strong> <a :class='these.etabSoutenance.ppn ? "clickable lightblue" : ""'
              @click="linkTo(these.etabSoutenance.ppn)">{{ these.etabSoutenance.nom }}
            </a></strong>
          <span v-if="these.etabCotutelle.length > 0">
            {{ $t('theseView.cotutelle') }}
            <span v-for="(item, index) in these.etabCotutelle" :key="item.ppn"><strong>
                <span :class='item.ppn ? "clickable lightblue" : ""' @click="linkTo(item.ppn)"> {{ item.nom }} </span>
              </strong>
              <span v-if="index < these.etabCotutelle.length - 1">, </span>
            </span>
          </span>
        </td>
      </tr>
      <!-- Ecoles doctorales -->
      <tr v-if="these.ecolesDoctorales && these.ecolesDoctorales.length > 0" class="table-rows">
        <td><strong>{{ $t('theseView.ecoles') }}&nbsp;:{{ '\xa0' }}</strong></td>
        <td>
          <span v-for="(ecole, index) in these.ecolesDoctorales" :key="ecole.ppn">
            <strong><span :class='ecole.ppn ? "clickable lightblue" : ""' @click="linkTo(ecole.ppn)"> {{ ecole.nom
            }}</span></strong>
            <span v-if="index < these.ecolesDoctorales.length - 1">,{{ "\xa0" }}</span>
          </span>
        </td>
      </tr>
      <!-- Partenariat -->
      <!-- Première ligne -->
      <tr v-if="these.partenairesRecherche && these.partenairesRecherche.length > 0" class="table-rows">
        <td>
          <strong>{{ $t('theseView.partenariat') }}&nbsp;:{{ '\xa0' }}</strong>
        </td>
        <td>
          <strong>{{ firstPartenaireKeyName + " : " }}</strong>
          <span v-for="(partenaire, index) in partenairesGroupedByType[firstPartenaireKeyName]" :key="partenaire.ppn"
            :class='partenaire.ppn ? "clickable lightblue" : ""' @click="linkTo(partenaire.ppn)">
            {{ partenaire.nom }} {{ (index < partenairesGroupedByType[firstPartenaireKeyName].length - 1) ? ' - ' : '' }}
              </span>
        </td>
      </tr>
      <!-- Partenariat x-eme ligne / premiere colonne vide -->
      <template v-for="(type, indexType) in partenairesGroupedByType" :key="indexType">
        <tr v-if="indexType !== firstPartenaireKeyName" class="table-rows">
          <td class="empty-first-cell-mandatory"></td>
          <td>
            <strong>{{ indexType + " : " }}</strong>
            <span v-for="(partenaire, index) in type" :class='partenaire.ppn ? "clickable lightblue" : ""'
              @click="linkTo(partenaire.ppn)">
              {{ partenaire.nom }} {{ (index < partenairesGroupedByType[partenaire.type].length - 1) ? ' - ' : '' }}
                </span>
          </td>
        </tr>
      </template>
      <!-- Jury -->
      <!-- Première ligne -->
      <tr v-if="(Object.keys(juryMembersGroupedByType).length > 0)" class="table-rows">
        <td>
          <strong>{{ $t('theseView.jury') }}&nbsp;:{{ '\xa0' }}</strong>
        </td>
        <td>
          <strong>{{ firstJuryMemberKeyName + " : " }}</strong>
          <span v-for="(member, index) in juryMembersGroupedByType[firstJuryMemberKeyName]" :key="member.ppn"
            :class='member.ppn ? "clickable lightblue" : ""' @click="linkTo(member.ppn)">
            {{ member.prenom }} {{ member.nom }}{{ (index < juryMembersGroupedByType[firstJuryMemberKeyName].length - 1)
              ? ', ' : '' }}</span>
        </td>
      </tr>
      <!-- Jury x-eme ligne / première colonne vide -->
      <template v-for="(type, indexType) in juryMembersGroupedByType" :key="indexType">
        <tr v-if="indexType !== firstJuryMemberKeyName" class="table-rows">
          <td class="empty-first-cell-mandatory"></td>
          <td>
            <strong>{{ indexType + " : " }}</strong>
            <span v-for="(member, index) in type" :class='member.ppn ? "clickable lightblue" : ""'
              @click="linkTo(member.ppn)">
              {{ member.prenom }} {{ member.nom }}{{ (index < juryMembersGroupedByType[indexType].length - 1) ? ', ' : ''
              }} </span>
          </td>
        </tr>
      </template>
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

const router = useRouter();
const partenairesGroupedByType = ref({});
const firstPartenaireKeyName = ref("");
const firstJuryMemberKeyName = ref("");
const juryMembersGroupedByType = ref({});
const juryMap = { 0: "Président", 1: "Examinateurs", 2: "Rapporteurs" };

// Regrouper les partenaires de recherche par type
partenairesGroupedByType.value = groupBy(props.these.partenairesRecherche, "type");
firstPartenaireKeyName.value = Object.keys(partenairesGroupedByType.value)[0];

// Regrouper les membres de jury par fonction
[props.these.presidentJury, props.these.membresJury, props.these.rapporteurs].forEach((juryMemberType, index) => {
  if ((typeof juryMemberType.nom === 'string' && juryMemberType.nom !== null) // Président (objet)
    ||
    (typeof juryMemberType.nom !== 'string' && juryMemberType.length > 0)) { // Autres membres (array d'objets)
    let key = juryMap[index];

    juryMembersGroupedByType.value[key] = (index === 0) ? [juryMemberType] : juryMemberType; // Type 0 = président : gestion différente car pas un array
  }
});
firstJuryMemberKeyName.value = Object.keys(juryMembersGroupedByType.value)[0];

/**
 * Functions
 */
function linkTo(id) {
  if (id) router.push("/" + id);
}

function groupBy(xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
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
  text-decoration: none;
}</style>