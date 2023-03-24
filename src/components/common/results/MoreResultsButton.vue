<template>
  <div v-if="mobile && nbResult" class="text-center mt-5">
    <v-btn :loading="loading" flat size="large" append-icon="mdi-arrow-right-bold-circle-outline" color="primary" class="moreResultsButton"
           @click="incrementAffichage">
      {{ $t("resultatsView.plusDeResultats") }}</v-btn>
  </div>
</template>

<script setup>
import { useDisplay } from "vuetify";
import { ref } from "vue";

const { mobile } = useDisplay();
const emit = defineEmits(['updateNumber', 'search']);

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

let currentShowingNumber = ref(10);

function incrementAffichage() {
  currentShowingNumber.value += 10;
  emit('updateNumber', currentShowingNumber.value);
  emit('search');
}
</script>

<style scoped>
.moreResultsButton {
  z-index: 3;
}
</style>