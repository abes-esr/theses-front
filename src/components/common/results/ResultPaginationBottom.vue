<template>
  <div class="result-pagination">
    <v-pagination class="pt-1" :length="nbPages"
      v-model="parentCurrentPage" total-visible="2"
      @update:modelValue="scrollToTop" >
    </v-pagination>
  </div>
</template>

<script setup>
// #TODO Généraliser avec ResultPaginationTop
import { ref, watch, computed } from "vue";
import { scrollToTop } from "@/services/Common";

const emit = defineEmits(["changePage"]);

const props = defineProps({
  nbResults: {
    type: Number,
    default: 1
  },
  currentNombre: {
    type: Number,
    default: 10
  },
  currentPage: {
    type: Number,
    default: 1
  }
});

let parentCurrentPage = ref(props.currentPage);
let nbPages = computed(() => {
  return Math.ceil(props.nbResults / props.currentNombre);
});

watch(parentCurrentPage, async (newCurrentPage) => {
  emit("changePage", newCurrentPage);
});

/**
 * Synchronisation avec les composants paginations frères
 */
watch(() => props.currentPage,
  (newValue) => {
    parentCurrentPage.value = newValue;
  });

watch(() => props.currentNombre,
  (newValue) => {
    nbPages = computed(() => {
      return Math.ceil(props.nbResults / newValue);
    });
  });

</script>

<style scoped lang="scss">
@use '../../../../node_modules/vuetify/settings';

.v-pagination {
  max-width: 40vw;
  flex: 1 0 auto;
  background-color: transparent;
}

.result-pagination {
  background-color: rgb(var(--v-theme-gris-clair));
  max-height: 4rem;
  justify-content: center;
}
</style>