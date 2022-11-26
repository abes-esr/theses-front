<template>
    <v-row>
      <v-col v-for="item in result" :key="item._source" cols="12" xs="12" md="6">
        <result-card :titre="item._source.titrePrincipal" :date="item._source.dateSoutenance"
                     :auteur="item._source.auteurs[0].prenom + ' ' + item._source.auteurs[0].nom"
                     :directeurs="item._source.directeurs" :discipline="item._source.discipline"
                     :etab="item._source.etabSoutenance.nom" :nnt="item._source.nnt">
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