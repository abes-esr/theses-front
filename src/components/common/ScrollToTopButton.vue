<template>
  <div v-if="nbResult" class="scrollTopWrapper">
    <button class="scrollTopButton" @click="scrollToTop">
      <div class="circle"></div>
      <v-icon class="scrollTopIcon" size="35">mdi-chevron-up-box
      </v-icon>
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
  })
</script>

<script>
export default {
  name: "ScrollToTopButton"
};
</script>

<style scoped lang="scss">

.scrollTopIcon {
  color: rgb(var(--v-theme-orange-abes));
}

.scrollTopButton {
}

.scrollTopWrapper {
  display:  flex;
  justify-content: center;
  z-index: 2;
  top: 90%;
  position: sticky;
}

.circle {
  border-radius: 50%;
  width: 25px;
  height: 25px;
  position: relative;
  top: 30px;
  left: 5px;
  background: rgb(var(--v-theme-gris-clair));
}
</style>