<template>
      <v-row>
        <v-col v-for="item in result" :key="item" cols="12">
          <result-card :titre="item.titrePrincipal" :date="item.dateSoutenance" :auteur="item.auteurs"
            :directeurs="item.directeurs" :discipline="item.discipline" :etab="item.etabSoutenanceN" :id="item.id"
            :status="item.status">
          </result-card>
        </v-col>
      </v-row>
      <!--  Ici boutton afficher plus pour portables-->
      <div v-if="mobile" class="text-center mt-5">
        <v-btn flat size="large" append-icon="mdi-arrow-right-bold-circle-outline" color="primary"
          @click="incrementAffichage">
          Plus de résultats</v-btn>
      </div>
</template>

<script setup>
import ResultCard from '@/components/theses/results/ResultCard.vue';
import { ref } from "vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const emit = defineEmits(['changeNombre'] )
let currentNombre = ref(10);

defineProps({
  result: {
    type: Array,
    required: true
  }
})

function incrementAffichage() {
  currentNombre.value += 10;
  emit('changeNombre', currentNombre.value);
}

</script>

<style scoped>

</style>