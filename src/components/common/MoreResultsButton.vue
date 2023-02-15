<template>
  <div v-if="mobile && greaterThanZero(nbResults)" class="text-center mt-5">
    <v-btn flat size="large" append-icon="mdi-arrow-right-bold-circle-outline" color="primary"
           @click="incrementAffichage">
      {{ $t("resultatsView.plusDeResultats") }}</v-btn>
  </div>
</template>

<script>
  export default {
    name: "ScrollToTopButton"
  }
</script>

<script setup>
import { useDisplay } from "vuetify";
import { ref } from "vue";

const { mobile } = useDisplay();
const emit = defineEmits(['changeNombre'] )
const props = defineProps({
  nbResults: {
    type: Number,
    default: 0
  }
})

let currentNombre = ref(10);

function incrementAffichage() {
  currentNombre.value += 10;
  emit('changeNombre', currentNombre.value);
}

/**
 * Booléen qui affiche le bouton seulement si la recherche retourne des résultats
 * @param nb
 * @returns {boolean}
 */
function greaterThanZero(nb) {
  return (nb != null) && (nb > 0);
}
</script>

<style scoped>

</style>