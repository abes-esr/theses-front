<template>
  <div v-if="mobile && nbResult" class="text-center mt-5">
    <v-btn :loading="loading" flat size="large" append-icon="mdi-arrow-right-bold-circle-outline" color="primary" class="moreResultsButton"
           @click="incrementAffichage">
      {{ $t("resultatsView.plusDeResultats") }}</v-btn>
  </div>
</template>

<script setup>
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();
const emit = defineEmits(['addTenResultsToList']);

defineProps({
  nbResult: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  }
})

function incrementAffichage() {
  emit('addTenResultsToList');
}
</script>

<style scoped>
.moreResultsButton {
  z-index: 3;
  font-size: 21px;
}
</style>