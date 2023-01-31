<template>
  <div class="facets">
    <v-expansion-panels rounded>
      <v-expansion-panel>
        <v-expansion-panel-title>
          STATUT
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-checkbox :label="`Soutenues : ${facets.soutenue}`" value="soutenues" v-model="filtres"></v-checkbox>
          <v-checkbox class="pl-4" :label="`Accessibles en ligne : ${facets.accessible}`" value="accessible"
            v-model="filtres"></v-checkbox>
          <v-checkbox :label="`En préparation : ${facets.enCours}`" value="enCours" v-model="filtres"></v-checkbox>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'

defineProps({
  facets: {
    type: Object
  }
})

const emit = defineEmits(['changeFiltres'])

let filtres = ref([]);

watch(filtres, async (newFiltres) => {
  if (newFiltres.length > 0)
    emit('changeFiltres', newFiltres);
})
</script>
<style scoped lang="scss">
@use 'vuetify/settings';

.facets {
  display: flex;
  justify-content: flex-start !important;
  align-self: center !important;
  flex-direction: column;
  padding-top: 2rem;

  .v-expansion-panels {
    width: 80%;
  }
}
</style>