<template>
  <v-row>
    <v-col v-for="item in result" :key="item" cols="12" xs="12" md="6">
      <result-card :titre="item.titrePrincipal" :date="item.dateSoutenance"
        :auteur="item.auteurs[0].prenom + ' ' + item.auteurs[0].nom" :directeurs="item.directeurs"
        :discipline="item.discipline" :etab="item.etabSoutenanceN" :nnt="item.nnt">
      </result-card>
    </v-col>
  </v-row>
</template>

<script setup>
import ResultCard from '@/components/theses/results/ResultCard.vue';
defineProps({
  result: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>

</style>