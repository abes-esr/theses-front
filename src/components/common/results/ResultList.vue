<template>
<!--  Personnes-->
    <v-row v-if="domainNameChange === 'personnes'">
      <v-col v-for="item in result" :key="item.id" cols="12">
        <personnes-card :item="item" />
      </v-col>
    </v-row>
<!--  Thèses-->
    <v-row v-else-if="domainNameChange === 'theses'">
      <v-col v-for="item in result" :key="item" cols="12">
        <result-card :titre="item.titrePrincipal" :date="item.dateSoutenance" :auteur="item.auteurs"
                     :directeurs="item.directeurs" :discipline="item.discipline" :etab="item.etabSoutenanceN"
                     :id="item.id"
                     :status="item.status">
        </result-card>
      </v-col>
    </v-row>
</template>


<script setup>
import PersonnesCard from '@/components/personnes/results/PersonnesCard.vue';
import ResultCard from '@/components/theses/results/ResultCard.vue';

defineProps({
  result: {
    type: Array,
    required: true
  },
  domainNameChange: {
    type: String
  }
});
</script>

<style scoped>

</style>