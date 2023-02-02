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
import { thesesAPIService } from "@/services/ThesesAPI";

defineProps({
  facets: {
    type: Object
  }
})


const { modifierFiltres } = thesesAPIService();

let filtres = ref([]);

watch(filtres, async (newFiltres) => {
  if (newFiltres.includes("accessible"))
    filtres.value.push("soutenues")

  modifierFiltres(newFiltres);
})
</script>
<style scoped lang="scss">
@use 'vuetify/settings';

.facets {
  display: flex;
  flex-direction: column;
  padding-top: 2rem;

  .v-expansion-panels {
    width: 80%;
  }
}
</style>