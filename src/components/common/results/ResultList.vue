<template>
  <!--  Personnes-->
  <div v-if="domainNameChange === 'personnes'">
    <div v-for="(item, index) in result" :key="item.id" class="card-wrapper">
      <personnes-card :item="item" />
      <hr class="result-dividers" v-if="index < result.length - 1" />
    </div>
  </div>
  <!--  Thèses-->
  <div v-else-if="domainNameChange === 'theses'">
    <div v-for="(item, index) in result" :key="item" class="card-wrapper">
      <result-card :titre="item.titrePrincipal"
        :date="item.status === 'enCours' ? item.datePremiereInscriptionDoctorat : item.dateSoutenance"
        :auteur="item.auteurs" :directeurs="item.directeurs" :discipline="item.discipline" :etab="item.etabSoutenanceN"
        :id="item.id" :status="item.status">
      </result-card>
      <hr class="result-dividers" v-if="index < result.length - 1" />
    </div>
  </div>
</template>

<script setup>
import ResultCard from "@/components/theses/results/ResultCard.vue";
import PersonnesCard from "@/components/personnes/results/PersonnesCard.vue";

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

.result-dividers {
  border: 1px solid rgb(var(--v-theme-gris-clair));
  margin:0 1rem;
}
</style>