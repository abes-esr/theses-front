<template>
  <div v-if="nbResult">
    <button class="scroll-to-top-button" @click="scrollToTop" :title='$t("top")'>
      <div>
        <div class="circle"></div>
        <v-icon class="scroll-to-top-icon" size="35">mdi-chevron-up-box</v-icon>
      </div>
    </button>
  </div>
</template>

<script setup>
import { scrollToTop } from "@/services/Common";

defineProps({
  nbResult: {
    type: Number,
    default: 0
  }
});
</script>

<script>
export default {
  name: "ScrollToTopButton"
};
</script>

<style scoped lang="scss">
.scroll-to-top-button {
  z-index: 2;
}

.scroll-to-top-icon {
  color: rgb(var(--v-theme-orange-abes));
}

.circle {
  border-radius: 50%;
  width: 25px;
  height: 25px;
  position: absolute;
  top: 5px;
  left: 5px;
  background: rgb(var(--v-theme-gris-clair));
}
</style>