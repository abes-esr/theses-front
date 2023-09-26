<template>
  <!--  Personnes-->
  <div v-if="domainNameChange === 'personnes'">
    <div v-for="(item, index) in result" :key="item.id" class="card-wrapper">
      <PersonnesResultsPersonnesCard :item="item" />
      <hr class="result-dividers" v-if="index < result.length - 1" />
    </div>
  </div>
  <!--  Thèses-->
  <div v-else-if="domainNameChange === 'theses'">
    <div v-for="(item, index) in result" :key="item" class="card-wrapper">
      <ThesesResultsResultCard :titre="item.titrePrincipal"
        :date="item.status === 'enCours' ? item.datePremiereInscriptionDoctorat : item.dateSoutenance"
        :auteur="item.auteurs" :directeurs="item.directeurs" :discipline="item.discipline" :etab="item.etabSoutenanceN"
        :id="item.id" :status="item.status">
      </ThesesResultsResultCard>
      <hr class="result-dividers" v-if="index < result.length - 1" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  result: {
    type: Array,
    required: true
  },
  domainNameChange: {
    type: String
  }
});
</script>

<style lang="scss">
.card-wrapper {
  margin-bottom: 1rem;
}
</style>