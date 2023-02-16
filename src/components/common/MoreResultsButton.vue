<template>
  <div v-if="mobile && nbResult" class="text-center mt-5">
    <v-btn :loading="loading" flat size="large" append-icon="mdi-arrow-right-bold-circle-outline" color="primary" class="more-results-button"
           @click="incrementAffichage">
      {{ $t("resultatsView.plusDeResultats") }}</v-btn>
  </div>
</template>

<script setup>
import { useDisplay } from "vuetify";
import { ref } from "vue";

const { mobile } = useDisplay();
const emit = defineEmits(['changeNombre'] )
const props = defineProps({
  nbResult: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  }
})

let currentNombre = ref(10);

function incrementAffichage() {
  currentNombre.value += 10;
  emit('changeNombre', currentNombre.value);
}
</script>

<style scoped>
.more-results-button {
  z-index: 3;
}
</style>