<template>
      <v-row>
        <v-col v-for="item in result" :key="item" cols="12">
          <result-card :titre="item.titrePrincipal" :date="item.dateSoutenance" :auteur="item.auteurs"
            :directeurs="item.directeurs" :discipline="item.discipline" :etab="item.etabSoutenanceN" :id="item.id"
            :status="item.status">
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