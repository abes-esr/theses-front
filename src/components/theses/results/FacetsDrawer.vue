<template>
  <div class="facets">
    <v-expansion-panels rounded>
      <v-expansion-panel>
        <v-expansion-panel-title>
          STATUT
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-checkbox :label="`Soutenues : ${facets.soutenue}`"></v-checkbox>
          <v-checkbox class="pl-4" :label="`Accessibles en ligne : ${facets.accessible}`"></v-checkbox>
          <v-checkbox :label="`En préparation : ${facets.enCours}`"></v-checkbox>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script setup>
defineProps({
  facets: {
    type: Object
  }
})
</script>
<style scoped lang="scss">
@use 'vuetify/settings';

.facets {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-top: 2rem;

  .v-expansion-panels {
    width: 80%;
  }
}
</style>